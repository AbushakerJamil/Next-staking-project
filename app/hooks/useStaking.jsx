"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useConnection,
  usePublicClient,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { STAKING_ABI, STAKING_TOKEN_ABI } from "../utils/contracts";
import contractAddresses from "../utils/contractAddresses.json";
import { useToast } from "../context/ToastContext";

export const useStaking = () => {
  const { address: account, isConnected } = useConnection();
  const publicClient = usePublicClient();
  const { notify } = useToast();

  const { writeContractAsync } = useWriteContract();

  const [tokenBalance, setTokenBalance] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [pendingRewards, setPendingRewards] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [apy, setApy] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState(null);

  // Read token balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: contractAddresses.stakeToken,
    abi: STAKING_TOKEN_ABI,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: {
      enabled: !!account && isConnected,
    },
  });

  // Read stake info
  const { data: stakeInfoData, refetch: refetchStakeInfo } = useReadContract({
    address: contractAddresses.staking,
    abi: STAKING_ABI,
    functionName: "getStakeInfo",
    args: account ? [account] : undefined,
    query: {
      enabled: !!account && isConnected,
    },
  });

  // Read total staked
  const { data: totalStakedData, refetch: refetchTotalStaked } =
    useReadContract({
      address: contractAddresses.staking,
      abi: STAKING_ABI,
      functionName: "totalStaked",
      query: {
        enabled: isConnected,
      },
    });

  // Read APY
  const { data: apyData, refetch: refetchApy } = useReadContract({
    address: contractAddresses.staking,
    abi: STAKING_ABI,
    functionName: "getAPY",
    query: {
      enabled: isConnected,
    },
  });

  // Read allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: contractAddresses.stakeToken,
    abi: STAKING_TOKEN_ABI,
    functionName: "allowance",
    args: account ? [account, contractAddresses.staking] : undefined,
    query: {
      enabled: !!account && isConnected,
    },
  });

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: currentTxHash,
    });

  // Update state when data changes
  useEffect(() => {
    if (balanceData) {
      setTokenBalance(formatEther(balanceData));
    }
  }, [balanceData]);

  useEffect(() => {
    if (stakeInfoData) {
      const stakedAmt = stakeInfoData.stakedAmount || stakeInfoData[0] || 0n;
      const rewards = stakeInfoData.pendingRewards || stakeInfoData[1] || 0n;
      setStakedAmount(formatEther(stakedAmt));
      setPendingRewards(formatEther(rewards));
    }
  }, [stakeInfoData]);

  useEffect(() => {
    if (totalStakedData) {
      setTotalStaked(formatEther(totalStakedData));
    }
  }, [totalStakedData]);

  useEffect(() => {
    if (apyData) {
      setApy((Number(apyData) / 100).toFixed(2));
    }
  }, [apyData]);

  useEffect(() => {
    if (allowanceData) {
      setAllowance(formatEther(allowanceData));
    }
  }, [allowanceData]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      fetchStakingData();
    }
  }, [isConfirmed]);

  // Fetch all staking data
  const fetchStakingData = useCallback(async () => {
    if (!isConnected || !account) return;

    try {
      await Promise.all([
        refetchBalance(),
        refetchStakeInfo(),
        refetchTotalStaked(),
        refetchApy(),
        refetchAllowance(),
      ]);
    } catch (error) {
      console.error("Error fetching staking data:", error);
    }
  }, [
    account,
    isConnected,
    refetchBalance,
    refetchStakeInfo,
    refetchTotalStaked,
    refetchApy,
    refetchAllowance,
  ]);

  // Auto-refresh every 10 seconds for rewards update
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      refetchStakeInfo();
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected, refetchStakeInfo]);

  // Approve tokens for staking
  const approveTokens = async (amount) => {
    if (!account || !isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    const toastId = notify.start("Approving tokens...");
    setIsLoading(true);

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await writeContractAsync({
        address: contractAddresses.stakeToken,
        abi: STAKING_TOKEN_ABI,
        functionName: "approve",
        args: [contractAddresses.staking, amountWei],
      });

      setCurrentTxHash(hash);
      notify.approve(toastId, "Tokens approved successfully!");
      return true;
    } catch (error) {
      console.error("Approve error:", error);
      notify.fail(
        toastId,
        error.shortMessage || error.message || "Failed to approve tokens"
      );
      setIsLoading(false);
      return false;
    }
  };

  // Stake tokens
  const stakeTokens = async (amount) => {
    if (!account || !isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    const toastId = notify.start("Staking tokens...");
    setIsLoading(true);

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await writeContractAsync({
        address: contractAddresses.staking,
        abi: STAKING_ABI,
        functionName: "stake",
        args: [amountWei],
      });

      setCurrentTxHash(hash);
      notify.complete(toastId, `Successfully staked ${amount} STK`);
      return true;
    } catch (error) {
      console.error("Stake error:", error);
      notify.fail(
        toastId,
        error.shortMessage || error.message || "Failed to stake tokens"
      );
      setIsLoading(false);
      return false;
    }
  };

  // Withdraw staked tokens
  const withdrawTokens = async (amount) => {
    if (!account || !isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    const toastId = notify.start("Withdrawing tokens...");
    setIsLoading(true);

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await writeContractAsync({
        address: contractAddresses.staking,
        abi: STAKING_ABI,
        functionName: "withdraw",
        args: [amountWei],
      });

      setCurrentTxHash(hash);
      notify.complete(toastId, `Successfully withdrawn ${amount} STK`);
      return true;
    } catch (error) {
      console.error("Withdraw error:", error);
      notify.fail(
        toastId,
        error.shortMessage || error.message || "Failed to withdraw tokens"
      );
      setIsLoading(false);
      return false;
    }
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!account || !isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    const toastId = notify.start("Claiming rewards...");
    setIsLoading(true);

    try {
      const hash = await writeContractAsync({
        address: contractAddresses.staking,
        abi: STAKING_ABI,
        functionName: "claimRewards",
      });

      setCurrentTxHash(hash);
      notify.complete(toastId, "Successfully claimed rewards");
      return true;
    } catch (error) {
      console.error("Claim error:", error);
      notify.fail(
        toastId,
        error.shortMessage || error.message || "Failed to claim rewards"
      );
      setIsLoading(false);
      return false;
    }
  };

  const needsApproval = (amount) => {
    if (!amount || isNaN(amount)) return false;
    return parseFloat(allowance) < parseFloat(amount);
  };

  return {
    // Data
    tokenBalance,
    stakedAmount,
    pendingRewards,
    totalStaked,
    apy,
    allowance,

    // Status
    isLoading: isLoading || isConfirming,

    // Actions
    approveTokens,
    stakeTokens,
    withdrawTokens,
    claimRewards,
    fetchStakingData,
    needsApproval,
  };
};
