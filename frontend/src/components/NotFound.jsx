import { Link } from "react-router-dom"

function NotFound() {
  return (
    <section className="notice">
      <h2>This path leads nowhere</h2>
      <p>The page you asked for does not exist.</p>
      <Link to="/" className="btn btn-primary">Back to the start</Link>
    </section>
  )
}

export default NotFound
