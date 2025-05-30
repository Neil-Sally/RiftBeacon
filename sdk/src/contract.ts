import { ethers, Contract } from 'ethers';

/**
 * Contract utilities for RiftBeacon SDK
 */

export class ContractManager {
  private contracts: Map<string, Contract>;
  private provider: ethers.Provider;
  private signer?: ethers.Signer;

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
    this.contracts = new Map();
  }

  getContract(address: string, abi: any[]): Contract {
    const key = `${address.toLowerCase()}-${JSON.stringify(abi).slice(0, 100)}`;
    
    if (!this.contracts.has(key)) {
      const contract = new Contract(
        address,
        abi,
        this.signer || this.provider
      );
      this.contracts.set(key, contract);
    }
    
    return this.contracts.get(key)!;
  }

  clearCache(): void {
    this.contracts.clear();
  }
}

