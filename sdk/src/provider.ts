import { ethers } from 'ethers';

/**
 * Provider utilities for RiftBeacon SDK
 */

export class ProviderManager {
  private provider: ethers.Provider;
  private network?: ethers.Network;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  async getNetwork(): Promise<ethers.Network> {
    if (!this.network) {
      this.network = await this.provider.getNetwork();
    }
    return this.network;
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getGasPrice(): Promise<bigint> {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice || 0n;
  }

  async estimateGas(transaction: ethers.TransactionRequest): Promise<bigint> {
    return await this.provider.estimateGas(transaction);
  }

  getProvider(): ethers.Provider {
    return this.provider;
  }
}

