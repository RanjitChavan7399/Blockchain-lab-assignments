// src/config.js
// ─────────────────────────────────────────────────────────────────
// Single source of truth for all environment variables.
// No other file should reference import.meta.env directly.
// ─────────────────────────────────────────────────────────────────

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
export const CHAIN_ID         = Number(import.meta.env.VITE_CHAIN_ID ?? 11155111);
export const CHAIN_ID_HEX     = "0x" + CHAIN_ID.toString(16);
export const EXPLORER_URL     = import.meta.env.VITE_EXPLORER_URL ?? "https://sepolia.etherscan.io";
export const RPC_URL          = import.meta.env.VITE_RPC_URL ?? "";

if (!CONTRACT_ADDRESS) {
  console.warn("[ChainTrade] VITE_CONTRACT_ADDRESS not set. Run: npm run deploy:sepolia");
}
