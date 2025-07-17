# RiftBeacon SDK

Official JavaScript/TypeScript SDK for integrating RiftBeacon liveness proofs.

## Installation

```bash
npm install @riftbeacon/sdk ethers
```

## Quick Start

```typescript
import { RiftBeaconSDK } from '@riftbeacon/sdk';
import { ethers } from 'ethers';

// Initialize
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
const wallet = new ethers.Wallet('PRIVATE_KEY', provider);
const sdk = new RiftBeaconSDK(provider, 'GATEWAY_ADDRESS', wallet);

// Generate liveness proof
const sessionId = await sdk.startChallenge(300);
await sdk.submitResponse(sessionId);

// Check score
const score = await sdk.getLivenessScore(wallet.address, 'SCORE_ENGINE_ADDRESS');
console.log('Liveness Score:', score.toString());
```

## API Reference

### Constructor

```typescript
new RiftBeaconSDK(provider: Provider, gatewayAddress: string, signer?: Signer)
```

### Methods

#### `startChallenge(duration?: number): Promise<string>`

Creates a new liveness challenge.

**Parameters:**
- `duration` (optional): Challenge duration in seconds (default: 300)

**Returns:** Session ID

#### `submitResponse(sessionId: string): Promise<boolean>`

Submits response to a challenge.

**Parameters:**
- `sessionId`: Session ID from startChallenge

**Returns:** Success boolean

#### `isSessionActive(sessionId: string): Promise<boolean>`

Checks if a session is active.

**Parameters:**
- `sessionId`: Session ID to check

**Returns:** Active status boolean

#### `getLivenessScore(address: string, scoreEngineAddress: string): Promise<bigint>`

Retrieves liveness score for an address.

**Parameters:**
- `address`: User address
- `scoreEngineAddress`: ScoreEngine contract address

**Returns:** Score value

#### `generateEntropy(): Promise<string>`

Generates device entropy.

**Returns:** Entropy hash

## Examples

See the [examples directory](./examples) for complete usage examples.

## License

MIT

