import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import LoadingStatus from "./LoadingStatus.jsx"
import StoryGame from "./StoryGame.jsx"
import { API_BASE_URL } from "../util.js"

function StoryLoader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadStory = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`${API_BASE_URL}/stories/${id}/complete`)
        if (!cancelled) setStory(response.data)
      } catch (err) {
        if (cancelled) return
        setError(err.response?.status === 404 ? "This story does not exist." : "The story could not be loaded.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStory()
    return () => { cancelled = true }
  }, [id])

  const createNewStory = () => navigate("/")

  if (loading) {
    return (
      <div className="stage stage-wine">
        <LoadingStatus theme="story" />
      </div>
    )
  }

  if (error) {
    return (
      <section className="notice">
        <h2>Story not found</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={createNewStory}>Write a new story</button>
      </section>
    )
  }

  return story ? <StoryGame story={story} onNewStory={createNewStory} /> : null
}

export default StoryLoader
