"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useAdmin } from "./useAdmin";
import {
  Shield,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRightLeft,
  Coins,
} from "lucide-react";

export default function AdminPanel() {
  const { isConnected } = useAccount();
  const {
    isOwner,
    ownerAddress,
    isLoading,
    txStatus,
    txMessage,
    transferTokens,
    transferFrom,
    mintTokens,
    clearTxStatus,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("approve");
  const [spenderAddress, setSpenderAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Handle Approve
  // const handleApprove = async () => {
  //   if (!spenderAddress || !amount) {
  //     alert("Please fill all fields");
  //     return;
  //   }
  // await approveTokens(spenderAddress, amount);
  //   setSpenderAddress("");
  //   setAmount("");
  // };

  const handleTransfer = async () => {
    if (!recipientAddress || !amount) {
      alert("Please fill all fields");
      return;
    }
    await transferTokens(recipientAddress, amount);
    setRecipientAddress("");
    setAmount("");
  };

  const handleTransferFrom = async () => {
    if (!fromAddress || !toAddress || !amount) {
      alert("Please fill all fields");
      return;
    }
    await transferFrom(fromAddress, toAddress, amount);
    setFromAddress("");
    setToAddress("");
    setAmount("");
  };

  const handleMint = async () => {
    if (!recipientAddress || !amount) {
      alert("Please fill all fields");
      return;
    }
    await mintTokens(recipientAddress, amount);
    setRecipientAddress("");
    setAmount("");
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-gray-600">
            Please connect your wallet to access the admin panel
          </p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 mb-4">
            You are not the owner of this contract
          </p>
          {ownerAddress && (
            <p className="text-xs text-gray-500 font-mono">
              Owner: {ownerAddress}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-sm opacity-90">Owner-only control panel</p>
        {ownerAddress && (
          <p className="text-xs opacity-75 font-mono mt-2">
            Owner: {ownerAddress.slice(0, 6)}...{ownerAddress.slice(-4)}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-2">
          {/* <button
            onClick={() => {
              setActiveTab("approve");
              clearTxStatus();
            }}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "approve"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              <span className="hidden sm:inline">Approve</span>
            </span>
          </button> */}

          <button
            onClick={() => {
              setActiveTab("transfer");
              clearTxStatus();
            }}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "transfer"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Send size={18} />
              <span className="hidden sm:inline">Transfer</span>
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("transferFrom");
              clearTxStatus();
            }}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "transferFrom"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowRightLeft size={18} />
              <span className="hidden sm:inline">TransferFrom</span>
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("mint");
              clearTxStatus();
            }}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "mint"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Coins size={18} />
              <span className="hidden sm:inline">Mint</span>
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {txStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              txStatus === "success"
                ? "bg-green-50 border border-green-200"
                : txStatus === "error"
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            {txStatus === "success" && (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
                      ? "text-red-700"
                      : "text-blue-700"
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

        {activeTab === "transfer" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Transfer Tokens
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Send tokens from your wallet to another address
            </p>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Amount (STK)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleTransfer}
              disabled={isLoading || !recipientAddress || !amount}
              className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transferring...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Transfer Tokens</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "transferFrom" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Transfer From
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Transfer tokens from one address to another (requires approval)
            </p>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                From Address
              </label>
              <input
                type="text"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                To Address
              </label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Amount (STK)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleTransferFrom}
              disabled={isLoading || !fromAddress || !toAddress || !amount}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transferring...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft size={20} />
                  <span>Transfer From</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "mint" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Mint Tokens
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Create new tokens and send to an address
            </p>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Amount (STK)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleMint}
              disabled={isLoading || !recipientAddress || !amount}
              className="w-full bg-purple-500 text-white py-4 rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Minting...</span>
                </>
              ) : (
                <>
                  <Coins size={20} />
                  <span>Mint Tokens</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            ⚠️ Important Notes
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Only the contract owner can perform these operations</li>
            <li>• All transactions require gas fees</li>
            <li>• Double-check addresses before confirming</li>
            <li>• Transactions are irreversible once confirmed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
