"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Navbar from "../app/components/Navbar";
import StatsCard from "../app/components/StatsCard";
import StakeForm from "../app/components/Stakeform";
import RewardsCard from "../app/components/Rewardscard";
import PoolStats from "../app/components/Poolstats";
import Footer from "../app/components/Footer";
import ConnectWalletPrompt from "../app/components/Connectwalletprompt";
import AdminPanel from "./components/Adminpanel";

export default function Home() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a skeleton loader
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {!isConnected ? (
        <ConnectWalletPrompt />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <section id="stats" className="mb-8">
            <StatsCard />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Stake Form - Takes 2 columns on large screens */}
            <div className="lg:col-span-2" id="stake">
              <StakeForm />
            </div>

            {/* Rewards Card - Takes 1 column */}
            <div id="rewards">
              <RewardsCard />
            </div>
          </div>
          <section>
            <AdminPanel />
          </section>

          {/* Pool Statistics */}

          <section>
            <PoolStats />
          </section>
          {/* Additional Info Section */}
          <section className="mt-8 bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Connect Wallet
                </h3>
                <p className="text-sm text-gray-600">
                  Connect your Web3 wallet to get started
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Stake Tokens
                </h3>
                <p className="text-sm text-gray-600">
                  Approve and stake your STK tokens
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Earn Rewards
                </h3>
                <p className="text-sm text-gray-600">
                  Sit back and watch your rewards grow
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      <Footer />
    </div>
  );
}
