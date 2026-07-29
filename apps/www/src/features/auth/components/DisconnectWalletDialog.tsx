"use client";

import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import type UserAPI from "@rhivadotfun/userapi";
import { address, createSolanaRpc } from "@solana/kit";
import { useWallets } from "@privy-io/react-auth/solana";
import { findAssociatedTokenPda } from "@solana-program/token";
import type { Wallet as LinkedWallet } from "@privy-io/react-auth";
import {
  Send,
  Info,
  LogOut,
  Wallet,
  RefreshCw,
  ArrowLeft,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

import { useAuth } from "../auth.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUserApi } from "@/hooks/use-user-api";
import CopyButton from "@/components/ui/button/copy-button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  createDialogHandle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface TokenInfo {
  name: string;
  symbol: string;
  mint: string;
  decimals: number;
}

const TOKENS: TokenInfo[] = [
  {
    name: "Solana",
    symbol: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
  },
];

type DisconnectWalletDialogProps = Dialog.Props & {
  children?: React.ReactElement;
};

export const disconnectWalletDialogHandle = createDialogHandle();

export function DisconnectWalletDialog({
  children,
  ...props
}: DisconnectWalletDialogProps) {
  const { user } = useAuth();
  const { wallets } = useWallets();
  const currentWallet = wallets[0];
  const userApi = useUserApi();

  const [view, setView] = useState<
    "overview" | "deposit" | "transfer" | "withdraw"
  >("overview");

  // Balances State
  const [balances, setBalances] = useState<Record<string, number | null>>({
    SOL: null,
    USDC: null,
  });
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const currentWalletAccount = user?.linkedAccounts?.find(
    (acc) =>
      acc.type === "wallet" &&
      acc.address.toLowerCase() === currentWallet?.address?.toLowerCase(),
  );
  const walletClientType =
    currentWalletAccount && "walletClientType" in currentWalletAccount
      ? (currentWalletAccount as any).walletClientType
      : undefined;

  // Filter linked wallets (excluding the current connected wallet)
  const linkedWallets: LinkedWallet[] = (user?.linkedAccounts?.filter(
    (acc) =>
      acc.type === "wallet" &&
      (acc as any).address?.toLowerCase() !==
        currentWallet?.address?.toLowerCase(),
  ) ?? []) as any[];

  // Fetch Balances
  const fetchBalances = useCallback(async () => {
    if (!currentWallet?.address) return;
    setIsLoadingBalances(true);
    try {
      const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

      // 1. Fetch SOL Balance
      const { value: lamportsVal } = await rpc
        .getBalance(address(currentWallet.address))
        .send();
      const solVal = Number(lamportsVal) / 1_000_000_000;

      // 2. Fetch USDC Balance
      let usdcVal = 0;
      try {
        const [tokenAccountAddress] = await findAssociatedTokenPda({
          mint: address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
          owner: address(currentWallet.address),
          tokenProgram: address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        });
        const { value: tokenBal } = await rpc
          .getTokenAccountBalance(tokenAccountAddress)
          .send();
        usdcVal = Number(tokenBal.uiAmount) || 0;
      } catch (err) {
        console.log("No USDC ATA or balance: ", err);
      }

      setBalances({
        SOL: solVal,
        USDC: usdcVal,
      });
    } catch (e) {
      console.error("Failed to fetch balances", e);
    } finally {
      setIsLoadingBalances(false);
    }
  }, [currentWallet]);

  useEffect(() => {
    if (currentWallet?.address) {
      fetchBalances();
    }
  }, [currentWallet?.address, fetchBalances]);

  return (
    <Dialog
      handle={disconnectWalletDialogHandle}
      onOpenChange={(open) => {
        if (!open) {
          setView("overview");
        }
      }}
      {...props}
    >
      {children && <DialogTrigger render={children} />}

      <DialogContent className="sm:max-w-md">
        {view === "overview" && (
          <OverviewView
            address={currentWallet?.address || ""}
            walletClientType={walletClientType}
            balances={balances}
            isLoadingBalances={isLoadingBalances}
            onFetchBalances={fetchBalances}
            onDisconnect={() => {
              currentWallet?.disconnect();
              toast.success("Wallet disconnected successfully");
              disconnectWalletDialogHandle.close();
            }}
            onNavigate={(target) => setView(target)}
          />
        )}

        {view === "deposit" && (
          <DepositView
            walletAddress={currentWallet?.address || ""}
            onBack={() => setView("overview")}
          />
        )}

        {view === "transfer" && (
          <TransferView
            userApi={userApi}
            onBack={() => setView("overview")}
            onClose={() => {
              disconnectWalletDialogHandle.close();
              fetchBalances();
            }}
          />
        )}

        {view === "withdraw" && (
          <WithdrawView
            userApi={userApi}
            linkedWallets={linkedWallets}
            onBack={() => setView("overview")}
            onClose={() => {
              disconnectWalletDialogHandle.close();
              fetchBalances();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ================================================================== */
/* 1. OVERVIEW VIEW                                                   */
/* ================================================================== */
interface OverviewViewProps {
  address: string;
  walletClientType?: string;
  balances: Record<string, number | null>;
  isLoadingBalances: boolean;
  onFetchBalances: () => void;
  onDisconnect: () => void;
  onNavigate: (view: "deposit" | "transfer" | "withdraw") => void;
}

function OverviewView({
  address,
  walletClientType,
  balances,
  isLoadingBalances,
  onFetchBalances,
  onDisconnect,
  onNavigate,
}: OverviewViewProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Manage Wallet</DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-3">
        {/* Wallet info */}
        <div className="space-y-4 rounded-xl border bg-card p-5 text-card-foreground">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Wallet className="size-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base leading-none">
                {walletClientType === "privy"
                  ? "Embedded Wallet"
                  : walletClientType || "Connected Wallet"}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
                <span className="truncate font-mono">
                  {address
                    ? `${address.slice(0, 8)}...${address.slice(-8)}`
                    : "N/A"}
                </span>
                {address && <CopyButton copy={address} />}
              </div>
            </div>
          </div>

          {/* Token balances */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">
                Balances
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={onFetchBalances}
                disabled={isLoadingBalances}
                className="size-7 rounded-full hover:bg-muted"
              >
                <RefreshCw
                  className={cn(
                    "size-3.5",
                    isLoadingBalances && "animate-spin",
                  )}
                />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-muted-foreground text-xs">SOL</p>
                <p className="mt-1 truncate font-bold text-lg">
                  {balances.SOL !== null ? balances.SOL.toFixed(4) : "0.0000"}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-muted-foreground text-xs">USDC</p>
                <p className="mt-1 truncate font-bold text-lg">
                  {balances.USDC !== null ? balances.USDC.toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary/5 hover:text-primary"
            onClick={() => onNavigate("deposit")}
          >
            <PlusCircle className="size-5" />
            <span className="text-xs">Deposit</span>
          </Button>

          <Button
            variant="outline"
            className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary/5 hover:text-primary"
            onClick={() => onNavigate("transfer")}
          >
            <Send className="size-5" />
            <span className="text-xs">Transfer</span>
          </Button>

          <Button
            variant="outline"
            className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary/5 hover:text-primary"
            onClick={() => onNavigate("withdraw")}
          >
            <ArrowDownLeft className="size-5" />
            <span className="text-xs">Withdraw</span>
          </Button>
        </div>

        {/* Disconnect action */}
        <Button
          variant="destructive"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-6 transition-all duration-200 hover:bg-destructive/90"
          onClick={onDisconnect}
        >
          <LogOut className="size-4" />
          Disconnect Wallet
        </Button>
      </div>
    </>
  );
}

/* ================================================================== */
/* 2. DEPOSIT VIEW (RECEIVE TOKEN MODAL)                             */
/* ================================================================== */
interface DepositViewProps {
  walletAddress: string;
  onBack: () => void;
}

function DepositView({ walletAddress, onBack }: DepositViewProps) {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-8 rounded-full"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <DialogTitle>Deposit Token</DialogTitle>
        </div>
      </DialogHeader>

      <div className="flex flex-col items-center space-y-5 py-3">
        {/* Token selection */}
        <div className="w-full space-y-2">
          <p className="font-medium text-muted-foreground text-xs">
            Select Token to Deposit:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TOKENS.map((token) => (
              <button
                type="button"
                key={token.symbol}
                onClick={() => setSelectedToken(token)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200",
                  selectedToken.symbol === token.symbol
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="font-bold text-sm">{token.symbol}</span>
                <span className="text-[10px] opacity-75">{token.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code */}
        {walletAddress ? (
          <>
            <div className="flex size-52 items-center justify-center rounded-xl border bg-white p-4 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${walletAddress}&color=1c1c1e&bgcolor=ffffff`}
                alt="Wallet QR Code"
                className="size-44"
              />
            </div>

            <div className="w-full space-y-2 text-center">
              <p className="text-muted-foreground text-xs">
                Scan QR code or copy address to deposit {selectedToken.symbol}
              </p>
              <div className="flex max-w-full items-center justify-center gap-2 overflow-hidden rounded-lg border bg-muted/30 p-3">
                <span className="select-all truncate font-mono text-xs">
                  {walletAddress}
                </span>
                <CopyButton copy={walletAddress} />
              </div>
            </div>

            <div className="mt-2 flex w-full items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 p-3 text-primary/80 text-xs">
              <Info className="mt-0.5 size-4 shrink-0" />
              <p>
                Send only {selectedToken.name} ({selectedToken.symbol}) to this
                address. Sending other assets may result in permanent loss.
              </p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">No wallet connected</p>
        )}
      </div>
    </>
  );
}

/* ================================================================== */
/* 3. TRANSFER VIEW (SEND TOKEN MODAL)                               */
/* ================================================================== */
interface TransferViewProps {
  userApi: UserAPI;
  onBack: () => void;
  onClose: () => void;
}

function TransferView({ userApi, onBack, onClose }: TransferViewProps) {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleTransfer = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!userApi) {
      toast.error("User API not initialized. Please try again.");
      return;
    }
    if (!recipient || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSending(true);
    try {
      // Calculate base units based on decimals
      const baseUnits = BigInt(
        Math.floor(amountNum * Math.pow(10, selectedToken.decimals)),
      ).toString();

      const response = await userApi.transaction.action.transfer({
        mint: selectedToken.mint,
        recipient: recipient,
        amount: baseUnits,
        feeConfig: { maxFee: 0.01 },
      });

      toast.success(
        `Transfer initiated successfully! Signature: ${response.signature.slice(0, 8)}...`,
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        `Transfer failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-8 rounded-full"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <DialogTitle>Transfer Tokens</DialogTitle>
        </div>
      </DialogHeader>

      <form
        onSubmit={handleTransfer}
        className="space-y-4 py-3"
      >
        {/* Token selection */}
        <div className="space-y-2">
          <p className="font-medium text-muted-foreground text-xs">
            Select Token:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TOKENS.map((token) => (
              <button
                type="button"
                key={token.symbol}
                onClick={() => setSelectedToken(token)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200",
                  selectedToken.symbol === token.symbol
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="font-bold text-sm">{token.symbol}</span>
                <span className="text-[10px] opacity-75">{token.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Field>
          <FieldLabel className="font-medium text-sm">
            Recipient Address
          </FieldLabel>
          <Input
            placeholder="Enter Solana Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="rounded-lg"
            disabled={isSending}
          />
        </Field>

        <Field>
          <FieldLabel className="font-medium text-sm">Amount</FieldLabel>
          <Input
            type="number"
            step="any"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-lg"
            disabled={isSending}
          />
        </Field>

        <Button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-6"
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Spinner className="size-4" />
              Transferring...
            </>
          ) : (
            <>
              <ArrowUpRight className="size-4" />
              Send {selectedToken.symbol}
            </>
          )}
        </Button>
      </form>
    </>
  );
}

/* ================================================================== */
/* 4. WITHDRAW VIEW (WITHDRAW TOKEN MODAL)                           */
/* ================================================================== */
interface WithdrawViewProps {
  userApi: UserAPI;
  linkedWallets: LinkedWallet[];
  onBack: () => void;
  onClose: () => void;
}

function WithdrawView({
  userApi,
  linkedWallets,
  onBack,
  onClose,
}: WithdrawViewProps) {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [destination, setDestination] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Set default withdraw address to first linked wallet if available
  useEffect(() => {
    if (linkedWallets.length > 0 && !destination) {
      setDestination(linkedWallets[0].address);
    }
  }, [linkedWallets, destination]);

  const handleWithdraw = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!userApi) {
      toast.error("User API not initialized. Please try again.");
      return;
    }
    if (!destination) {
      toast.error("Please specify a destination address");
      return;
    }

    setIsWithdrawing(true);
    try {
      // Execute withdraw using userApi with amount undefined (withdrawing entire balance)
      const response = await userApi.transaction.action.transfer({
        mint: selectedToken.mint,
        recipient: destination,
        amount: undefined, // amount is optional -> triggers full balance transfer on server
        feeConfig: { maxFee: 0.01 },
      });

      toast.success(
        `Withdrawal initiated successfully! Signature: ${response.signature.slice(0, 8)}...`,
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        `Withdrawal failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-8 rounded-full"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <DialogTitle>Withdraw Token</DialogTitle>
        </div>
      </DialogHeader>

      <form
        onSubmit={handleWithdraw}
        className="space-y-4 py-3"
      >
        {/* Token selection */}
        <div className="space-y-2">
          <p className="font-medium text-muted-foreground text-xs">
            Select Token to Withdraw (Full Balance):
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TOKENS.map((token) => (
              <button
                type="button"
                key={token.symbol}
                onClick={() => setSelectedToken(token)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200",
                  selectedToken.symbol === token.symbol
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="font-bold text-sm">{token.symbol}</span>
                <span className="text-[10px] opacity-75">{token.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Destination input */}
        <Field>
          <FieldLabel className="font-medium text-sm">
            Destination Address
          </FieldLabel>
          <Input
            placeholder="Enter Solana Address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded-lg"
            disabled={isWithdrawing}
          />
        </Field>

        {/* Linked accounts selection */}
        {linkedWallets && linkedWallets.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-xs">
              Or withdraw to a linked account:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {linkedWallets.map((wallet) => (
                <button
                  type="button"
                  key={wallet.address}
                  onClick={() => setDestination(wallet.address)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border bg-card p-3 text-left text-xs transition-all duration-200 hover:bg-accent",
                    destination.toLowerCase() === wallet.address.toLowerCase()
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-muted-foreground" />
                    <span className="font-medium capitalize">
                      {wallet.walletClientType || "External Wallet"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-6"
          disabled={isWithdrawing}
        >
          {isWithdrawing ? (
            <>
              <Spinner className="size-4" />
              Withdrawing...
            </>
          ) : (
            <>
              <ArrowDownLeft className="size-4" />
              Withdraw All {selectedToken.symbol}
            </>
          )}
        </Button>
      </form>
    </>
  );
}
