import { RiftBeaconSDK } from '../src/index';
import { ethers } from 'ethers';

/**
 * Advanced usage patterns for RiftBeacon SDK
 */

interface LivenessCheckResult {
  eligible: boolean;
  score: bigint;
  lastActivity: bigint;
}

class AdvancedRiftBeacon {
  private sdk: RiftBeaconSDK;
  private provider: ethers.Provider;
  private scoreEngineAddress: string;

  constructor(
    provider: ethers.Provider,
    gatewayAddress: string,
    scoreEngineAddress: string,
    signer?: ethers.Signer
  ) {
    this.sdk = new RiftBeaconSDK(provider, gatewayAddress, signer);
    this.provider = provider;
    this.scoreEngineAddress = scoreEngineAddress;
  }

  /**
   * Perform complete liveness check with retry
   */
  async performLivenessCheck(
    maxRetries: number = 3
  ): Promise<LivenessCheckResult> {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const sessionId = await this.sdk.startChallenge(300);
        await this.sdk.submitResponse(sessionId);
        
        const score = await this.getScore();
        const lastActivity = await this.getLastActivity();
        
        return {
          eligible: score >= 1000n,
          score,
          lastActivity
        };
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) throw error;
        await this.sleep(2000 * attempt);
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  /**
   * Get current score
   */
  private async getScore(): Promise<bigint> {
    const signer = (this.sdk as any).signer;
    if (!signer) throw new Error('Signer required');
    
    const address = await signer.getAddress();
    return await this.sdk.getLivenessScore(address, this.scoreEngineAddress);
  }

  /**
   * Get last activity timestamp
   */
  private async getLastActivity(): Promise<bigint> {
    const scoreEngine = new ethers.Contract(
      this.scoreEngineAddress,
      ['function getLastActivity(address) view returns (uint256)'],
      this.provider
    );
    
    const signer = (this.sdk as any).signer;
    const address = await signer.getAddress();
    
    return await scoreEngine.getLastActivity(address);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default AdvancedRiftBeacon;

