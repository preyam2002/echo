import Anthropic from "@anthropic-ai/sdk";
import type { SolarSystem, SmartAssembly } from "@/types";

const client = new Anthropic();

const WORLD_API_URL =
  process.env.NEXT_PUBLIC_WORLD_API_URL ??
  "https://world-api-stillness.live.tech.evefrontier.com/v2";

const SYSTEM_PROMPT = `You are Echo, an AI navigator for EVE Frontier — a decentralized space sandbox built on blockchain technology. You help players understand the universe, analyze smart assemblies, navigate solar systems, and make strategic decisions.

You have tools to query the EVE Frontier World API for live data. Use them proactively when players ask about systems, assemblies, or the game world.

Be concise, tactical, and helpful. Speak like a seasoned space navigator. Use short paragraphs and bullet points for clarity. Reference specific coordinates and data when available.`;

const tools: Anthropic.Tool[] = [
  {
    name: "get_solar_systems",
    description:
      "Fetch all solar systems in the EVE Frontier universe. Returns system IDs, names, positions, security levels, and regions.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_solar_system",
    description:
      "Fetch details about a specific solar system by its ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "The solar system ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "get_smart_assemblies",
    description:
      "Fetch all smart assemblies (player-built structures) in the game world. Returns assembly IDs, names, owners, types, and states.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_smart_assembly",
    description:
      "Fetch details about a specific smart assembly by its ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "The smart assembly ID" },
      },
      required: ["id"],
    },
  },
];

async function executeTool(
  name: string,
  input: Record<string, string>
): Promise<string> {
  try {
    let url: string;
    switch (name) {
      case "get_solar_systems":
        url = `${WORLD_API_URL}/systems`;
        break;
      case "get_solar_system":
        url = `${WORLD_API_URL}/systems/${input.id}`;
        break;
      case "get_smart_assemblies":
        url = `${WORLD_API_URL}/smartassemblies`;
        break;
      case "get_smart_assembly":
        url = `${WORLD_API_URL}/smartassemblies/${input.id}`;
        break;
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return JSON.stringify({ error: `API error: ${res.status}` });
    const data = await res.json();
    return JSON.stringify(data);
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

export interface WorldData {
  systems?: SolarSystem[];
  assemblies?: SmartAssembly[];
}

export const chat = async (
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<{ text: string; worldData?: WorldData }> => {
  let worldData: WorldData = {};

  let response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools,
    messages,
  });

  // Handle tool use loop
  const allMessages: Anthropic.MessageParam[] = [...messages];
  while (response.stop_reason === "tool_use") {
    const toolBlocks = response.content.filter(
      (b) => b.type === "tool_use"
    ) as Anthropic.ToolUseBlock[];

    allMessages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tool of toolBlocks) {
      const result = await executeTool(
        tool.name,
        tool.input as Record<string, string>
      );

      // Capture world data for UI
      try {
        const parsed = JSON.parse(result);
        if (tool.name === "get_solar_systems" && Array.isArray(parsed)) {
          worldData.systems = parsed;
        } else if (tool.name === "get_smart_assemblies" && Array.isArray(parsed)) {
          worldData.assemblies = parsed;
        }
      } catch {
        // ignore parse errors
      }

      toolResults.push({
        type: "tool_result",
        tool_use_id: tool.id,
        content: result,
      });
    }

    allMessages.push({ role: "user", content: toolResults });

    response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages: allMessages,
    });
  }

  const textBlock = response.content.find((block) => block.type === "text");
  return {
    text: textBlock?.text ?? "",
    worldData: Object.keys(worldData).length > 0 ? worldData : undefined,
  };
};
