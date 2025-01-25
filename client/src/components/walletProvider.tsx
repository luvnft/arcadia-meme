import { useState, useEffect, createContext, useContext } from "react";
import { Network, AptosConfig, TransactionPayload } from "@aptos-labs/ts-sdk";

// Type definitions
interface WalletResponse {
  address: string;
}

declare global {
  interface Window {
    aptos?: any;
    martian?: any;
  }
}

export interface WalletContextType {
  walletAddress: string | null;
  connectWallet: (provider: string) => Promise<void>;
  signAndSubmitTransaction: (transaction: TransactionPayload) => Promise<string>;
  walletProvider: string | null;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

new AptosConfig({ network: Network.TESTNET }); // Initialize network config

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connections on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        // Check Petra connection
        if (window.aptos) {
          try {
            const account = await window.aptos.account();
            if (account) {
              setWalletAddress(account.address);
              setWalletProvider("Petra");
              return;
            }
          } catch (err) {
            console.warn("Petra wallet connection check failed:", err);
          }
        }

        // Check Martian connection
        if (window.martian) {
          try {
            const account = await window.martian.account();
            if (account) {
              setWalletAddress(account.address);
              setWalletProvider("Martian");
              return;
            }
          } catch (err) {
            console.warn("Martian wallet connection check failed:", err);
          }
        }
      } catch (err) {
        setError("Failed to check existing wallet connections");
        console.error("Wallet connection check failed:", err);
      }
    };

    checkExistingConnection();
  }, []);

  const connectWallet = async (provider: string) => {
    if (isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      let response: WalletResponse;

      if (provider === "Petra") {
        if (!window.aptos) {
          throw new Error("Petra wallet not found! Please install it first.");
        }
        try {
          response = await window.aptos.connect();
          setWalletAddress(response.address);
          setWalletProvider("Petra");
        } catch (err) {
          console.error("Error connecting to Petra:", err);
          throw new Error("Failed to connect to Petra wallet");
        }
      } else if (provider === "Martian") {
        if (!window.martian) {
          throw new Error("Martian wallet not found! Please install it first.");
        }
        try {
          response = await window.martian.connect();
          setWalletAddress(response.address);
          setWalletProvider("Martian");
        } catch (err) {
          console.error("Error connecting to Martian:", err);
          throw new Error("Failed to connect to Martian wallet");
        }
      } else {
        throw new Error("Unsupported wallet provider");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wallet connection failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (walletProvider === "Petra" && window.aptos) {
        await window.aptos.disconnect();
      } else if (walletProvider === "Martian" && window.martian) {
        await window.martian.disconnect();
      }
      setWalletAddress(null);
      setWalletProvider(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to disconnect wallet";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signAndSubmitTransaction = async (transaction: TransactionPayload): Promise<string> => {
    if (!walletAddress || !walletProvider) {
      throw new Error("Wallet not connected");
    }

    try {
      let hash: string;

      if (walletProvider === "Petra") {
        try {
          const pendingTransaction = await window.aptos.signAndSubmitTransaction(transaction);
          hash = pendingTransaction.hash;
        } catch (err) {
          console.error("Transaction signing failed on Petra:", err);
          throw new Error("Failed to sign transaction on Petra");
        }
      } else if (walletProvider === "Martian") {
        try {
          const pendingTransaction = await window.martian.signAndSubmitTransaction(transaction);
          hash = pendingTransaction.hash;
        } catch (err) {
          console.error("Transaction signing failed on Martian:", err);
          throw new Error("Failed to sign transaction on Martian");
        }
      } else {
        throw new Error("Unsupported wallet provider");
      }

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Transaction failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connectWallet,
        walletProvider,
        signAndSubmitTransaction,
        disconnect,
        isConnecting,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
