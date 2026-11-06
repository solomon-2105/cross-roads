import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import StoryLoader from "./components/StoryLoader.jsx"
import StoryGenerator from "./components/StoryGenerator.jsx"
import NotFound from "./components/NotFound.jsx"
import { LogoMark } from "./components/Art.jsx"

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Crossroads home">
        <LogoMark />
        <span>Crossroads</span>
      </Link>
      <nav className="site-nav" aria-label="Main">
        <a href="/#how-it-works">How it works</a>
        <Link to="/" className="nav-cta">New story</Link>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <LogoMark />
      <p>Crossroads writes every story fresh with Google Gemini. No two adventures are the same.</p>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<StoryGenerator />} />
            <Route path="/story/:id" element={<StoryLoader />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
