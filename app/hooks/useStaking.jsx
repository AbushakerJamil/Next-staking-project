"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
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
  const { address: account, isConnected } = useAccount();
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
  const [lastUpdated, setLastUpdated] = useState(Date.now());

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
      setLastUpdated(Date.now());
    }
  }, [balanceData]);

  useEffect(() => {
    if (stakeInfoData) {
      const stakedAmt = stakeInfoData.stakedAmount || stakeInfoData[0] || 0n;
      const rewards = stakeInfoData.pendingRewards || stakeInfoData[1] || 0n;
      setStakedAmount(formatEther(stakedAmt));
      setPendingRewards(formatEther(rewards));
      setLastUpdated(Date.now());
    }
  }, [stakeInfoData]);

  useEffect(() => {
    if (totalStakedData) {
      setTotalStaked(formatEther(totalStakedData));
      setLastUpdated(Date.now());
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

  // Auto-refresh every 3 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      refetchStakeInfo();
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected, refetchStakeInfo]);

  const isUserRejection = (error) => {
    const errorMessage = error.message || error.shortMessage || "";
    return (
      errorMessage.includes("User rejected") ||
      errorMessage.includes("User denied") ||
      errorMessage.includes("user rejected") ||
      errorMessage.includes("denied transaction") ||
      error.code === 4001 ||
      error.code === "ACTION_REJECTED"
    );
  };

  const getErrorMessage = (error, defaultMessage) => {
    const errorMsg = error.message || error.shortMessage || "";

    // User rejected
    if (isUserRejection(error)) {
      return "Transaction cancelled by user";
    }

    // Insufficient balance
    if (
      errorMsg.includes("insufficient funds") ||
      errorMsg.includes("insufficient balance")
    ) {
      return "Insufficient balance for this transaction";
    }

    // Insufficient gas
    if (
      errorMsg.includes("insufficient funds for gas") ||
      errorMsg.includes("gas required exceeds")
    ) {
      return "Insufficient ETH for gas fees";
    }

    // Invalid amount
    if (
      errorMsg.includes("invalid amount") ||
      errorMsg.includes("amount must be greater")
    ) {
      return "Invalid amount entered";
    }

    // Not enough tokens to stake
    if (errorMsg.includes("ERC20: transfer amount exceeds balance")) {
      return "Insufficient token balance";
    }

    // Not enough staked to withdraw
    if (
      errorMsg.includes("Insufficient staked amount") ||
      errorMsg.includes("withdraw amount exceeds")
    ) {
      return "Insufficient staked amount to withdraw";
    }

    // Approval required
    if (errorMsg.includes("ERC20: insufficient allowance")) {
      return "Please approve tokens first";
    }

    // Contract error
    if (errorMsg.includes("execution reverted")) {
      return "Transaction failed: Contract error";
    }

    // Network error
    if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      return "Network error. Please check your connection";
    }

    // Gas estimation failed
    if (errorMsg.includes("gas estimation failed")) {
      return "Transaction would fail. Please check your balance";
    }

    // Nonce too low
    if (errorMsg.includes("nonce too low")) {
      return "Transaction nonce error. Please try again";
    }

    // Replacement transaction underpriced
    if (errorMsg.includes("replacement transaction underpriced")) {
      return "Previous transaction pending. Please wait";
    }

    // Default message with short error if available
    if (error.shortMessage && error.shortMessage !== errorMsg) {
      return error.shortMessage;
    }

    return defaultMessage;
  };

  // Approve tokens for staking
  const approveTokens = async (amount) => {
    if (!account || !isConnected) {
      notify.fail(null, "Please connect your wallet first");
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      notify.fail(null, "Please enter a valid amount");
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
      if (!isUserRejection(error)) {
        console.error("Approve error:", error);
      }

      const errorMessage = getErrorMessage(error, "Failed to approve tokens");
      notify.fail(toastId, errorMessage);

      setIsLoading(false);
      return false;
    }
  };

  // Stake tokens
  const stakeTokens = async (amount) => {
    if (!account || !isConnected) {
      notify.fail(null, "Please connect your wallet first");
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      notify.fail(null, "Please enter a valid amount");
      return false;
    }

    if (parseFloat(amount) > parseFloat(tokenBalance)) {
      notify.fail(
        null,
        `Insufficient balance. You have ${parseFloat(tokenBalance).toFixed(2)} STK`,
      );
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
      if (!isUserRejection(error)) {
        console.error("Stake error:", error);
      }

      const errorMessage = getErrorMessage(error, "Failed to stake tokens");
      notify.fail(toastId, errorMessage);

      setIsLoading(false);
      return false;
    }
  };

  // Withdraw staked tokens
  const withdrawTokens = async (amount) => {
    if (!account || !isConnected) {
      notify.fail(null, "Please connect your wallet first");
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      notify.fail(null, "Please enter a valid amount");
      return false;
    }

    if (parseFloat(amount) > parseFloat(stakedAmount)) {
      notify.fail(
        null,
        `Insufficient staked amount. You have ${parseFloat(stakedAmount).toFixed(2)} STK staked`,
      );
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
      if (!isUserRejection(error)) {
        console.error("Withdraw error:", error);
      }

      const errorMessage = getErrorMessage(error, "Failed to withdraw tokens");
      notify.fail(toastId, errorMessage);

      setIsLoading(false);
      return false;
    }
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!account || !isConnected) {
      notify.fail(null, "Please connect your wallet first");
      return false;
    }

    if (parseFloat(pendingRewards) <= 0) {
      notify.fail(null, "No rewards to claim");
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
      notify.complete(
        toastId,
        `Successfully claimed ${parseFloat(pendingRewards).toFixed(4)} STK rewards`,
      );
      return true;
    } catch (error) {
      if (!isUserRejection(error)) {
        console.error("Claim error:", error);
      }

      const errorMessage = getErrorMessage(error, "Failed to claim rewards");
      notify.fail(toastId, errorMessage);

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
    lastUpdated,

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
