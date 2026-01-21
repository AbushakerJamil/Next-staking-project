"use client";

import { useState } from "react";
import { useStaking } from "../hooks/useStaking";
import { ArrowDown, ArrowUp, Check, AlertCircle, Loader2 } from "lucide-react";

export default function StakeForm() {
  const {
    tokenBalance,
    stakedAmount,
    approveTokens,
    stakeTokens,
    withdrawTokens,
    isLoading,
    txStatus,
    txMessage,
    clearTxStatus,
    needsApproval,
  } = useStaking();

  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("stake"); // 'stake' or 'unstake'

  const handleMaxBalance = () => {
    if (activeTab === "stake") {
      setAmount(tokenBalance);
    } else {
      setAmount(stakedAmount);
    }
  };

  const handleApprove = async () => {
<<<<<<< HEAD
    // if (tokenBalance == 0) {
    //   alert("Your acount is low");
    //   return;
    // }
=======
>>>>>>> 63cda52d44acd3b3715f1af82226bdc7cc75cf8c
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    await approveTokens(amount);
  };

  const handleStake = async () => {
<<<<<<< HEAD
    // if (tokenBalance == 0) {
    //   alert("Your acount is low");
    //   return;
    // }
=======
>>>>>>> 63cda52d44acd3b3715f1af82226bdc7cc75cf8c
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const success = await stakeTokens(amount);
    if (success) {
      setAmount("");
    }
  };

  const handleUnstake = async () => {
<<<<<<< HEAD
    // if (tokenBalance == 0) {
    //   alert("Your acount is low");
    //   return;
    // }
=======
>>>>>>> 63cda52d44acd3b3715f1af82226bdc7cc75cf8c
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const success = await withdrawTokens(amount);
    if (success) {
      setAmount("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      {/* Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => {
            setActiveTab("stake");
            setAmount("");
            clearTxStatus();
          }}
          className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "stake"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowDown size={18} />
            <span className="hidden sm:inline">Stake</span>
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab("unstake");
            setAmount("");
            clearTxStatus();
          }}
          className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "unstake"
              ? "bg-orange-500 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowUp size={18} />
            <span className="hidden sm:inline">Unstake</span>
          </span>
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
            disabled={isLoading}
          />
          <button
            onClick={handleMaxBalance}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-200 transition"
            disabled={isLoading}
          >
            MAX
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Available:{" "}
          <span className="font-semibold">
            {activeTab === "stake"
              ? parseFloat(tokenBalance).toFixed(2)
              : parseFloat(stakedAmount).toFixed(2)}{" "}
            STK
          </span>
        </div>
      </div>

      {/* Transaction Status */}
      {txStatus && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
            txStatus === "success"
              ? "bg-green-50 border border-green-200"
              : txStatus === "error"
<<<<<<< HEAD
                ? "bg-red-50 border border-red-200"
                : "bg-blue-50 border border-blue-200"
=======
              ? "bg-red-50 border border-red-200"
              : "bg-blue-50 border border-blue-200"
>>>>>>> 63cda52d44acd3b3715f1af82226bdc7cc75cf8c
          }`}
        >
          {txStatus === "success" && (
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          {txStatus === "error" && (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          {txStatus === "pending" && (
            <Loader2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-spin" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                txStatus === "success"
                  ? "text-green-700"
                  : txStatus === "error"
<<<<<<< HEAD
                    ? "text-red-700"
                    : "text-blue-700"
=======
                  ? "text-red-700"
                  : "text-blue-700"
>>>>>>> 63cda52d44acd3b3715f1af82226bdc7cc75cf8c
              }`}
            >
              {txMessage}
            </p>
          </div>
          <button
            onClick={clearTxStatus}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {activeTab === "stake" && needsApproval(amount) && (
          <button
            onClick={handleApprove}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-yellow-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Approving...</span>
              </>
            ) : (
              <>
                <Check size={20} />
                <span>Approve Tokens</span>
              </>
            )}
          </button>
        )}

        {activeTab === "stake" ? (
          <button
            onClick={handleStake}
            disabled={
              isLoading ||
              !amount ||
              parseFloat(amount) <= 0 ||
              needsApproval(amount)
            }
            className="w-full bg-blue-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Staking...</span>
              </>
            ) : (
              <>
                <ArrowDown size={20} />
                <span>Stake Tokens</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleUnstake}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-orange-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Unstaking...</span>
              </>
            ) : (
              <>
                <ArrowUp size={20} />
                <span>Unstake Tokens</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          {activeTab === "stake"
            ? "Stake your tokens to earn rewards. You can unstake anytime."
            : "Unstake your tokens to withdraw them back to your wallet."}
        </p>
      </div>
    </div>
  );
}
