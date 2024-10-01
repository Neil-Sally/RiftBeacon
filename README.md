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

### Getting Started

Coming soon...

### License

MIT License

