"use client";

import { http, createConfig } from "wagmi";
import {
  injectedWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  zksync,
  sepolia,
} from "wagmi/chains";

function createConnectors() {
  if (typeof window === "undefined") return [];

  return connectorsForWallets(
    [
      {
        groupName: "Popular",
        wallets: [injectedWallet, walletConnectWallet],
      },
    ],
    {
      appName: "TSender",
      projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID,
    }
  );
}

const config = createConfig({
  chains: [mainnet, optimism, arbitrum, base, zksync, sepolia],
  connectors: createConnectors(),
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [zksync.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: false,
});

export default config;
