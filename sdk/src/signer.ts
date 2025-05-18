import { ethers } from 'ethers';

/**
 * Signer utilities for RiftBeacon SDK
 */

export class SignerManager {
  private signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    this.signer = signer;
  }

  async getAddress(): Promise<string> {
    return await this.signer.getAddress();
  }

  async signMessage(message: string): Promise<string> {
    return await this.signer.signMessage(message);
  }

  async signTransaction(transaction: ethers.TransactionRequest): Promise<string> {
    return await this.signer.signTransaction(transaction);
  }

  getSigner(): ethers.Signer {
    return this.signer;
  }
}

