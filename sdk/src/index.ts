import { ethers } from 'ethers';

/**
 * RiftBeacon SDK for generating liveness proofs
 */
export class RiftBeaconSDK {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private gatewayAddress: string;

  constructor(provider: ethers.Provider, gatewayAddress: string, signer?: ethers.Signer) {
    this.provider = provider;
    this.gatewayAddress = gatewayAddress;
    this.signer = signer;
  }

  /**
   * Generate device entropy for liveness proof
   * This should be enhanced with actual TEE/WebAuthn in production
   */
  async generateEntropy(): Promise<string> {
    const timestamp = Date.now();
    const random = ethers.randomBytes(32);
    const combined = ethers.concat([
      ethers.toBeArray(timestamp),
      random
    ]);
    return ethers.keccak256(combined);
  }

  /**
   * Create a liveness challenge
   */
  async startChallenge(duration: number = 300): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for this operation');
    }

    const challengeData = ethers.randomBytes(32);
    const challengeHash = ethers.keccak256(challengeData);

    const gateway = new ethers.Contract(
      this.gatewayAddress,
      ['function startChallenge(bytes32 challengeHash, uint256 duration) returns (bytes32)'],
      this.signer
    );

    const tx = await gateway.startChallenge(challengeHash, duration);
    const receipt = await tx.wait();

    // Extract session ID from event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = gateway.interface.parseLog(log);
        return parsed?.name === 'ChallengeIssued';
      } catch {
        return false;
      }
    });

    if (!event) {
      throw new Error('Failed to find ChallengeIssued event');
    }

    const parsed = gateway.interface.parseLog(event);
    return parsed?.args[0]; // sessionId
  }

  /**
   * Submit response to a liveness challenge
   */
  async submitResponse(sessionId: string): Promise<boolean> {
    if (!this.signer) {
      throw new Error('Signer required for this operation');
    }

    const entropyHash = await this.generateEntropy();
    const attestation = await this.generateAttestation(sessionId);

    const gateway = new ethers.Contract(
      this.gatewayAddress,
      ['function submitResponse(bytes32 sessionId, bytes attestation, bytes32 entropyHash)'],
      this.signer
    );

    const tx = await gateway.submitResponse(sessionId, attestation, entropyHash);
    await tx.wait();

    return true;
  }

  /**
   * Generate attestation data
   * This should be enhanced with actual device attestation in production
   */
  private async generateAttestation(sessionId: string): Promise<Uint8Array> {
    const timestamp = Date.now();
    const address = await this.signer!.getAddress();
    
    const data = ethers.solidityPacked(
      ['bytes32', 'address', 'uint256'],
      [sessionId, address, timestamp]
    );

    return ethers.getBytes(data);
  }

  /**
   * Check if a session is active
   */
  async isSessionActive(sessionId: string): Promise<boolean> {
    const gateway = new ethers.Contract(
      this.gatewayAddress,
      ['function isSessionActive(bytes32 sessionId) view returns (bool)'],
      this.provider
    );

    return await gateway.isSessionActive(sessionId);
  }

  /**
   * Get user's liveness score
   */
  async getLivenessScore(address: string, scoreEngineAddress: string): Promise<bigint> {
    const scoreEngine = new ethers.Contract(
      scoreEngineAddress,
      ['function getLivenessScore(address user) view returns (uint256)'],
      this.provider
    );

    return await scoreEngine.getLivenessScore(address);
  }
}

export default RiftBeaconSDK;

