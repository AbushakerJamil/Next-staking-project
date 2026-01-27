"use client";

import { useState, useEffect } from "react";
import {
  useConnection,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { STAKING_TOKEN_ABI } from "../utils/contracts";
import contractAddresses from "../utils/contractAddresses.json";

export const useAdmin = () => {
  const { address: account, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [txMessage, setTxMessage] = useState("");
  const [currentTxHash, setCurrentTxHash] = useState(null);

  const { data: ownerAddress } = useReadContract({
    address: contractAddresses.stakeToken,
    abi: STAKING_TOKEN_ABI,
    functionName: "owner",
    query: {
      enabled: isConnected,
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: currentTxHash,
    });

  useEffect(() => {
    if (ownerAddress && account) {
      setIsOwner(ownerAddress.toLowerCase() === account.toLowerCase());
    } else {
      setIsOwner(false);
    }
  }, [ownerAddress, account]);

  useEffect(() => {
    if (isConfirming) {
      setTxMessage("Waiting for confirmation...");
    }
    if (isConfirmed) {
      setTxStatus("success");
      setIsLoading(false);
    }
  }, [isConfirming, isConfirmed]);

  // Approve tokens (Owner can approve any address to spend tokens)
  // const approveTokens = async (spenderAddress, amount) => {
  //   if (!account || !isConnected) {
  //     console.error("Wallet not connected");
  //     return false;
  //   }

  //   if (!isOwner) {
  //     setTxStatus("error");
  //     setTxMessage("Only owner can approve tokens");
  //     return false;
  //   }

  //   setIsLoading(true);
  //   setTxStatus("pending");
  //   setTxMessage("Approving tokens...");

  //   try {
  //     const amountWei = parseEther(amount.toString());

  //     const hash = await writeContractAsync({
  //       address: contractAddresses.stakeToken,
  //       abi: STAKING_TOKEN_ABI,
  //       functionName: "approve",
  //       args: [spenderAddress, amountWei],
  //     });

  //     setCurrentTxHash(hash);
  //     setTxMessage(`Approved ${amount} tokens for ${spenderAddress}`);
  //     return true;
  //   } catch (error) {
  //     console.error("Approve error:", error);
  //     setTxStatus("error");
  //     setTxMessage(
  //       error.shortMessage || error.message || "Failed to approve tokens",
  //     );
  //     setIsLoading(false);
  //     return false;
  //   }
  // };

  const transferTokens = async (recipientAddress, amount) => {
    if (!account || !isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    if (!isOwner) {
      setTxStatus("error");
      setTxMessage("Only owner can transfer tokens");
      return false;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxMessage("Transferring tokens...");

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await writeContractAsync({
        address: contractAddresses.stakeToken,
        abi: STAKING_TOKEN_ABI,
        functionName: "transfer",
        args: [recipientAddress, amountWei],
      });

      setCurrentTxHash(hash);
      setTxMessage(`Transferred ${amount} tokens to ${recipientAddress}`);
      return true;
    } catch (error) {
      console.error("Transfer error:", error);
      setTxStatus("error");
      setTxMessage(
        error.shortMessage || error.message || "Failed to transfer tokens",
      );
      setIsLoading(false);
      return false;
    }
  };

  const transferFrom = async (fromAddress, toAddress, amount) => {
    if (!account || !isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    if (!isOwner) {
      setTxStatus("error");
      setTxMessage("Only owner can use transferFrom");
      return false;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxMessage("Transferring tokens...");

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await writeContractAsync({
        address: contractAddresses.stakeToken,
        abi: STAKING_TOKEN_ABI,
        functionName: "transferFrom",
        args: [fromAddress, toAddress, amountWei],
      });

      setCurrentTxHash(hash);
      setTxMessage(
        `Transferred ${amount} tokens from ${fromAddress} to ${toAddress}`,
      );
      return true;
    } catch (error) {
      console.error("TransferFrom error:", error);
      setTxStatus("error");
      setTxMessage(
        error.shortMessage || error.message || "Failed to transfer tokens",
      );
      setIsLoading(false);
      return false;
    }
  };

  const mintTokens = async (recipientAddress, amount) => {
    if (!account || !isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    if (!isOwner) {
      setTxStatus("error");
      setTxMessage("Only owner can mint tokens");
      return false;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxMessage("Minting tokens...");

    try {
      const amountWei = parseEther(amount.toString());

      const hash = await writeContractAsync({
        address: contractAddresses.stakeToken,
        abi: STAKING_TOKEN_ABI,
        functionName: "mint",
        args: [recipientAddress, amountWei],
      });

      setCurrentTxHash(hash);
      setTxMessage(`Minted ${amount} tokens to ${recipientAddress}`);
      return true;
    } catch (error) {
      console.error("Mint error:", error);
      setTxStatus("error");
      setTxMessage(
        error.shortMessage || error.message || "Failed to mint tokens",
      );
      setIsLoading(false);
      return false;
    }
  };

  const clearTxStatus = () => {
    setTxStatus(null);
    setTxMessage("");
    setCurrentTxHash(null);
  };

  return {
    isOwner,
    ownerAddress,

    isLoading: isLoading || isConfirming,
    txStatus,
    txMessage,

    transferTokens,
    transferFrom,
    mintTokens,
    clearTxStatus,
  };
};
