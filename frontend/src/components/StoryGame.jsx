import { useState } from "react"
import { Star, Ornament } from "./Art.jsx"

const LETTERS = ["A", "B", "C", "D", "E"]

function StoryGame({ story, onNewStory }) {
  // history holds the node ids visited so far; the last one is the page being read.
  const [history, setHistory] = useState([story.root_node.id])

  const currentId = history[history.length - 1]
  const node = story.all_nodes[currentId]
  const options = !node.is_ending && node.options ? node.options : []
  const choicesMade = history.length - 1

  const choose = (nodeId) => {
    if (story.all_nodes[nodeId]) setHistory((h) => [...h, nodeId])
  }
  const goBack = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
  const restart = () => setHistory([story.root_node.id])

  return (
    <article className="game">
      <header className="game-head">
        <h1>{story.title}</h1>
        <ol className="trail-bar" aria-label={`${choicesMade} choices made`}>
          {history.map((id, i) => (
            <li key={`${id}-${i}`} className={i === history.length - 1 ? "here" : "past"} />
          ))}
        </ol>
      </header>

      <div className="page" key={currentId}>
        <p className="page-text">{node.content}</p>

        {node.is_ending ? (
          <div className={`ending ${node.is_winning_ending ? "ending-win" : "ending-lose"}`}>
            {node.is_winning_ending && <Star />}
            <h2>{node.is_winning_ending ? "You found the winning path" : "The end"}</h2>
            <p>
              {node.is_winning_ending
                ? `You made it in ${choicesMade} ${choicesMade === 1 ? "choice" : "choices"}.`
                : `This path ended after ${choicesMade} ${choicesMade === 1 ? "choice" : "choices"}. Another path may end differently.`}
            </p>
            <div className="ending-actions">
              <button className="btn btn-sand" onClick={restart}>Play again</button>
              {choicesMade > 0 && <button className="btn btn-ghost" onClick={goBack}>Undo last choice</button>}
              <button className="btn btn-ghost" onClick={onNewStory}>New story</button>
            </div>
          </div>
        ) : (
          <>
            <Ornament />
            <h2 className="prompt">What will you do?</h2>
            <div className="options">
              {options.map((option, i) => (
                <button key={i} className="option" onClick={() => choose(option.node_id)}>
                  <span className="option-letter">{LETTERS[i] ?? i + 1}</span>
                  <span className="option-text">{option.text}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {!node.is_ending && (
        <footer className="game-tools">
          <button className="link-btn" onClick={goBack} disabled={choicesMade === 0}>Undo last choice</button>
          <button className="link-btn" onClick={restart} disabled={choicesMade === 0}>Restart</button>
          <button className="link-btn" onClick={onNewStory}>New story</button>
        </footer>
      )}
    </article>
  )
}

export default StoryGame
