"use client";

import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "../hooks/useStaking";
import { parseEther, formatEther } from "viem";
import { usePublicClient } from "wagmi";

export const useStaking = () => {
  const { account, stakeTokenContract, stakingContract, isConnected } =
    useWeb3();
  const publicClient = usePublicClient();

  const [tokenBalance, setTokenBalance] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [pendingRewards, setPendingRewards] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [apy, setApy] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [txMessage, setTxMessage] = useState("");

  // Fetch all staking data
  const fetchStakingData = useCallback(async () => {
    if (!isConnected || !stakeTokenContract || !stakingContract || !account) {
      return;
    }

    try {
      const stakingAddress = stakingContract.address;

      const [
        balance,
        stakeInfo,
        totalStakedAmount,
        currentApy,
        currentAllowance,
      ] = await Promise.all([
        stakeTokenContract.read.balanceOf([account]),
        stakingContract.read.getStakeInfo([account]),
        stakingContract.read.totalStaked(),
        stakingContract.read.getAPY(),
        stakeTokenContract.read.allowance([account, stakingAddress]),
      ]);

      const stakedAmt = stakeInfo.stakedAmount || stakeInfo[0] || 0n;
      const rewards = stakeInfo.pendingRewards || stakeInfo[1] || 0n;

      setTokenBalance(formatEther(balance));
      setStakedAmount(formatEther(stakedAmt));
      setPendingRewards(formatEther(rewards));
      setTotalStaked(formatEther(totalStakedAmount));
      setApy((Number(currentApy) / 100).toFixed(2));
      setAllowance(formatEther(currentAllowance));
    } catch (error) {
      console.error("Error fetching staking data:", error);
    }
  }, [account, stakeTokenContract, stakingContract, isConnected]);

  useEffect(() => {
    fetchStakingData();

    const interval = setInterval(fetchStakingData, 10000);
    return () => clearInterval(interval);
  }, [fetchStakingData]);

  // Wait for transaction
  const waitForTransaction = async (hash) => {
    if (!publicClient) throw new Error("Public client not available");

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    return receipt;
  };

  // Approve tokens for staking
  const approveTokens = async (amount) => {
    if (!stakeTokenContract || !stakingContract) {
      console.error("Contracts not initialized");
      return false;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxMessage("Approving tokens...");

    try {
      const amountWei = parseEther(amount.toString());
      const stakingAddress = stakingContract.address;

      const hash = await stakeTokenContract.write.approve([
        stakingAddress,
        amountWei,
      ]);

      setTxMessage("Waiting for confirmation...");

      const receipt = await waitForTransaction(hash);

      if (receipt.status === "success") {
        setTxStatus("success");
        setTxMessage("Tokens approved successfully");
        await fetchStakingData();
        return true;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Approve error:", error);
      setTxStatus("error");
      setTxMessage(
        error.shortMessage || error.message || "Failed to approve tokens",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Stake tokens
  const stakeTokens = async (amount) => {
    if (!stakingContract) {
      console.error("Staking contract not initialized");
      return false;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxMessage("Staking tokens...");

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await stakingContract.write.stake([amountWei]);
      setTxMessage("Waiting for confirmation...");

      const receipt = await waitForTransaction(hash);

      if (receipt.status === "success") {
        setTxStatus("success");
        setTxMessage(`Successfully staked ${amount} STK`);
        await fetchStakingData();
        return true;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Stake error:", error);
      setTxStatus("error");
      setTxMessage(
        error.shortMessage || error.message || "Failed to stake tokens",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw staked tokens
  const withdrawTokens = async (amount) => {
    if (!stakingContract) {
      console.error("Staking contract not initialized");
      return false;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxMessage("Withdrawing tokens...");

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await stakingContract.write.withdraw([amountWei]);
      setTxMessage("Waiting for confirmation...");

      const receipt = await waitForTransaction(hash);

      if (receipt.status === "success") {
        setTxStatus("success");
        setTxMessage(`Successfully withdrawn ${amount} STK`);
        await fetchStakingData();
        return true;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      setTxStatus("error");
      setTxMessage(
        error.shortMessage || error.message || "Failed to withdraw tokens",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!stakingContract) {
      console.error("Staking contract not initialized");
      return false;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxMessage("Claiming rewards...");

    try {
      const hash = await stakingContract.write.claimRewards();
      setTxMessage("Waiting for confirmation...");

      const receipt = await waitForTransaction(hash);

      if (receipt.status === "success") {
        setTxStatus("success");
        setTxMessage("Successfully claimed rewards");
        await fetchStakingData();
        return true;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Claim error:", error);
      setTxStatus("error");
      setTxMessage(
        error.shortMessage || error.message || "Failed to claim rewards",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearTxStatus = () => {
    setTxStatus(null);
    setTxMessage("");
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
    isLoading,
    txStatus,
    txMessage,

    // Actions
    approveTokens,
    stakeTokens,
    withdrawTokens,
    claimRewards,
    fetchStakingData,
    clearTxStatus,
    needsApproval,
  };
};
