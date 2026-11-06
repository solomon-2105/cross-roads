import { useState } from "react"

const IDEAS = [
  "Pirates", "Haunted lighthouse", "Space station", "Medieval castle",
  "Cyberpunk city", "Lost jungle temple", "Desert caravan", "Underwater kingdom",
]

function ThemeInput({ onSubmit }) {
  const [theme, setTheme] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!theme.trim()) {
      setError("Type a theme or pick one below.")
      return
    }
    onSubmit(theme.trim())
  }

  const pick = (idea) => {
    setTheme(idea)
    setError("")
  }

  return (
    <form className="theme-card" onSubmit={handleSubmit} noValidate>
      <h2>Where does your story begin?</h2>
      <p className="theme-hint">Name a place, a genre or a mood. Crossroads writes the rest.</p>

      <label className="sr-only" htmlFor="theme">Story theme</label>
      <div className="theme-row">
        <input
          id="theme"
          type="text"
          value={theme}
          maxLength={80}
          autoComplete="off"
          onChange={(e) => { setTheme(e.target.value); setError("") }}
          placeholder="For example: pirates, space, medieval"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "theme-error" : undefined}
        />
        <button type="submit" className="btn btn-primary">Write my story</button>
      </div>
      {error && <p id="theme-error" className="field-error" role="alert">{error}</p>}

      <div className="chips" role="group" aria-label="Theme ideas">
        {IDEAS.map((idea) => (
          <button
            type="button"
            key={idea}
            className={`chip${theme === idea ? " chip-active" : ""}`}
            onClick={() => pick(idea)}
          >
            {idea}
          </button>
        ))}
      </div>
    </form>
  )
}

export default ThemeInput
