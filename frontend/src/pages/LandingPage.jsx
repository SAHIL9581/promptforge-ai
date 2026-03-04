import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected once at mount)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #040610;
    --surface:  #0a0f1e;
    --cyan:     #00e5ff;
    --cyan-dim: #00b8cc;
    --purple:   #7c3aed;
    --purple2:  #a855f7;
    --gold:     #f59e0b;
    --text:     #e2e8f0;
    --muted:    #64748b;
    --border:   rgba(0,229,255,.12);
    --glow-c:   rgba(0,229,255,.35);
    --glow-p:   rgba(124,58,237,.35);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--cyan-dim); border-radius: 4px; }

  /* grid bg */
  .grid-bg {
    background-image:
      linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* glow text */
  .glow-cyan { text-shadow: 0 0 20px var(--glow-c), 0 0 40px var(--glow-c); }
  .glow-purple { text-shadow: 0 0 20px var(--glow-p), 0 0 40px var(--glow-p); }

  /* gradient text */
  .grad-text {
    background: linear-gradient(135deg, var(--cyan) 0%, var(--purple2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* glass card */
  .glass {
    background: rgba(10,15,30,.6);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* buttons */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px;
    background: linear-gradient(135deg, var(--cyan) 0%, var(--cyan-dim) 100%);
    color: #000;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    border: none; border-radius: 8px;
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 0 20px var(--glow-c);
    text-decoration: none;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 40px var(--glow-c);
  }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.2), transparent);
    opacity: 0; transition: opacity .2s;
  }
  .btn-primary:hover::after { opacity: 1; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 32px;
    background: transparent;
    color: var(--cyan);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    border: 1px solid var(--cyan);
    border-radius: 8px;
    cursor: pointer;
    transition: all .2s;
    text-decoration: none;
  }
  .btn-ghost:hover {
    background: rgba(0,229,255,.08);
    box-shadow: 0 0 20px var(--glow-c);
  }

  /* animations */
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-16px); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.8); opacity: 0;  }
  }
  @keyframes scan-line {
    0%   { top: 0%; }
    100% { top: 100%; }
  }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  @keyframes spin-reverse { to { transform: rotate(-360deg); } }
  @keyframes blink { 0%,100%{ opacity:1 } 50%{ opacity:0 } }
  @keyframes slide-up {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fade-in {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes count-up {
    from { opacity:0; transform:scale(.8); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes particle-drift {
    0%   { transform:translate(0,0) scale(1); opacity:.7; }
    50%  { transform:translate(var(--dx),var(--dy)) scale(1.2); opacity:1; }
    100% { transform:translate(0,0) scale(1); opacity:.7; }
  }

  .animate-float   { animation: float 4s ease-in-out infinite; }
  .animate-spin-slow   { animation: spin-slow 20s linear infinite; }
  .animate-spin-reverse{ animation: spin-reverse 15s linear infinite; }

  /* feature card hover */
  .feat-card {
    transition: transform .3s, box-shadow .3s, border-color .3s;
    cursor: default;
  }
  .feat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,229,255,.12), 0 0 0 1px rgba(0,229,255,.3);
    border-color: rgba(0,229,255,.3) !important;
  }

  /* step connector line */
  .step-line {
    position: absolute; top: 32px; left: 50%;
    width: calc(100% - 64px); height: 1px;
    background: linear-gradient(90deg, var(--cyan), var(--purple));
    opacity: .25;
  }

  /* radar ring animation */
  @keyframes radar-pulse {
    0%   { stroke-dashoffset: 502; }
    100% { stroke-dashoffset: 0; }
  }

  /* nav scroll effect handled inline */
  .nav-scrolled {
    background: rgba(4,6,16,.9) !important;
    border-bottom: 1px solid var(--border) !important;
  }

  /* section fade-in on scroll */
  .reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity .7s ease, transform .7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* typing cursor */
  .cursor { animation: blink 1s step-end infinite; }

  /* badge pill */
  .badge-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px;
    border: 1px solid rgba(0,229,255,.25);
    border-radius: 999px;
    background: rgba(0,229,255,.06);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--cyan);
    letter-spacing: .5px;
  }

  /* dimension bar */
  .dim-bar-fill {
    height: 4px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--cyan), var(--purple2));
    animation: grow-bar .8s ease forwards;
    transform-origin: left;
  }
  @keyframes grow-bar {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  /* testimonial card */
  .testi-card { transition: transform .3s; }
  .testi-card:hover { transform: scale(1.02); }

  /* noise overlay */
  .noise::after {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: .4;
  }
`;

/* ─────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────── */
function Particles() {
        const particles = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                dx: `${(Math.random() - .5) * 60}px`,
                dy: `${(Math.random() - .5) * 60}px`,
                duration: Math.random() * 6 + 4,
                delay: Math.random() * 4,
                color: Math.random() > .5 ? "var(--cyan)" : "var(--purple2)",
        }));
        return (
                <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                        {particles.map(p => (
                                <div
                                        key={p.id}
                                        style={{
                                                position: "absolute",
                                                left: `${p.x}%`,
                                                top: `${p.y}%`,
                                                width: p.size,
                                                height: p.size,
                                                borderRadius: "50%",
                                                background: p.color,
                                                "--dx": p.dx,
                                                "--dy": p.dy,
                                                animation: `particle-drift ${p.duration}s ${p.delay}s ease-in-out infinite`,
                                                filter: "blur(0.5px)",
                                                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                                        }}
                                />
                        ))}
                </div>
        );
}

/* ─────────────────────────────────────────────
   TYPING ANIMATION
───────────────────────────────────────────── */
function TypingText({ words }) {
        const [idx, setIdx] = useState(0);
        const [displayed, setDisplayed] = useState("");
        const [deleting, setDeleting] = useState(false);

        useEffect(() => {
                const word = words[idx];
                if (!deleting && displayed === word) {
                        const t = setTimeout(() => setDeleting(true), 1800);
                        return () => clearTimeout(t);
                }
                if (deleting && displayed === "") {
                        setDeleting(false);
                        setIdx(i => (i + 1) % words.length);
                        return;
                }
                const speed = deleting ? 50 : 90;
                const t = setTimeout(() => {
                        setDisplayed(d => deleting ? d.slice(0, -1) : word.slice(0, d.length + 1));
                }, speed);
                return () => clearTimeout(t);
        }, [displayed, deleting, idx, words]);

        return (
                <span className="grad-text">
                        {displayed}<span className="cursor">|</span>
                </span>
        );
}

/* ─────────────────────────────────────────────
   HERO VISUAL – animated prompt card
───────────────────────────────────────────── */
function HeroVisual() {
        const [score, setScore] = useState(0);
        useEffect(() => {
                let v = 0;
                const t = setInterval(() => {
                        v += 2;
                        setScore(Math.min(v, 92));
                        if (v >= 92) clearInterval(t);
                }, 20);
                return () => clearInterval(t);
        }, []);

        const dims = [
                { label: "Clarity", pct: 88, color: "#00e5ff" },
                { label: "Specificity", pct: 76, color: "#a855f7" },
                { label: "Context", pct: 94, color: "#00e5ff" },
                { label: "Creativity", pct: 82, color: "#a855f7" },
                { label: "Completeness", pct: 70, color: "#00e5ff" },
                { label: "Efficiency", pct: 85, color: "#a855f7" },
                { label: "Adaptability", pct: 78, color: "#00e5ff" },
                { label: "Impact", pct: 91, color: "#a855f7" },
        ];

        return (
                <div className="animate-float" style={{ position: "relative", width: "100%", maxWidth: 480 }}>
                        {/* outer glow ring */}
                        <div style={{
                                position: "absolute", inset: -40,
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(0,229,255,.08) 0%, transparent 70%)",
                                pointerEvents: "none",
                        }} />

                        {/* spinning ring */}
                        <div className="animate-spin-slow" style={{
                                position: "absolute", inset: -24,
                                borderRadius: "50%",
                                border: "1px dashed rgba(0,229,255,.2)",
                                pointerEvents: "none",
                        }} />
                        <div className="animate-spin-reverse" style={{
                                position: "absolute", inset: -8,
                                borderRadius: "50%",
                                border: "1px dashed rgba(168,85,247,.2)",
                                pointerEvents: "none",
                        }} />

                        {/* main card */}
                        <div className="glass" style={{
                                borderRadius: 20, padding: "28px 28px 24px",
                                position: "relative", overflow: "hidden",
                        }}>
                                {/* scan line */}
                                <div style={{
                                        position: "absolute", left: 0, right: 0, height: 2,
                                        background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
                                        animation: "scan-line 3s linear infinite",
                                        opacity: .4, pointerEvents: "none",
                                }} />

                                {/* header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{
                                                        width: 36, height: 36, borderRadius: 10,
                                                        background: "linear-gradient(135deg, var(--cyan), var(--purple))",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 18,
                                                }}>⚡</div>
                                                <div>
                                                        <div style={{ fontFamily: "Orbitron", fontSize: 11, color: "var(--cyan)", letterSpacing: 1 }}>PROMPT EVALUATED</div>
                                                        <div style={{ fontSize: 12, color: "var(--muted)" }}>GPT-3.5 Turbo · 8 Dimensions</div>
                                                </div>
                                        </div>
                                        <div style={{
                                                fontFamily: "Orbitron", fontSize: 28, fontWeight: 700,
                                                color: score > 80 ? "var(--cyan)" : "var(--text)",
                                                textShadow: score > 80 ? "0 0 20px var(--glow-c)" : "none",
                                                transition: "all .3s",
                                        }}>
                                                {score}<span style={{ fontSize: 14, color: "var(--muted)" }}>/100</span>
                                        </div>
                                </div>

                                {/* prompt snippet */}
                                <div style={{
                                        background: "rgba(0,0,0,.4)", borderRadius: 10, padding: "12px 14px",
                                        marginBottom: 20, borderLeft: "3px solid var(--cyan)",
                                        fontSize: 13, color: "#94a3b8", lineHeight: 1.6,
                                        fontFamily: "monospace",
                                }}>
                                        <span style={{ color: "var(--cyan)" }}>→</span> Act as a senior data scientist. Analyze the dataset and provide actionable insights with statistical confidence intervals...
                                </div>

                                {/* dimensions */}
                                <div style={{ display: "grid", gap: 10 }}>
                                        {dims.map((d, i) => (
                                                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{ width: 90, fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>{d.label}</div>
                                                        <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                                                                <div style={{
                                                                        height: "100%", width: `${d.pct}%`,
                                                                        background: `linear-gradient(90deg, ${d.color}99, ${d.color})`,
                                                                        borderRadius: 4,
                                                                        animation: `grow-bar .8s ${i * .08}s ease forwards`,
                                                                        transform: "scaleX(0)", transformOrigin: "left",
                                                                }} />
                                                        </div>
                                                        <div style={{ width: 28, fontSize: 11, color: d.color, textAlign: "right" }}>{d.pct}</div>
                                                </div>
                                        ))}
                                </div>

                                {/* bottom stats */}
                                <div style={{
                                        display: "flex", gap: 8, marginTop: 20,
                                        paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.06)",
                                }}>
                                        {[["🔥 7", "Day Streak"], ["⚡ 240", "XP Earned"], ["🏆 Lv.4", "Rank"]].map(([val, label]) => (
                                                <div key={label} style={{
                                                        flex: 1, textAlign: "center",
                                                        background: "rgba(0,229,255,.04)", borderRadius: 10, padding: "10px 6px",
                                                        border: "1px solid rgba(0,229,255,.08)",
                                                }}>
                                                        <div style={{ fontFamily: "Orbitron", fontSize: 13, fontWeight: 700, color: "var(--cyan)" }}>{val}</div>
                                                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{label}</div>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        );
}

/* ─────────────────────────────────────────────
   RADAR CHART SVG
───────────────────────────────────────────── */
function RadarViz() {
        const size = 200;
        const cx = size / 2, cy = size / 2, r = 80;
        const dims = 8;
        const scores = [88, 76, 94, 82, 70, 85, 78, 91];
        const labels = ["Clarity", "Specific", "Context", "Creative", "Complete", "Efficient", "Adapt", "Impact"];

        const pts = scores.map((s, i) => {
                const angle = (i / dims) * 2 * Math.PI - Math.PI / 2;
                const rv = (s / 100) * r;
                return { x: cx + rv * Math.cos(angle), y: cy + rv * Math.sin(angle) };
        });
        const polygon = pts.map(p => `${p.x},${p.y}`).join(" ");

        const rings = [.25, .5, .75, 1];

        return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        {/* rings */}
                        {rings.map(rv => (
                                <polygon
                                        key={rv}
                                        points={Array.from({ length: dims }, (_, i) => {
                                                const a = (i / dims) * 2 * Math.PI - Math.PI / 2;
                                                const rr = rv * r;
                                                return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
                                        }).join(" ")}
                                        fill="none"
                                        stroke="rgba(0,229,255,.1)"
                                        strokeWidth="1"
                                />
                        ))}
                        {/* spokes */}
                        {Array.from({ length: dims }, (_, i) => {
                                const a = (i / dims) * 2 * Math.PI - Math.PI / 2;
                                return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(0,229,255,.1)" strokeWidth="1" />;
                        })}
                        {/* data polygon */}
                        <polygon points={polygon} fill="url(#radarFill)" stroke="var(--cyan)" strokeWidth="1.5" />
                        {/* labels */}
                        {pts.map((p, i) => {
                                const a = (i / dims) * 2 * Math.PI - Math.PI / 2;
                                const lx = cx + (r + 16) * Math.cos(a);
                                const ly = cy + (r + 16) * Math.sin(a);
                                return (
                                        <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                                                fill="rgba(100,116,139,.8)" fontSize="8" fontFamily="DM Sans">
                                                {labels[i]}
                                        </text>
                                );
                        })}
                        {/* dots */}
                        {pts.map((p, i) => (
                                <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--cyan)" />
                        ))}
                        <defs>
                                <radialGradient id="radarFill" cx="50%" cy="50%">
                                        <stop offset="0%" stopColor="var(--purple)" stopOpacity=".3" />
                                        <stop offset="100%" stopColor="var(--cyan)" stopOpacity=".05" />
                                </radialGradient>
                        </defs>
                </svg>
        );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar({ onGetStarted }) {
        const [scrolled, setScrolled] = useState(false);
        const [menuOpen, setMenuOpen] = useState(false);

        useEffect(() => {
                const h = () => setScrolled(window.scrollY > 20);
                window.addEventListener("scroll", h);
                return () => window.removeEventListener("scroll", h);
        }, []);

        const links = ["Features", "How It Works", "Skills", "Testimonials"];

        return (
                <nav style={{
                        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                        padding: "0 40px",
                        background: scrolled ? "rgba(4,6,16,.92)" : "transparent",
                        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
                        backdropFilter: scrolled ? "blur(16px)" : "none",
                        transition: "all .4s",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        height: 72,
                }}>
                        {/* logo */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        background: "linear-gradient(135deg, var(--cyan), var(--purple))",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 18, boxShadow: "0 0 20px var(--glow-c)",
                                }}>⚡</div>
                                <span style={{
                                        fontFamily: "Orbitron", fontWeight: 700, fontSize: 18,
                                        color: "#fff", letterSpacing: 1,
                                }}>
                                        Prompt<span style={{ color: "var(--cyan)" }}>Forge</span>
                                </span>
                        </div>

                        {/* links */}
                        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
                                {links.map(l => (
                                        <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{
                                                color: "var(--muted)", fontSize: 14, textDecoration: "none",
                                                transition: "color .2s",
                                                fontWeight: 500,
                                        }}
                                                onMouseEnter={e => e.target.style.color = "var(--cyan)"}
                                                onMouseLeave={e => e.target.style.color = "var(--muted)"}
                                        >{l}</a>
                                ))}
                        </div>

                        {/* cta */}
                        <button className="btn-primary" onClick={onGetStarted} style={{ padding: "10px 24px", fontSize: 14 }}>
                                Get Started Free
                        </button>
                </nav>
        );
}

/* ─────────────────────────────────────────────
   SECTION WRAPPER with reveal animation
───────────────────────────────────────────── */
function Section({ id, children, style = {} }) {
        const ref = useRef(null);
        useEffect(() => {
                const observer = new IntersectionObserver(
                        ([entry]) => { if (entry.isIntersecting) entry.target.classList.add("visible"); },
                        { threshold: 0.1 }
                );
                if (ref.current) observer.observe(ref.current);
                return () => observer.disconnect();
        }, []);
        return (
                <section id={id} ref={ref} className="reveal" style={{
                        padding: "100px 40px", maxWidth: 1200, margin: "0 auto", ...style
                }}>
                        {children}
                </section>
        );
}

/* ─────────────────────────────────────────────
   STAT COUNTER
───────────────────────────────────────────── */
function StatCounter({ end, suffix = "", label }) {
        const [count, setCount] = useState(0);
        const ref = useRef(null);
        const started = useRef(false);

        useEffect(() => {
                const observer = new IntersectionObserver(([entry]) => {
                        if (entry.isIntersecting && !started.current) {
                                started.current = true;
                                let start = 0;
                                const step = end / 60;
                                const t = setInterval(() => {
                                        start = Math.min(start + step, end);
                                        setCount(Math.floor(start));
                                        if (start >= end) clearInterval(t);
                                }, 20);
                        }
                }, { threshold: .5 });
                if (ref.current) observer.observe(ref.current);
                return () => observer.disconnect();
        }, [end]);

        return (
                <div ref={ref} style={{ textAlign: "center" }}>
                        <div style={{
                                fontFamily: "Orbitron", fontSize: 52, fontWeight: 900,
                                background: "linear-gradient(135deg, var(--cyan), var(--purple2))",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                lineHeight: 1,
                        }}>
                                {count.toLocaleString()}{suffix}
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 8, fontWeight: 500 }}>{label}</div>
                </div>
        );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
        // Inject global styles
        useEffect(() => {
                if (!document.getElementById("pf-global-styles")) {
                        const style = document.createElement("style");
                        style.id = "pf-global-styles";
                        style.textContent = GLOBAL_CSS;
                        document.head.appendChild(style);
                }
                return () => { };
        }, []);

        const handleGetStarted = () => { window.location.href = "/signup"; };
        const handleLogin = () => { window.location.href = "/login"; };

        /* ── FEATURES ── */
        const features = [
                {
                        icon: "🎯",
                        title: "Real Challenges",
                        desc: "Tackle curated prompt engineering challenges across 10+ domains — from creative writing to technical analysis and beyond.",
                        color: "var(--cyan)",
                },
                {
                        icon: "🧬",
                        title: "8-Dimension Eval",
                        desc: "Every prompt is graded by GPT-3.5 Turbo across 8 key dimensions — Clarity, Specificity, Context, Creativity, Completeness, Efficiency, Adaptability, and Impact.",
                        color: "var(--purple2)",
                },
                {
                        icon: "📡",
                        title: "Skill Radar Chart",
                        desc: "Visualize exactly where your prompt skills are strong and where to grow, with a live radar chart that updates after every attempt.",
                        color: "var(--cyan)",
                },
                {
                        icon: "🔥",
                        title: "XP & Streaks",
                        desc: "Earn experience points, maintain daily streaks, and level up as you master the art of prompt engineering through gamified progression.",
                        color: "var(--gold)",
                },
                {
                        icon: "⚙️",
                        title: "Idea → Prompt",
                        desc: "Got an idea? Drop it in and our AI generates a structured, optimized prompt you can refine and learn from.",
                        color: "var(--purple2)",
                },
                {
                        icon: "📊",
                        title: "Progress Reports",
                        desc: "Download detailed PDF reports of your improvement journey, shareable with employers or kept for your own records.",
                        color: "var(--cyan)",
                },
        ];

        /* ── HOW IT WORKS ── */
        const steps = [
                { num: "01", icon: "🎲", title: "Pick a Challenge", desc: "Browse problems by difficulty and domain. From beginner to advanced." },
                { num: "02", icon: "✍️", title: "Write Your Prompt", desc: "Craft your best prompt in the live editor with syntax highlighting." },
                { num: "03", icon: "🔬", title: "Get Evaluated", desc: "AI scores your prompt on 8 dimensions in real-time with detailed feedback." },
                { num: "04", icon: "📈", title: "Level Up", desc: "Earn XP, unlock achievements, and watch your radar chart evolve." },
        ];

        /* ── DIMENSIONS ── */
        const dimensions = [
                { label: "Clarity", desc: "How clear and unambiguous is your prompt?" },
                { label: "Specificity", desc: "Are your requirements precise and well-defined?" },
                { label: "Context", desc: "Have you provided sufficient background information?" },
                { label: "Creativity", desc: "Does your prompt encourage novel, interesting outputs?" },
                { label: "Completeness", desc: "Are all necessary details included?" },
                { label: "Efficiency", desc: "Is the prompt concise without sacrificing quality?" },
                { label: "Adaptability", desc: "Can the prompt handle variations in input?" },
                { label: "Impact", desc: "How powerful and effective are the expected outputs?" },
        ];

        /* ── TESTIMONIALS ── */
        const testimonials = [
                { name: "Priya S.", role: "ML Engineer @ Startup", avatar: "PS", stars: 5, text: "PromptForge completely changed how I write system prompts. My evaluation scores jumped from 62 to 89 in just 2 weeks." },
                { name: "Marcus T.", role: "Product Manager", avatar: "MT", stars: 5, text: "The 8-dimension breakdown is genius. I finally understand WHY my prompts weren't working. Now I write them like a pro." },
                { name: "Aisha K.", role: "AI Content Creator", avatar: "AK", stars: 5, text: "The streak system keeps me consistent. I've done 30 days straight and my prompts have never been better. Absolutely addictive." },
        ];

        return (
                <div className="noise" style={{ minHeight: "100vh", background: "var(--bg)" }}>

                        {/* ── NAVBAR ── */}
                        <Navbar onGetStarted={handleGetStarted} />

                        {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
                        <div className="grid-bg" style={{
                                minHeight: "100vh", position: "relative",
                                display: "flex", alignItems: "center",
                                paddingTop: 72,
                                overflow: "hidden",
                        }}>
                                {/* background glow blobs */}
                                <div style={{
                                        position: "absolute", top: "20%", left: "10%",
                                        width: 500, height: 500, borderRadius: "50%",
                                        background: "radial-gradient(circle, rgba(0,229,255,.06) 0%, transparent 70%)",
                                        pointerEvents: "none",
                                }} />
                                <div style={{
                                        position: "absolute", bottom: "10%", right: "10%",
                                        width: 400, height: 400, borderRadius: "50%",
                                        background: "radial-gradient(circle, rgba(124,58,237,.08) 0%, transparent 70%)",
                                        pointerEvents: "none",
                                }} />
                                <Particles />

                                <div style={{
                                        maxWidth: 1200, margin: "0 auto", padding: "80px 40px",
                                        display: "grid", gridTemplateColumns: "1fr 1fr",
                                        gap: 80, alignItems: "center", width: "100%",
                                }}>
                                        {/* left */}
                                        <div style={{ animation: "slide-up .8s ease both" }}>
                                                <div className="badge-pill" style={{ marginBottom: 28 }}>
                                                        <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--cyan)", animation: "pulse-ring 1.5s ease-out infinite" }} />
                                                        AI-Powered Prompt Engineering Platform
                                                </div>

                                                <h1 style={{
                                                        fontFamily: "Orbitron", fontSize: "clamp(36px, 5vw, 62px)",
                                                        fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: "#fff",
                                                        letterSpacing: -1,
                                                }}>
                                                        Master the Art of<br />
                                                        <TypingText words={["Prompt Writing", "AI Engineering", "Prompt Crafting", "LLM Mastery"]} />
                                                </h1>

                                                <p style={{
                                                        fontSize: 18, color: "var(--muted)", lineHeight: 1.7,
                                                        marginBottom: 40, maxWidth: 480,
                                                }}>
                                                        Real challenges. Real-time AI evaluation across <strong style={{ color: "var(--text)" }}>8 dimensions</strong>. Level up your prompt engineering skills with XP, streaks, and visual skill maps.
                                                </p>

                                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                                        <button className="btn-primary" onClick={handleGetStarted}>
                                                                Start Training Free →
                                                        </button>
                                                        <button className="btn-ghost" onClick={handleLogin}>
                                                                Sign In
                                                        </button>
                                                </div>

                                                {/* social proof */}
                                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40 }}>
                                                        <div style={{ display: "flex" }}>
                                                                {["A", "B", "C", "D"].map((l, i) => (
                                                                        <div key={l} style={{
                                                                                width: 32, height: 32, borderRadius: "50%",
                                                                                background: `hsl(${i * 60 + 180}, 70%, 50%)`,
                                                                                border: "2px solid var(--bg)",
                                                                                marginLeft: i > 0 ? -8 : 0,
                                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                                fontSize: 11, fontWeight: 700, color: "#fff",
                                                                        }}>{l}</div>
                                                                ))}
                                                        </div>
                                                        <div style={{ fontSize: 13, color: "var(--muted)" }}>
                                                                <span style={{ color: "var(--cyan)", fontWeight: 700 }}>2,400+</span> engineers sharpening their prompts
                                                        </div>
                                                </div>
                                        </div>

                                        {/* right */}
                                        <div style={{ display: "flex", justifyContent: "center", animation: "slide-up .8s .2s ease both" }}>
                                                <HeroVisual />
                                        </div>
                                </div>
                        </div>

                        {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
                        <div style={{
                                background: "linear-gradient(90deg, rgba(0,229,255,.04), rgba(124,58,237,.04))",
                                borderTop: "1px solid var(--border)",
                                borderBottom: "1px solid var(--border)",
                        }}>
                                <div style={{
                                        maxWidth: 1200, margin: "0 auto", padding: "60px 40px",
                                        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40,
                                }}>
                                        <StatCounter end={2400} suffix="+" label="Active Learners" />
                                        <StatCounter end={50000} suffix="+" label="Prompts Evaluated" />
                                        <StatCounter end={8} label="Evaluation Dimensions" />
                                        <StatCounter end={98} suffix="%" label="Accuracy Rate" />
                                </div>
                        </div>

                        {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
                        <Section id="features">
                                <div style={{ textAlign: "center", marginBottom: 64 }}>
                                        <div className="badge-pill" style={{ marginBottom: 20 }}>Core Features</div>
                                        <h2 style={{
                                                fontFamily: "Orbitron", fontSize: "clamp(28px, 4vw, 48px)",
                                                fontWeight: 700, color: "#fff", marginBottom: 16,
                                        }}>
                                                Everything You Need to<br /><span className="grad-text">Level Up Fast</span>
                                        </h2>
                                        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
                                                A complete prompt engineering training platform with AI-powered evaluation and gamified progression.
                                        </p>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                                        {features.map((f, i) => (
                                                <div key={f.title} className="glass feat-card" style={{
                                                        borderRadius: 16, padding: "28px 24px",
                                                        animation: `slide-up .6s ${i * .1}s ease both`,
                                                }}>
                                                        <div style={{
                                                                width: 52, height: 52, borderRadius: 14,
                                                                background: `${f.color}18`,
                                                                border: `1px solid ${f.color}30`,
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                fontSize: 24, marginBottom: 18,
                                                        }}>{f.icon}</div>
                                                        <h3 style={{ fontFamily: "Orbitron", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                                                                {f.title}
                                                        </h3>
                                                        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{f.desc}</p>
                                                </div>
                                        ))}
                                </div>
                        </Section>

                        {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
                        <Section id="how-it-works" style={{
                                background: "linear-gradient(180deg, transparent, rgba(0,229,255,.02) 50%, transparent)",
                        }}>
                                <div style={{ textAlign: "center", marginBottom: 64 }}>
                                        <div className="badge-pill" style={{ marginBottom: 20 }}>Process</div>
                                        <h2 style={{
                                                fontFamily: "Orbitron", fontSize: "clamp(28px, 4vw, 48px)",
                                                fontWeight: 700, color: "#fff", marginBottom: 16,
                                        }}>
                                                How <span className="grad-text">PromptForge</span> Works
                                        </h2>
                                        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
                                                Go from prompt novice to expert in a structured, AI-guided journey.
                                        </p>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative" }}>
                                        {/* connector */}
                                        <div className="step-line" />
                                        {steps.map((s, i) => (
                                                <div key={s.num} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                                                        {/* icon circle */}
                                                        <div style={{
                                                                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                                                                background: "linear-gradient(135deg, rgba(0,229,255,.15), rgba(124,58,237,.15))",
                                                                border: "1px solid var(--border)",
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                fontSize: 28, position: "relative",
                                                        }}>
                                                                {s.icon}
                                                                {/* pulse */}
                                                                <div style={{
                                                                        position: "absolute", inset: -4,
                                                                        borderRadius: "50%",
                                                                        border: "1px solid var(--cyan)",
                                                                        animation: `pulse-ring 2s ${i * .4}s ease-out infinite`,
                                                                        opacity: .4,
                                                                }} />
                                                        </div>

                                                        <div style={{
                                                                fontFamily: "Orbitron", fontSize: 11, color: "var(--cyan)",
                                                                letterSpacing: 2, marginBottom: 8,
                                                        }}>STEP {s.num}</div>
                                                        <h3 style={{ fontFamily: "Orbitron", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                                                                {s.title}
                                                        </h3>
                                                        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{s.desc}</p>
                                                </div>
                                        ))}
                                </div>
                        </Section>

                        {/* ══════════════════════════════════════
          8 DIMENSIONS / SKILLS
      ══════════════════════════════════════ */}
                        <Section id="skills">
                                <div style={{
                                        display: "grid", gridTemplateColumns: "1fr 1fr",
                                        gap: 80, alignItems: "center",
                                }}>
                                        {/* left: radar */}
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                                                <div className="glass" style={{
                                                        borderRadius: 20, padding: 40,
                                                        position: "relative",
                                                }}>
                                                        <div style={{
                                                                position: "absolute", inset: 0, borderRadius: 20,
                                                                background: "radial-gradient(circle at center, rgba(0,229,255,.04), transparent 70%)",
                                                                pointerEvents: "none",
                                                        }} />
                                                        <RadarViz />
                                                </div>
                                                <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
                                                        Your live skill radar — updated after every challenge
                                                </p>
                                        </div>

                                        {/* right */}
                                        <div>
                                                <div className="badge-pill" style={{ marginBottom: 20 }}>8-Dimension Framework</div>
                                                <h2 style={{
                                                        fontFamily: "Orbitron", fontSize: "clamp(24px, 3vw, 40px)",
                                                        fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2,
                                                }}>
                                                        Evaluated on<br /><span className="grad-text">8 Precise Dimensions</span>
                                                </h2>
                                                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                                                        Unlike generic feedback, PromptForge breaks down every submission into 8 measurable dimensions so you know exactly what to improve.
                                                </p>

                                                <div style={{ display: "grid", gap: 12 }}>
                                                        {dimensions.map((d, i) => (
                                                                <div key={d.label} className="glass feat-card" style={{
                                                                        borderRadius: 12, padding: "14px 16px",
                                                                        display: "flex", alignItems: "center", gap: 14,
                                                                }}>
                                                                        <div style={{
                                                                                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                                                                background: i % 2 === 0 ? "rgba(0,229,255,.12)" : "rgba(168,85,247,.12)",
                                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                                fontFamily: "Orbitron", fontSize: 10, fontWeight: 700,
                                                                                color: i % 2 === 0 ? "var(--cyan)" : "var(--purple2)",
                                                                        }}>{String(i + 1).padStart(2, "0")}</div>
                                                                        <div>
                                                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{d.label}</div>
                                                                                <div style={{ fontSize: 12, color: "var(--muted)" }}>{d.desc}</div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </Section>

                        {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
                        <Section id="testimonials">
                                <div style={{ textAlign: "center", marginBottom: 64 }}>
                                        <div className="badge-pill" style={{ marginBottom: 20 }}>Testimonials</div>
                                        <h2 style={{
                                                fontFamily: "Orbitron", fontSize: "clamp(28px, 4vw, 48px)",
                                                fontWeight: 700, color: "#fff",
                                        }}>
                                                Trusted by <span className="grad-text">Engineers</span>
                                        </h2>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                                        {testimonials.map((t, i) => (
                                                <div key={t.name} className="glass testi-card" style={{
                                                        borderRadius: 16, padding: "28px 24px",
                                                        animation: `slide-up .6s ${i * .15}s ease both`,
                                                }}>
                                                        {/* stars */}
                                                        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                                                                {Array(t.stars).fill(0).map((_, j) => (
                                                                        <span key={j} style={{ color: "var(--gold)", fontSize: 14 }}>★</span>
                                                                ))}
                                                        </div>
                                                        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>
                                                                "{t.text}"
                                                        </p>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                                <div style={{
                                                                        width: 40, height: 40, borderRadius: "50%",
                                                                        background: "linear-gradient(135deg, var(--cyan), var(--purple))",
                                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                                        fontWeight: 700, fontSize: 13, color: "#000",
                                                                }}>{t.avatar}</div>
                                                                <div>
                                                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{t.name}</div>
                                                                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.role}</div>
                                                                </div>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </Section>

                        {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
                        <Section>
                                <div className="glass" style={{
                                        borderRadius: 28, padding: "80px 60px", textAlign: "center",
                                        position: "relative", overflow: "hidden",
                                        background: "linear-gradient(135deg, rgba(0,229,255,.05), rgba(124,58,237,.08))",
                                }}>
                                        {/* glow blobs */}
                                        <div style={{
                                                position: "absolute", top: -100, left: "20%",
                                                width: 300, height: 300, borderRadius: "50%",
                                                background: "radial-gradient(circle, rgba(0,229,255,.12), transparent 70%)",
                                                pointerEvents: "none",
                                        }} />
                                        <div style={{
                                                position: "absolute", bottom: -100, right: "20%",
                                                width: 300, height: 300, borderRadius: "50%",
                                                background: "radial-gradient(circle, rgba(124,58,237,.12), transparent 70%)",
                                                pointerEvents: "none",
                                        }} />

                                        <div className="badge-pill" style={{ marginBottom: 24 }}>
                                                🚀 Join the Community
                                        </div>
                                        <h2 style={{
                                                fontFamily: "Orbitron", fontSize: "clamp(28px, 4vw, 52px)",
                                                fontWeight: 900, color: "#fff", marginBottom: 20, lineHeight: 1.2,
                                        }}>
                                                Ready to Forge Your<br /><span className="grad-text">Prompt Engineering Skills?</span>
                                        </h2>
                                        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
                                                Start for free. No credit card required. Join 2,400+ engineers mastering the future of AI interaction.
                                        </p>
                                        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                                                <button className="btn-primary" onClick={handleGetStarted} style={{ padding: "16px 40px", fontSize: 16 }}>
                                                        Start Training — It's Free →
                                                </button>
                                                <button className="btn-ghost" onClick={handleLogin} style={{ padding: "16px 40px", fontSize: 16 }}>
                                                        Sign In
                                                </button>
                                        </div>
                                </div>
                        </Section>

                        {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
                        <footer style={{
                                borderTop: "1px solid var(--border)",
                                padding: "48px 40px",
                                maxWidth: 1200, margin: "0 auto",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                                width: 30, height: 30, borderRadius: 8,
                                                background: "linear-gradient(135deg, var(--cyan), var(--purple))",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 15,
                                        }}>⚡</div>
                                        <span style={{ fontFamily: "Orbitron", fontWeight: 700, fontSize: 15, color: "#fff" }}>
                                                Prompt<span style={{ color: "var(--cyan)" }}>Forge</span>
                                        </span>
                                </div>
                                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                                        © 2025 PromptForge AI. All rights reserved.
                                </div>
                                <div style={{ display: "flex", gap: 24 }}>
                                        {["Privacy", "Terms", "Contact"].map(l => (
                                                <a key={l} href="#" style={{
                                                        fontSize: 13, color: "var(--muted)", textDecoration: "none",
                                                        transition: "color .2s"
                                                }}
                                                        onMouseEnter={e => e.target.style.color = "var(--cyan)"}
                                                        onMouseLeave={e => e.target.style.color = "var(--muted)"}
                                                >{l}</a>
                                        ))}
                                </div>
                        </footer>
                </div>
        );
}