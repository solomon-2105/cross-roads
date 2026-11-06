// All illustrations are inline SVG so the site has no image files to manage.

export function LogoMark({ size = 34 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="currentColor" opacity="0.14" />
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 54V34" />
        <path d="M32 34C32 26 22 24 18 14" />
        <path d="M32 34C32 26 42 24 46 14" />
      </g>
      <circle cx="18" cy="12" r="4.5" fill="currentColor" />
      <circle cx="46" cy="12" r="4.5" fill="currentColor" />
    </svg>
  )
}

const STARS = [
  [60, 70, 2.2], [120, 120, 1.6], [200, 60, 2], [470, 60, 1.8], [520, 140, 2.4],
  [90, 210, 1.5], [510, 250, 1.6], [180, 150, 1.4], [300, 40, 1.6],
]

// The hero illustration: a moon, two mountain ranges and a trail that forks.
// The lettered nodes (A, B, C) match the option letters used in the story view.
export function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 560 560" role="img" aria-label="A trail that forks into three paths under a pale moon">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5EBD0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F5EBD0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="trailfade" gradientUnits="userSpaceOnUse" x1="0" y1="556" x2="0" y2="450">
          <stop offset="0%" stopColor="#F5EBD0" stopOpacity="0" />
          <stop offset="100%" stopColor="#F5EBD0" stopOpacity="1" />
        </linearGradient>
      </defs>

      {STARS.map(([x, y, r], i) => (
        <circle key={i} className="star" cx={x} cy={y} r={r} fill="#F5EBD0" style={{ animationDelay: `${i * 0.45}s` }} />
      ))}

      <circle cx="360" cy="200" r="210" fill="url(#glow)" />
      <circle cx="360" cy="200" r="130" fill="#F5EBD0" />
      <circle cx="360" cy="200" r="112" fill="none" stroke="#7F011F" strokeOpacity="0.18" strokeWidth="1.5" />
      <circle cx="318" cy="165" r="20" fill="#7F011F" opacity="0.09" />
      <circle cx="398" cy="238" r="28" fill="#7F011F" opacity="0.08" />
      <circle cx="402" cy="148" r="11" fill="#7F011F" opacity="0.1" />

      <g className="trail" fill="none" stroke="url(#trailfade)" strokeWidth="7" strokeLinecap="round">
        <path pathLength="1" d="M280 552 C280 505 280 470 280 440" style={{ animationDelay: "0.2s" }} />
        <path pathLength="1" d="M280 440 C280 380 170 380 150 300" style={{ animationDelay: "0.9s" }} />
        <path pathLength="1" d="M280 440 C280 380 280 340 280 300" style={{ animationDelay: "1s" }} />
        <path pathLength="1" d="M280 440 C280 380 390 380 420 300" style={{ animationDelay: "1.1s" }} />
        <path pathLength="1" strokeWidth="5" d="M150 300 C150 260 100 250 85 205" style={{ animationDelay: "1.7s" }} />
        <path pathLength="1" strokeWidth="5" d="M150 300 C150 250 200 240 215 195" style={{ animationDelay: "1.8s" }} />
      </g>

      <g className="nodes" fontFamily="Jost, sans-serif" fontWeight="600" fontSize="22" textAnchor="middle">
        {[
          [150, 300, "A"], [280, 300, "B"], [420, 300, "C"],
        ].map(([x, y, l], i) => (
          <g key={l} className="node" style={{ animationDelay: `${1.5 + i * 0.1}s` }}>
            <circle cx={x} cy={y} r="24" fill="#7F011F" stroke="#F5EBD0" strokeWidth="5" />
            <text x={x} y={y + 7.5} fill="#F5EBD0">{l}</text>
          </g>
        ))}
        {[[85, 205], [215, 195]].map(([x, y], i) => (
          <g key={i} className="node" style={{ animationDelay: `${2.2 + i * 0.1}s` }}>
            <circle cx={x} cy={y} r="11" fill="#7F011F" stroke="#F5EBD0" strokeWidth="4" />
            <circle cx={x} cy={y} r="3.5" fill="#E8C873" />
          </g>
        ))}
      </g>
    </svg>
  )
}

// Layered mountain skyline at the bottom of the hero; the sand layer blends into the page.
// Absolute [x, y] peaks; every layer starts at x=0 and ends at x=1440 so it spans the full width.
const RIDGES = [
  { fill: "#6B0119", pts: [[0, 120], [110, 40], [200, 110], [320, 14], [430, 114], [530, 54], [660, 144], [780, 60], [890, 140], [1020, 70], [1140, 134], [1260, 76], [1360, 120], [1440, 70]] },
  { fill: "#4E0112", pts: [[0, 150], [90, 96], [190, 156], [300, 86], [420, 160], [520, 110], [660, 180], [770, 118], [890, 178], [1010, 118], [1140, 164], [1270, 100], [1360, 150], [1440, 112]] },
  { fill: "#F5EBD0", pts: [[0, 176], [80, 148], [150, 178], [240, 138], [320, 182], [420, 130], [510, 178], [620, 142], [710, 174], [830, 124], [930, 170], [1020, 142], [1130, 184], [1220, 150], [1330, 188], [1440, 160]] },
]

export function Horizon() {
  return (
    <svg className="horizon" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
      {RIDGES.map(({ fill, pts }) => (
        <path key={fill} fill={fill} d={`M0 220 ${pts.map(([x, y]) => `L${x} ${y}`).join(" ")} L1440 220Z`} />
      ))}
    </svg>
  )
}

export function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 240 20" aria-hidden="true">
      <path d="M0 10H98M142 10H240" stroke="currentColor" strokeWidth="1.5" />
      <path d="M120 2L128 10L120 18L112 10Z" fill="currentColor" />
      <circle cx="104" cy="10" r="2" fill="currentColor" />
      <circle cx="136" cy="10" r="2" fill="currentColor" />
    </svg>
  )
}

export function Compass() {
  const ticks = Array.from({ length: 24 }, (_, i) => i)
  return (
    <svg className="compass" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="none" stroke="#F5EBD0" strokeWidth="3" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="#F5EBD0" strokeOpacity="0.4" strokeWidth="1.5" />
      {ticks.map((i) => (
        <line
          key={i}
          x1="100" y1="10" x2="100" y2={i % 6 === 0 ? 26 : 18}
          stroke="#F5EBD0" strokeWidth={i % 6 === 0 ? 3 : 1.5} strokeLinecap="round"
          transform={`rotate(${i * 15} 100 100)`}
        />
      ))}
      <g className="compass-needle">
        <path d="M100 38L112 100H88Z" fill="#F5EBD0" />
        <path d="M100 162L112 100H88Z" fill="#E8C873" />
      </g>
      <circle cx="100" cy="100" r="7" fill="#7F011F" stroke="#F5EBD0" strokeWidth="3" />
    </svg>
  )
}

export function Star() {
  return (
    <svg className="win-star" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4L39 24L60 25L43 38L49 59L32 47L15 59L21 38L4 25L25 24Z" fill="#E8C873" stroke="#F5EBD0" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}
