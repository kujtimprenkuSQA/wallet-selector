import ProviderService from "../services/provider/ProviderService";
import { Options } from "../core/NearWalletSelector";

export interface WalletOptions {
  provider: ProviderService;
  options: Options;
}

export interface FunctionCallAction {
  methodName: string;
  args: object;
  gas: string;
  deposit: string;
}

export interface SignAndSendTransactionParams {
  receiverId: string;
  actions: Array<FunctionCallAction>;
}

export interface AccountInfo {
  accountId: string;
  balance: string;
}

export type WalletType = "browser" | "injected" | "hardware";

interface BaseWallet {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string;
  type: WalletType;

  // Determines if the wallet is available for selection.
  // - Browser wallets: always supported?
  // - Hardware wallets: transport layer supported and on desktop?
  // - Injected wallet: installed and on desktop?
  isAvailable(): boolean;

  // Determines if we've already signed in previously, before attempting a new connection.
  // - Hardware wallets: should defer an actual connection until user input is required (e.g. public key or signing).
  connect(): Promise<void>;

  // Removes connection to the wallet and triggers a cleanup of subscriptions etc.
  disconnect(): Promise<void>;

  // Determines if we're signed in with the wallet.
  // - Hardware wallets: do we have a public key & accountId?
  // - isSignedIn is a common method in other wallets.
  isConnected(): Promise<boolean>;

  // Retrieves account info based on associated accountId.
  getAccount(): Promise<AccountInfo | null>;

  // TODO: Determine standardised response.
  signAndSendTransaction(
    params: SignAndSendTransactionParams
  ): Promise<unknown>;
}

export interface BrowserWallet extends BaseWallet {
  type: "browser";
}

export interface InjectedWallet extends BaseWallet {
  type: "injected";
}

export interface HardwareWallet extends BaseWallet {
  type: "hardware";
  setAccountId(accountId: string): void;
  setDerivationPath(derivationPath: string): void;
}

export type Wallet = BrowserWallet | InjectedWallet | HardwareWallet;
