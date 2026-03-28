import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050508] text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <Link
          href="/"
          className="text-xs text-cyan-500/60 hover:text-cyan-400 font-mono tracking-wider uppercase"
        >
          &larr; Back to Navigator
        </Link>

        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Echo
            <span className="text-cyan-400"> — AI Navigator</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            An AI-powered navigator for EVE Frontier that combines a 3D star map
            with Claude&apos;s tool use to query live game data in real time.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider">
            How It Works
          </h2>
          <div className="space-y-3 text-zinc-300 leading-relaxed">
            <p>
              Echo is a split-view application: a 3D star map on the left and an
              AI chat panel on the right. When you ask the AI about the game
              world, it uses Claude&apos;s tool use capability to call the EVE Frontier
              World API in real time.
            </p>
            <p>
              The AI has four tools: fetching all solar systems, getting details
              about a specific system, listing smart assemblies, and querying
              individual assembly details. The data returned from these tools is
              both used to generate the AI&apos;s response AND rendered on the 3D star
              map — creating a seamless bridge between conversation and
              visualization.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider">
            Technical Architecture
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "3D Star Map",
                desc: "React Three Fiber + Drei with bloom post-processing. Nodes color-coded by security level. Interactive orbit controls.",
              },
              {
                title: "AI Tool Use",
                desc: "Claude Sonnet 4 with 4 tools that query the EVE Frontier World API. Handles multi-turn tool use loops.",
              },
              {
                title: "Real-time Data Flow",
                desc: "World data from AI responses flows to the star map component via React state, rendering systems as 3D nodes.",
              },
              {
                title: "Responsive Design",
                desc: "Split view on desktop (75/25), stacked on mobile with a toggle button. Works on all screen sizes.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript",
              "Three.js",
              "React Three Fiber",
              "Claude Sonnet 4",
              "Anthropic SDK",
              "Sui SDK v2",
              "Tailwind CSS v4",
              "Framer Motion",
            ].map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-800/50 bg-zinc-900/30 text-zinc-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider">
            EVE Frontier Integration
          </h2>
          <div className="text-zinc-300 leading-relaxed space-y-3">
            <p>
              Echo connects to the EVE Frontier World API v2 at{" "}
              <code className="text-cyan-400/80 text-xs bg-zinc-900 px-1.5 py-0.5 rounded">
                world-api-stillness.live.tech.evefrontier.com
              </code>{" "}
              to fetch live solar system and smart assembly data. The Sui SDK is
              included for future wallet integration and on-chain interactions.
            </p>
          </div>
        </section>

        <footer className="pt-8 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 font-mono">
            Built by{" "}
            <a
              href="https://github.com/preyam2002"
              className="text-cyan-500/60 hover:text-cyan-400"
            >
              Preyam
            </a>{" "}
            for the Sui x EVE Frontier Hackathon 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
