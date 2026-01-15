"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { FaGithub } from "react-icons/fa";
// import Image from "next/image";
import { useConnection } from "wagmi";

export default function Header() {
  const { address, isConnected } = useConnection();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Investor Dashboard</h1>
          <p className="mb-4">Connect your wallet to continue</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <header className="px-8 py-4.5 border-b-[1px] border-zinc-100 flex flex-row justify-between items-center bg-white xl:min-h-[77px]">
      <div className="logo">Staking dApp</div>

      <div className="flex items-center gap-4">
        <ConnectButton />
      </div>
    </header>
  );
}
