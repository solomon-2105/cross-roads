import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ThemeInput from "./ThemeInput.jsx"
import LoadingStatus from "./LoadingStatus.jsx"
import { HeroArt, Horizon, Ornament } from "./Art.jsx"
import { API_BASE_URL } from "../util.js"

const POLL_MS = 2000

function StoryGenerator() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState("")
  const [jobId, setJobId] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Poll the job until it finishes. Polls while the status is "pending" or "processing".
  useEffect(() => {
    if (!jobId) return
    let cancelled = false
    let timer

    const tick = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/jobs/${jobId}`)
        if (cancelled) return

        if (data.status === "completed" && data.story_id) {
          setLoading(false)
          navigate(`/story/${data.story_id}`)
          return
        }
        if (data.status === "failed" || data.error) {
          setError(data.error || "The story could not be generated.")
          setLoading(false)
          setJobId(null)
          return
        }
      } catch (e) {
        if (cancelled) return
        if (e.response?.status !== 404) {
          setError(`Could not check the story status: ${e.message}`)
          setLoading(false)
          setJobId(null)
          return
        }
      }
      timer = setTimeout(tick, POLL_MS)
    }

    tick()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [jobId, navigate])

  const generateStory = async (value) => {
    setLoading(true)
    setError(null)
    setTheme(value)

    try {
      const response = await axios.post(`${API_BASE_URL}/stories/create`, { theme: value })
      setJobId(response.data.job_id)
    } catch (e) {
      setLoading(false)
      setError(`Could not reach the story server: ${e.message}`)
    }
  }

  const reset = () => {
    setJobId(null)
    setError(null)
    setTheme("")
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="stage stage-wine">
        <LoadingStatus theme={theme} />
      </div>
    )
  }

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Every choice writes a different ending.</h1>
            <p>
              Give Crossroads a theme and it builds a branching adventure just for you,
              with dangers to dodge and one path that wins.
            </p>
            <a className="btn btn-sand" href="#start">Pick a theme</a>
          </div>
          <HeroArt />
        </div>
        <Horizon />
      </section>

      <section className="start" id="start">
        {error ? (
          <div className="theme-card error-card" role="alert">
            <h2>The story did not get written</h2>
            <p className="error-detail">{String(error).slice(0, 300)}</p>
            <button className="btn btn-primary" onClick={reset}>Try again</button>
          </div>
        ) : (
          <ThemeInput onSubmit={generateStory} />
        )}
      </section>

      <section className="how" id="how-it-works">
        <Ornament />
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <span className="step-num">1</span>
            <h3>Choose a theme</h3>
            <p>Anything works, from a haunted lighthouse to a heist on Mars.</p>
          </li>
          <li>
            <span className="step-num">2</span>
            <h3>Gemini writes the tale</h3>
            <p>It plans every branch, trap and ending before you read the first line.</p>
          </li>
          <li>
            <span className="step-num">3</span>
            <h3>Pick your path</h3>
            <p>Each choice changes what happens next. Go back, restart or find another ending.</p>
          </li>
        </ol>
      </section>
    </>
  )
}

export default StoryGenerator
