# RiftBeacon Architecture

## Overview

RiftBeacon is a liveness-based Sybil resistance protocol designed to verify user presence without compromising privacy. This document details the system architecture and design decisions.

## System Components

### Smart Contracts

#### LivenessGateway
The main entry point for all liveness proof operations. Coordinates between other modules to validate user presence.

**Key Responsibilities:**
- Challenge creation and management
- Response validation
- Integration with attestation, nullifier, and scoring systems

**State:**
- Session mappings (sessionId → Session)
- Challenge configurations
- Timing constraints

#### AttestationRegistry
Manages ephemeral device attestations with expiry tracking.

**Key Responsibilities:**
- Attestation registration
- Validity checking
- Expiry management
- Revocation handling

**Security Features:**
- Time-bound attestations
- Revocation mechanism
- Access control via roles

#### NullifierSet
Enforces uniqueness by tracking consumed nullifiers.

**Key Responsibilities:**
- Nullifier consumption
- Duplicate detection
- Consumer tracking

**Anti-Replay Protection:**
- One-time use enforcement
- Zero nullifier rejection
- Consumer address tracking

#### ScoreEngine
Maintains liveness scores with decay and update mechanisms.

**Key Responsibilities:**
- Score initialization
- Score updates (positive/negative)
- Decay application
- Activity tracking

**Scoring Model:**
- Max score: 10,000
- Decay rate: 0.1% per day
- Decay interval: 1 day

#### ZKVerifier
Verifies zero-knowledge proofs for privacy-preserving scenarios.

**Key Responsibilities:**
- Proof verification
- Commitment management
- Batch verification support

**Note:** Current implementation is simplified. Production should use libraries like Groth16 or PLONK.

#### PenaltyModule
Manages penalties and blacklisting for farming prevention.

**Key Responsibilities:**
- Penalty application
- Blacklist management
- Threshold enforcement

**Parameters:**
- Penalty threshold: 500 score
- Blacklist duration: 7 days
- Auto-blacklist: 3 penalties

## Data Flow

### Liveness Proof Lifecycle

```
1. User initiates challenge
   ↓
2. LivenessGateway creates session
   ↓
3. ChallengeIssued event emitted
   ↓
4. User device generates entropy
   ↓
5. User submits response with attestation
   ↓
6. LivenessGateway validates:
   - Session validity
   - Time constraints
   - Entropy freshness
   ↓
7. AttestationRegistry registers attestation
   ↓
8. NullifierSet consumes nullifier
   ↓
9. ScoreEngine updates user score
   ↓
10. ResponseSubmitted event emitted
```

## Security Model

### Anti-Replay Protection
- Nullifiers prevent proof reuse
- Session-based challenges
- Time-bound validity windows

### Anti-Emulation
- Device attestation (TEE/WebAuthn in production)
- Entropy requirements
- Challenge-response protocol

### Privacy Preservation
- No biometric data
- No device fingerprints
- Optional ZK proofs for unlinkability
- No identity correlation

### Anti-Farming
- Score decay mechanism
- Penalty system
- Blacklisting
- Cooldown periods

## Access Control

### Role-Based Permissions

**Admin Roles:**
- DEFAULT_ADMIN_ROLE: Full system control
- Can grant/revoke other roles

**Operational Roles:**
- OPERATOR_ROLE: Can manage gateway operations
- REGISTRAR_ROLE: Can register attestations
- CONSUMER_ROLE: Can consume nullifiers
- SCORER_ROLE: Can update scores
- ENFORCER_ROLE: Can apply penalties

## Integration Points

### Frontend SDK
- Challenge initiation
- Entropy generation
- Response submission
- Score queries

### Oracle Services
- TEE attestation verification
- WebAuthn validation
- Entropy quality checks

### External Systems
- Airdrop contracts
- DAO governance
- Task/quest systems
- Campaign gating

## Deployment Considerations

### Network Selection
- Optimism (L2 scaling)
- Base (low fees)
- Any EVM-compatible chain

### Gas Optimization
- Efficient storage patterns
- Minimal on-chain computation
- Batch operations where possible

### Upgradeability
- Current contracts are non-upgradeable
- Use proxy patterns for production
- Careful role management

## Future Enhancements

### Planned Features
- FHE support for on-chain privacy
- Multi-device session synchronization
- Cross-chain attestations (LayerZero)
- Geofenced proofs for events
- Advanced ML-based risk scoring

### Research Areas
- Improved ZK circuits
- Hardware-backed attestations
- Biometric-free liveness detection
- Decentralized oracle networks

