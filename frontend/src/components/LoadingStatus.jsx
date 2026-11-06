import { useEffect, useState } from "react"
import { Compass } from "./Art.jsx"

const STEPS = [
  "Drawing the map",
  "Placing the dangers",
  "Hiding the winning path",
  "Writing the first page",
  "Sealing the endings",
]

function LoadingStatus({ theme }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="loading" aria-live="polite">
      <Compass />
      <h2>Writing your {theme} story</h2>
      <p className="loading-step" key={step}>{STEPS[step]}</p>
      <p className="loading-note">This usually takes 10 to 30 seconds.</p>
    </section>
  )
}

export default LoadingStatus
