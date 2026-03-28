import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK ?? "testnet") as
  | "mainnet"
  | "testnet"
  | "devnet"
  | "localnet";

export const suiClient = new SuiClient({ url: getFullnodeUrl(network) });

export const getSuiBalance = async (address: string) => {
  const balance = await suiClient.getBalance({ owner: address });
  return balance;
};

export const getSuiObjects = async (address: string) => {
  const objects = await suiClient.getOwnedObjects({ owner: address });
  return objects;
};
