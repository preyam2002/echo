// Sui client - will be initialized when wallet integration is added
// Using @mysten/sui v2 which requires specific client setup

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK ?? "testnet") as
  | "mainnet"
  | "testnet"
  | "devnet"
  | "localnet";

const RPC_URLS: Record<string, string> = {
  mainnet: "https://fullnode.mainnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
  localnet: "http://127.0.0.1:9000",
};

export const SUI_RPC_URL = RPC_URLS[network];
export const SUI_NETWORK = network;
