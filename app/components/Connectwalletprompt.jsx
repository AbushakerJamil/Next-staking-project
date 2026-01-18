"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Shield, Zap } from "lucide-react";

export default function ConnectWalletPrompt() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure",
      description: "Your keys, your crypto",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast",
      description: "Instant transactions",
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Easy",
      description: "Connect in seconds",
    },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full">
              <Wallet className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to Staking DApp
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Connect your wallet to start earning rewards by staking your tokens.
            Join thousands of users already earning passive income.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex justify-center mb-2 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Connect Button */}
          <div className="flex justify-center">
            <div className="scale-110">
              <ConnectButton />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              Trusted by 10,000+ users
            </p>
            <div className="flex justify-center items-center gap-4 text-gray-400">
              <span className="text-xs">✓ Audited Smart Contracts</span>
              <span className="text-xs">✓ Non-Custodial</span>
              <span className="text-xs hidden sm:inline">✓ Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
