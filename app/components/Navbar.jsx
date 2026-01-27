"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, X, Coins } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-white" />
            <span className="text-white text-xl font-bold hidden sm:block">
              Staking DApp
            </span>
            <span className="text-white text-xl font-bold sm:hidden">
              Stake
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#stake"
              className="text-white hover:text-gray-200 transition"
            >
              Stake
            </a>
            <a
              href="#rewards"
              className="text-white hover:text-gray-200 transition"
            >
              Rewards
            </a>
            <a
              href="#stats"
              className="text-white hover:text-gray-200 transition"
            >
              Stats
            </a>
            <ConnectButton />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div className="scale-75">
              <ConnectButton showBalance={false} />
            </div>
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-200 transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a
              href="#stake"
              className="block text-white hover:bg-white/10 px-4 py-2 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Stake
            </a>
            <a
              href="#rewards"
              className="block text-white hover:bg-white/10 px-4 py-2 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Rewards
            </a>
            <a
              href="#stats"
              className="block text-white hover:bg-white/10 px-4 py-2 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Stats
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
