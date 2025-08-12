# RiftBeacon

## Liveness-Proof Sybil Resistance & Anti-Farm Network

RiftBeacon is a liveness-based Sybil resistance protocol that verifies a user is real, unique, and currently present — without revealing identity, biometrics, device fingerprints, or behavioral logs.

### Overview

Instead of ZK-identity or SBT approaches, RiftBeacon challenges devices through entropy, temporal proofs, and ephemeral attestations, creating a new primitive: **Proof-of-Liveness (PoL)**.

### Target Environment

- EVM (Optimism/Base)
- Device entropy oracle
- Optional zk-binding

### Primary Use Cases

- **Sybil-resistant airdrops**: Ensure fair token distribution
- **Fair task/quest systems**: Prevent bot farming
- **DAO governance**: Liveness-based voting
- **Anti-bot gating**: Protect campaigns and growth systems

### Core Features

- Challenge–response liveness proof (time-sensitive)
- Ephemeral session attestations
- Device entropy oracle (TEE/Mobile secure enclave or WebAuthn)
- Nullifier-based uniqueness (prevent repeated farming)
- Optional ZK binding for advanced privacy mode
- Liveness score and penalty system

### Architecture

```
[User Device / SDK]
       │   (entropy + challenge)
       ▼
[LivenessGateway.sol] ──────→ [AttestationRegistry.sol]
       │
       ▼
[NullifierSet.sol]  ←── [ZKVerifier.sol] (optional)
       │
       ▼
 [ScoreEngine.sol]
       │
       ▼
[App Integrations / Airdrop / DAO]
```

### Smart Contracts

The core contracts include:

- **LivenessGateway**: Main entry point for liveness proof submission
- **AttestationRegistry**: Manages ephemeral device attestations
- **NullifierSet**: Enforces uniqueness and prevents proof reuse
- **ScoreEngine**: Maintains liveness scores with decay mechanism
- **ZKVerifier**: Verifies zero-knowledge proofs for privacy
- **PenaltyModule**: Manages penalties and blacklisting

### Getting Started

#### Installation

```bash
npm install
```

#### Compile Contracts

```bash
npx hardhat compile
```

#### Run Tests

```bash
npx hardhat test
```

#### Deploy

```bash
npx hardhat run scripts/deploy.js --network optimism
```

### SDK Usage

```typescript
import { RiftBeaconSDK } from '@riftbeacon/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
const wallet = new ethers.Wallet(privateKey, provider);
const sdk = new RiftBeaconSDK(provider, gatewayAddress, wallet);

// Create and complete liveness challenge
const sessionId = await sdk.startChallenge(300);
await sdk.submitResponse(sessionId);
```

### Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)

### Contributing

Contributions are welcome! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

### Community

- GitHub Discussions: Coming soon
- Discord: Coming soon
- Twitter: Coming soon

### Security

This project is under active development. Please do not use in production without thorough auditing.

For security concerns, please see our [Security Policy](docs/SECURITY.md).

### License

MIT License

