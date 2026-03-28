# Echo — EVE Frontier AI Navigator

An AI-powered navigator for [EVE Frontier](https://www.evefrontier.com/), a decentralized space sandbox on the Sui blockchain. Echo combines a 3D star map visualization with a Claude-powered chat assistant that can query live game data.

## Features

- **3D Star Map** — interactive visualization with React Three Fiber, bloom post-processing, security-level color coding, and orbit controls
- **AI Navigator** — Claude-powered assistant with tool use to query the EVE Frontier World API in real-time
- **Live Data** — fetches solar systems and smart assemblies from the World API, renders them on the star map
- **Immersive UI** — dark space theme with cyan accents, animated messages, and contextual suggestions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript |
| 3D | Three.js, React Three Fiber, Drei, Postprocessing |
| AI | Anthropic Claude (Sonnet 4) with tool use |
| Blockchain | Sui SDK v2 |
| Styling | Tailwind CSS v4, Framer Motion |
| Data | EVE Frontier World API v2 |

## Quick Start

```bash
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY
npm install
npm run dev
```

## Architecture

```
src/
├── app/
│   ├── api/chat/route.ts     # Claude chat with tool use → World API
│   └── api/world/route.ts    # World API proxy
├── components/
│   ├── Layout.tsx             # Split view container
│   ├── StarMap.tsx            # 3D visualization (R3F)
│   └── ChatPanel.tsx          # Chat UI with suggestions
├── lib/
│   ├── ai.ts                 # Claude integration + 4 tools
│   ├── sui-client.ts         # Sui network config
│   └── world-api.ts          # World API client with caching
└── types/index.ts             # SolarSystem, SmartAssembly, etc.
```

**AI Tool Use Flow:** User asks about game → Claude calls World API tools → data returned to chat AND rendered on star map simultaneously.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `NEXT_PUBLIC_SUI_NETWORK` | No | Sui network (default: testnet) |
| `NEXT_PUBLIC_WORLD_API_URL` | No | World API endpoint |

## License

MIT

Built by [Preyam](https://github.com/preyam2002) for the Sui x EVE Frontier Hackathon 2026.
