// Shared TypeScript types for Echo

export interface SolarSystem {
  id: string;
  name: string;
  position: [number, number, number];
  security: number;
  region: string;
}

export interface SmartAssembly {
  id: string;
  name: string;
  solarSystemId: string;
  owner: string;
  type: string;
  state: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
}

export interface WorldApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface SuiWalletState {
  address: string | null;
  connected: boolean;
  network: string;
}
