"use client";

import { useStaking } from "../hooks/useStaking";
import { Wallet, TrendingUp, Gem, DollarSign, Landmark } from "lucide-react";

export default function StatsCard() {
  const { tokenBalance, stakedAmount, pendingRewards, totalStaked, apy } =
    useStaking();

  const stats = [
    {
      title: "Your Balance",
      value: `${parseFloat(tokenBalance).toFixed(2)} STK`,
      icon: <Wallet className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Staked Amount",
      value: `${parseFloat(stakedAmount).toFixed(2)} STK`,
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Rewards",
      value: `${parseFloat(pendingRewards).toFixed(4)} STK`,
      icon: <Gem className="w-6 h-6 text-purple-500" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Amount",
      value: `${parseFloat(totalStaked).toFixed(2)} STK`,
      icon: <Landmark className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "APY",
      value: `${apy}%`,
      icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 px-10 pb-6 p-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>{stat.icon}</div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            {stat.title}
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 break-words">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
