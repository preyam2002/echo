import type { SolarSystem, SmartAssembly, WorldApiResponse } from "@/types";

const WORLD_API_URL =
  process.env.NEXT_PUBLIC_WORLD_API_URL ??
  "https://world-api-stillness.live.tech.evefrontier.com/v2";

export const worldApi = {
  async getSolarSystems(): Promise<WorldApiResponse<SolarSystem[]>> {
    const res = await fetch(`${WORLD_API_URL}/systems`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`World API error: ${res.status}`);
    return res.json();
  },

  async getSolarSystem(id: string): Promise<SolarSystem> {
    const res = await fetch(`${WORLD_API_URL}/systems/${id}`);
    if (!res.ok) throw new Error(`World API error: ${res.status}`);
    return res.json();
  },

  async getSmartAssemblies(): Promise<WorldApiResponse<SmartAssembly[]>> {
    const res = await fetch(`${WORLD_API_URL}/smartassemblies`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`World API error: ${res.status}`);
    return res.json();
  },

  async getSmartAssembly(id: string): Promise<SmartAssembly> {
    const res = await fetch(`${WORLD_API_URL}/smartassemblies/${id}`);
    if (!res.ok) throw new Error(`World API error: ${res.status}`);
    return res.json();
  },
};
