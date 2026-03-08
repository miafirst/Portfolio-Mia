import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#FDF6F0",
  nude: "#FFD7B9",
  blue: "#3D5499",
  cork: "#9B3F20",
  text: "#1A1A1A",
  muted: "#7A6A5A",
  white: "#FFFFFF",
};

const T = {
  xs: 12, // labels, tags, overlines
  sm: 14, // supporting/meta only
  md: 16, // main body text
  display: "clamp(32px, 6vw, 80px)",
};

const A11Y = {
  nudeOnBlueBody: "#FFD7B9E6", // strong enough for body copy on blue
  nudeOnBlueStrong: "#FFD7B9", // for small labels/headings when needed
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(28px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, kicker, inverse = false, id }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <h2
          id={id}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: T.display,
            fontWeight: 900,
            color: inverse ? C.white : C.blue,
            lineHeight: 1,
            letterSpacing: -2,
            margin: 0,
          }}
        >
          {title}
        </h2>

        {kicker && (
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: T.xs,
              color: inverse ? A11Y.nudeOnBlueStrong : C.cork,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {kicker}
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: 2,
          background: `linear-gradient(to right, ${
            inverse ? C.nude : C.cork
          }, transparent)`,
          marginTop: 16,
        }}
      />
    </>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ["Work", "Thinking", "Building", "Contact"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Primary"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 32px",
          height: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? `${C.bg}F2` : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.nude}80` : "none",
          transition: "all 0.4s ease",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: T.md,
            fontWeight: 700,
            color: C.blue,
          }}
        >
          ML
        </span>

        <div className="desktop-nav" style={{ display: "flex", gap: 40 }}>
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="interactive-link"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.md,
                color: C.muted,
                textDecoration: "none",
                letterSpacing: 0.5,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.cork;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.muted;
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="hamburger interactive-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                width: 22,
                height: 2,
                background: C.blue,
                marginBottom: i < 2 ? 5 : 0,
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0
                    ? "rotate(45deg) translate(5px, 5px)"
                    : i === 2
                    ? "rotate(-45deg) translate(5px, -5px)"
                    : "none"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            zIndex: 99,
            background: C.bg,
            borderBottom: `1px solid ${C.nude}`,
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="interactive-link"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.md,
                color: C.text,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      style={{
        padding: "100px 32px 56px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="deco-m"
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "2%",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(180px, 28vw, 340px)",
          fontWeight: 900,
          fontStyle: "italic",
          color: C.nude,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          opacity: 0.5,
          zIndex: 0,
        }}
      >
        M
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(28px, 4vw, 56px)",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: T.xs,
              letterSpacing: 4,
              color: C.cork,
              textTransform: "uppercase",
              marginBottom: 16,
              animation: "fadeUp 0.7s ease 0.1s both",
            }}
          >
            Product Manager · Tallinn
          </div>

          <h1
            id="hero-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 900,
              lineHeight: 0.92,
              color: C.blue,
              margin: "0 0 20px",
              letterSpacing: -2,
              animation: "fadeUp 0.7s ease 0.2s both",
            }}
          >
            Mia
            <br />
            Lahtvee
          </h1>

          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: T.md,
              fontWeight: 400,
              fontStyle: "italic",
              color: C.muted,
              margin: "0 0 20px",
              lineHeight: 1.5,
              animation: "fadeUp 0.7s ease 0.3s both",
            }}
          >
            "The bridge between what my team
            <br />
            needs and what developers build."
          </p>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: T.md,
              lineHeight: 1.8,
              color: C.muted,
              maxWidth: 400,
              margin: "0 0 32px",
              fontWeight: 300,
              animation: "fadeUp 0.7s ease 0.4s both",
            }}
          >
            Ten years inside one organisation - from customer service to owning a portfolio of digital products serving millions of visitors.
My work sits between people and systems: translating organisational needs into clear requirements, and technical reality back into language teams can act on.
I care about usability, accessibility, and building products that actually survive real-world use.

          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              animation: "fadeUp 0.7s ease 0.5s both",
            }}
          >
            <a
              href="#work"
              className="interactive-link"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.md,
                fontWeight: 600,
                padding: "13px 28px",
                background: C.blue,
                color: C.white,
                textDecoration: "none",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                transition: "all 0.25s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.cork;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.blue;
                e.currentTarget.style.transform = "none";
              }}
            >
              See my work
            </a>

            <a
              href="mailto:mialhtv@gmail.com"
              className="interactive-link"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.md,
                fontWeight: 500,
                padding: "13px 28px",
                border: `1.5px solid ${C.blue}`,
                color: C.blue,
                textDecoration: "none",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                transition: "all 0.25s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.cork;
                e.currentTarget.style.color = C.cork;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.blue;
                e.currentTarget.style.color = C.blue;
              }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        html {
          scroll-behavior: smooth;
        }

        .desktop-nav { display: flex !important; }
        .hamburger { display: none !important; }

        .interactive-link:focus-visible,
        .interactive-button:focus-visible,
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid ${C.cork};
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }
        }

        @media (max-width: 680px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          .hero-photo { display: none !important; }
          .deco-m { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── WORK ──────────────────────────────────────────────────────────
function Case({ num, tag, title, problem, what, learned, accent = false }) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView();
  const panelId = `case-panel-${num}`;
  const buttonId = `case-button-${num}`;

  return (
    <div
      ref={ref}
      style={{
        borderBottom: `1px solid ${C.nude}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        background: accent ? C.blue : C.white,
      }}
    >
      <button
        id={buttonId}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="interactive-button"
        style={{
          width: "100%",
          padding: "clamp(24px, 4vw, 40px) 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "clamp(12px, 3vw, 28px)",
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 6vw, 64px)",
              fontWeight: 900,
              fontStyle: "italic",
              color: accent ? `${C.nude}30` : `${C.blue}18`,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {num}
          </span>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.xs,
                letterSpacing: 3,
                color: accent ? A11Y.nudeOnBlueStrong : C.cork,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {tag}
            </div>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 700,
                color: accent ? C.white : C.blue,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            border: `1.5px solid ${accent ? C.nude : C.blue}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: T.md,
              color: accent ? C.nude : C.blue,
              lineHeight: 1,
              marginTop: -2,
            }}
          >
            +
          </span>
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          maxHeight: open ? 1000 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        <div style={{ padding: "0 32px clamp(32px, 5vw, 52px)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "clamp(24px, 4vw, 40px)",
            }}
          >
            {[
              { label: "The problem", text: problem },
              { label: "What I did", text: what },
              { label: "What I learned", text: learned, italic: true },
            ].map(({ label, text, italic }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: T.xs,
                    letterSpacing: 3,
                    color: accent ? A11Y.nudeOnBlueStrong : C.cork,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  {label}
                </div>

                <p
                  style={{
                    fontFamily: italic
                      ? "'Playfair Display', serif"
                      : "'DM Sans', sans-serif",
                    fontSize: T.md,
                    lineHeight: 1.8,
                    fontStyle: italic ? "italic" : "normal",
                    color: accent ? A11Y.nudeOnBlueBody : C.muted,
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Work() {
  return (
    <section id="work" aria-labelledby="work-title" style={{ background: C.white }}>
      <div style={{ padding: "80px 32px 48px" }}>
        <Reveal>
          <SectionTitle id="work-title" title="Work" kicker="Three stories" />
        </Reveal>
      </div>

      <Case
        num="01"
        tag="Tallinn Card · App"
        title="Tallinn Card mobile app"
        problem="The Tallinn Card mobile app is used by visitors to access museums, transport, and attractions across the city. The system depended on a third-party synchronisation service that announced shutting down. Visitors were also experiencing issues such as cards disappearing from devices and purchase failures."
        what="I stepped into the situation as the product owner responsible for the service and coordinated the recovery across internal teams and external partners. Working with developers, we delivered a new data exchange layer and a new administrative environment that replaced the failed synchronisation service. Alongside the infrastructure work, I coordinated fixes for recurring reliability issues, implemented analytics tracking to give the product a measurable baseline, and coordinated several UX improvements to make the purchase and usage flow clearer for visitors."
        learned="Technical failures rarely happen in isolation - they expose weaknesses in ownership, documentation, and system architecture. Recovering the product meant not just fixing the immediate problem but building a structure that could withstand future change."
      />
      <Case
        num="02"
        tag="Change Management · CRM"
        title="CRM implementation"
        problem="Our organisation relied heavily on partnerships with tourism businesses, but information about those relationships lived in scattered spreadsheets, inboxes, and personal notes. Teams agreed that a shared system would help, yet early attempts at introducing one had failed. Every new tool felt like additional overhead, and the idea of a CRM had already developed some quiet resistance."
        what="I led the implementation of Odoo CRM across the organisation, starting with workshops to map how teams actually worked rather than how the system expected them to work. Based on those workflows I further structured the database, imported and organised more than 1,800 records of contacts and organisations, built dashboards and documentation, and supported colleagues through day-to-day adoption. The system gradually became the central place for tracking cooperation and partner relationships."
        learned="Adoption problems are rarely technical. People resist systems when they feel like extra work, not when the software is imperfect. The most effective way to introduce a tool is to make it clearly easier than the habits it replaces."
        accent={true}
      />
      <Case
        num="03"
        tag="AI automation · Chatbot"
        title="Vana Toomas chatbot"
        problem="Visitors regularly contact the Visit Tallinn support team with questions about attractions  and city services. Many of these questions arrive outside office hours, when tourists are already exploring the city and need answers immediately. At the same time, the customer service team was spending a large portion of their working hours answering the same repetitive questions."
        what="I designed and launched the Vana Toomas chatbot as a first layer of support for visitors using the website and the mobile app. I defined the conversation structure, created response templates, and built the content architecture around the most common visitor questions. After launching the initial version in English, I developed an Estonian-language version and began reviewing real conversations to refine the system over time. I also presented the chatbot and its approach to stakeholders across the city government as an example of practical AI implementation."
        learned="AI tools are only useful when they solve a real operational problem. The chatbot needed to work for two audiences at once - visitors looking for quick answers and the support team responsible for maintaining the system behind it."
      />
    </section>
  );
}

// ─── THINKING ──────────────────────────────────────────────────────
function Thinking() {
  return (
    <section
      id="thinking"
      aria-labelledby="thinking-title"
      style={{ background: C.blue, padding: "80px 32px" }}
    >
      <Reveal>
        <SectionTitle id="thinking-title" title="How I think" inverse />
        <div style={{ marginBottom: 56 }} />
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 48,
        }}
      >
        {[
          {
            n: "01",
            title: "Both users matter",
            body: "Every product has at least two users — the person using it and the person who needs it to work. The Tallinn Card chatbot needed to help visitors and give customer service a maintainable knowledge structure. I always ask: who are we building for, and what does winning look like for each of them?",
          },
          {
            n: "02",
            title: "Data informs, instinct decides",
            body: "Analytics tells you what people do. Research tells you why. Neither alone is enough. Visit Tallinn event's page is one of the top visited pages on the site, user surveys told us they need the information, but usability has problems. I triangulate — then make a call and own it.",
          },
          {
            n: "03",
            title: "Uncomfortable early, comfortable later",
            body: "The best decisions are often unpopular before they're proven. I'd rather have the hard conversation upfront than explain a bad outcome at the end.",
          },
        ].map(({ n, title, body }, i) => (
          <Reveal key={n} delay={i * 0.15}>
            <div>
              <div
                aria-hidden="true"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(40px, 5vw, 52px)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: `${C.nude}20`,
                  lineHeight: 1,
                  marginBottom: -4,
                }}
              >
                {n}
              </div>

              <div
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 2,
                  background: C.nude,
                  margin: "12px 0 18px",
                }}
              />

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 700,
                  color: C.white,
                  margin: "0 0 14px",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: T.md,
                  lineHeight: 1.8,
                  color: A11Y.nudeOnBlueBody,
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                {body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── BUILDING ──────────────────────────────────────────────────────
function Building() {
  return (
    <section id="building" aria-labelledby="building-title" style={{ padding: "80px 32px" }}>
      <Reveal>
        <SectionTitle id="building-title" title="Building" kicker="On my own time" />

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: T.md,
            color: C.muted,
            marginBottom: 48,
            maxWidth: 460,
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          The clearest signal of how someone thinks is what they make when
          nobody asks them to.
        </p>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {[
          {
            title: "me, first.",
            sub: "Personal Finance App",
            desc: "A mobile-first finance app for women who find traditional money tools cold and overwhelming. Budgeting reframed as self-care — pay-period anchoring, impulse-buy friction, savings goals that feel human. Built because I needed it. Built because traditional finance apps rarely reflect how people actually get paid or spend money.",
            tags: ["React", "UX Design", "Design System", "Product Strategy"],
            bg: C.nude,
          },
          {
            title: "AI Work Planner",
            sub: "Claude API Integration",
            desc: "A weekly planner that takes tasks and calendar data and generates a structured schedule — respecting work hours, protected breaks, and priority logic. Practical AI development: API calls, structured outputs, error handling, iterated UX. Not just prompting.",
            tags: ["React", "Claude API", "AI Product", "Workflow"],
            bg: C.bg,
          },
        ].map((p, i) => (
          <Reveal key={p.title} delay={i * 0.15}>
            <div
              style={{
                background: p.bg,
                border: `1px solid ${C.nude}`,
                padding: "clamp(32px, 5vw, 52px) clamp(24px, 4vw, 40px)",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: T.xs,
                  letterSpacing: 3,
                  color: C.cork,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {p.sub}
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: C.blue,
                  margin: "0 0 18px",
                  lineHeight: 1.1,
                }}
              >
                {p.title}
              </h3>

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: T.md,
                  lineHeight: 1.8,
                  color: C.muted,
                  margin: "0 0 24px",
                  fontWeight: 300,
                }}
              >
                {p.desc}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: T.xs,
                      padding: "4px 12px",
                      border: `1px solid ${C.cork}50`,
                      color: C.cork,
                      borderRadius: 20,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────
function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      style={{ padding: "100px 32px 80px", borderTop: `1px solid ${C.nude}` }}
    >
      <Reveal>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(40px, 6vw, 80px)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.xs,
                letterSpacing: 4,
                color: C.cork,
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Let's talk
            </div>

            <h2
              id="contact-title"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: T.display,
                fontWeight: 900,
                lineHeight: 1.05,
                color: C.blue,
                margin: "0 0 24px",
                letterSpacing: -1.5,
              }}
            >
              If you're building something
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>
                that needs a bridge —
              </span>
            </h2>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.md,
                color: C.muted,
                maxWidth: 400,
                lineHeight: 1.8,
                margin: "0 0 40px",
                fontWeight: 300,
              }}
            >
              Open to product manager and product owner roles in Tallinn. I
              like meaningful work, clear problems, and teams where everyone
              knows their lane.
            </p>

            <a
              href="mailto:mialhtv@gmail.com"
              className="interactive-link"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: T.md,
                fontWeight: 600,
                padding: "13px 28px",
                background: C.blue,
                color: C.white,
                textDecoration: "none",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                display: "inline-block",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.cork;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.blue;
                e.currentTarget.style.transform = "none";
              }}
            >
              Get in touch
            </a>
          </div>

          <div
            style={{
              flexShrink: 0,
              width: "clamp(200px, 24vw, 320px)",
              position: "relative",
              alignSelf: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "3/4",
                overflow: "hidden",
              }}
            >
              {/*
                TO ADD YOUR PHOTO — replace the div below with:
                <img
                  src="./mia.jpg"
                  alt="Portrait of Mia Lahtvee"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
              */}
              <div
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(145deg, ${C.nude} 0%, ${C.cork}40 100%)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: `2px solid ${C.cork}50`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: 22, color: C.cork, opacity: 0.5 }}>
                    ↑
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: T.xs,
                    letterSpacing: 2,
                    color: C.cork,
                    textTransform: "uppercase",
                    textAlign: "center",
                    lineHeight: 1.8,
                    opacity: 0.65,
                  }}
                >
                  Your photo
                  <br />
                  <span style={{ fontSize: T.xs, opacity: 0.8 }}>mia.jpg</span>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: -12,
                left: -12,
                width: "55%",
                height: 3,
                background: C.cork,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 40,
                height: 40,
                background: C.nude,
                zIndex: -1,
              }}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{fonts}</style>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Thinking />
        <Building />
        <Contact />
      </main>

      <footer
        style={{
          borderTop: `1px solid ${C.nude}`,
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: T.xs,
          color: C.muted,
        }}
      >
        <span>Mia Lahtvee · 2026</span>
        <span>Tallinn, Estonia</span>
      </footer>
    </div>
  );
}
