import { RiftBeaconSDK } from '../src/index';
import { ethers } from 'ethers';

/**
 * Basic usage example for RiftBeacon SDK
 */
async function main() {
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_URL || 'https://mainnet.optimism.io'
  );
  
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY || '',
    provider
  );

  // Contract addresses (replace with actual deployed addresses)
  const gatewayAddress = process.env.GATEWAY_ADDRESS || '';
  const scoreEngineAddress = process.env.SCORE_ENGINE_ADDRESS || '';

  // Initialize SDK
  const sdk = new RiftBeaconSDK(provider, gatewayAddress, wallet);

  try {
    // Step 1: Create a liveness challenge
    console.log('Creating liveness challenge...');
    const sessionId = await sdk.startChallenge(300); // 5 minutes
    console.log('Challenge created:', sessionId);

    // Step 2: Check if session is active
    const isActive = await sdk.isSessionActive(sessionId);
    console.log('Session active:', isActive);

    // Step 3: Generate and submit response
    console.log('Submitting response...');
    const success = await sdk.submitResponse(sessionId);
    console.log('Response submitted:', success);

    // Step 4: Check liveness score
    const score = await sdk.getLivenessScore(
      wallet.address,
      scoreEngineAddress
    );
    console.log('Current liveness score:', score.toString());

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run example
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;

