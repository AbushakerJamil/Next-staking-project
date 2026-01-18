"use client";
import { useState } from "react";

import Navbar from "./components/Navbar";
import ConnectWalletPrompt from "./components/Connectwalletprompt";
import StatsCard from "./components/StatsCard";
import StakeForm from "./components/Stakeform";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <ConnectWalletPrompt />

      <StatsCard />
      <StakeForm />
    </div>
  );
}
