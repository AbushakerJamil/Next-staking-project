"use client";

import { useStaking } from "../hooks/useStaking";
import { Users, TrendingUp, Lock, Activity } from "lucide-react";

export default function PoolStats() {
  const { totalStaked, apy } = useStaking();

  const poolData = [
    {
      label: "Total Value Locked",
      value: `${parseFloat(totalStaked).toFixed(2)} STK`,
      icon: <Lock className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Current APY",
      value: `${apy}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Active Stakers",
      value: "Coming Soon",
      icon: <Users className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Pool Status",
      value: "Active",
      icon: <Activity className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Pool Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {poolData.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.color} p-4 sm:p-6 rounded-xl text-white hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-2 rounded-lg">{item.icon}</div>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                {item.label}
              </span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold break-words">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Pool Information
        </h3>
        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
          <li>• Minimum stake: 0.01 STK</li>
          <li>• No lock-up period</li>
          <li>• Rewards distributed every block</li>
          <li>• Instant unstaking available</li>
        </ul>
      </div> */}
    </div>
  );
}
