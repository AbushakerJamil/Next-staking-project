"use client";

import { useStaking } from "../hooks/useStaking";
import { Award, Loader2, Gift } from "lucide-react";

export default function RewardsCard() {
  const {
    pendingRewards,
    claimRewards,
    isLoading,
    txStatus,
    txMessage,
    clearTxStatus,
  } = useStaking();

  const handleClaim = async () => {
    if (parseFloat(pendingRewards) <= 0) {
      alert("No rewards to claim");
      return;
    }
    await claimRewards();
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 sm:p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-medium opacity-90">
              Your Rewards
            </h3>
            <p className="text-2xl sm:text-4xl font-bold mt-1">
              {parseFloat(pendingRewards).toFixed(4)}
            </p>
            <p className="text-xs sm:text-sm opacity-80">STK Tokens</p>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {txStatus && (
        <div className="mb-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm flex items-center gap-2">
              {txStatus === "pending" && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {txMessage}
            </p>
            <button
              onClick={clearTxStatus}
              className="text-white/60 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Claim Button */}
      <button
        onClick={handleClaim}
        disabled={isLoading || parseFloat(pendingRewards) <= 0}
        className="w-full bg-white text-purple-600 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 disabled:bg-white/20 disabled:text-white/50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm sm:text-base">Claiming...</span>
          </>
        ) : (
          <>
            <Award size={20} />
            <span className="text-sm sm:text-base">Claim Rewards</span>
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <p className="text-xs sm:text-sm opacity-90">
          💡 Rewards are calculated based on your staked amount and the current
          APY. Claim your rewards anytime!
        </p>
      </div>
    </div>
  );
}
