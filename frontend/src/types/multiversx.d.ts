declare module '@multiversx/sdk-dapp' {
  export class ExtensionProvider {
    static getInstance(): ExtensionProvider;
    init(): Promise<void>;
    account: Promise<{ address: string }>;
  }
} 