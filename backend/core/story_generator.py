from sqlalchemy.orm import Session

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

from core.config import settings
from core.prompts import STORY_PROMPT
from models.story import Story, StoryNode
from core.models import StoryLLMResponse, StoryNodeLLM
from dotenv import load_dotenv
import os

load_dotenv()

class StoryGenerator:

    @classmethod
    def _get_llm(cls):
        api_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is missing. Add it to backend/.env and restart the backend."
            )

        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=api_key,
            temperature=0.9,
            max_retries=2,
            response_mime_type="application/json",
        )

    @staticmethod
    def _response_to_text(raw_response) -> str:
        # Gemini can return the message content as a plain string or as a list of parts.
        content = getattr(raw_response, "content", raw_response)
        if isinstance(content, list):
            return "".join(
                part if isinstance(part, str) else part.get("text", "")
                for part in content
                if isinstance(part, str) or (isinstance(part, dict) and part.get("type", "text") == "text")
            )
        return content

    @classmethod
    def generate_story(cls, db: Session, session_id: str, theme: str = "fantasy")-> Story:
        llm = cls._get_llm()
        story_parser = PydanticOutputParser(pydantic_object=StoryLLMResponse)

        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                STORY_PROMPT
            ),
            (
                "human",
                "Create the story with this theme: {theme}"
            )
        ]).partial(format_instructions=story_parser.get_format_instructions())

        raw_response = llm.invoke(prompt.invoke({"theme": theme}))
        response_text = cls._response_to_text(raw_response)

        story_structure = story_parser.parse(response_text)

        story_db = Story(title=story_structure.title, session_id=session_id)
        db.add(story_db)
        db.flush()

        root_node_data = story_structure.rootNode
        if isinstance(root_node_data, dict):
            root_node_data = StoryNodeLLM.model_validate(root_node_data)

        cls._process_story_node(db, story_db.id, root_node_data, is_root=True)

        db.commit()
        return story_db

    @classmethod
    def _process_story_node(cls, db: Session, story_id: int, node_data: StoryNodeLLM, is_root: bool = False) -> StoryNode:
        node = StoryNode(
            story_id=story_id,
            content=node_data.content if hasattr(node_data, "content") else node_data["content"],
            is_root=is_root,
            is_ending=node_data.isEnding if hasattr(node_data, "isEnding") else node_data["isEnding"],
            is_winning_ending=node_data.isWinningEnding if hasattr(node_data, "isWinningEnding") else node_data["isWinningEnding"],
            options=[]
        )
        db.add(node)
        db.flush()

        if not node.is_ending and (hasattr(node_data, "options") and node_data.options):
            options_list = []
            for option_data in node_data.options:
                next_node = option_data.nextNode

                if isinstance(next_node, dict):
                    next_node = StoryNodeLLM.model_validate(next_node)

                child_node = cls._process_story_node(db, story_id, next_node, False)

                options_list.append({
                    "text": option_data.text,
                    "node_id": child_node.id
                })

            node.options = options_list

        db.flush()
        return node