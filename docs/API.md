# RiftBeacon API Documentation

## Smart Contract API

### LivenessGateway

#### `startChallenge(bytes32 challengeHash, uint256 duration) → bytes32 sessionId`

Initiates a new liveness challenge.

**Parameters:**
- `challengeHash`: Keccak256 hash of challenge data
- `duration`: Challenge validity period in seconds (30s - 10min)

**Returns:**
- `sessionId`: Unique identifier for the challenge session

**Events:**
- `ChallengeIssued(bytes32 indexed sessionId, address indexed user, bytes32 challengeHash, uint256 expiresAt)`

**Errors:**
- `InvalidChallengeDuration()`: Duration outside allowed range

#### `submitResponse(bytes32 sessionId, bytes attestation, bytes32 entropyHash)`

Submits a response to an active challenge.

**Parameters:**
- `sessionId`: Session identifier from startChallenge
- `attestation`: Device attestation data
- `entropyHash`: Hash of entropy collected from device

**Events:**
- `ResponseSubmitted(bytes32 indexed sessionId, address indexed user, bytes32 attestationHash, bool success)`

**Errors:**
- `SessionNotFound()`: Invalid session ID
- `SessionExpired()`: Challenge window elapsed
- `SessionAlreadyCompleted()`: Response already submitted
- `InvalidAttestation()`: Attestation validation failed
- `InvalidEntropy()`: Entropy does not meet requirements

#### `getSession(bytes32 sessionId) → Session`

Retrieves session information.

**Parameters:**
- `sessionId`: Session identifier

**Returns:**
- `Session` struct containing:
  - `address user`: Session owner
  - `bytes32 challengeHash`: Challenge hash
  - `uint256 timestamp`: Creation time
  - `uint256 expiresAt`: Expiry time
  - `bool completed`: Completion status

#### `isSessionActive(bytes32 sessionId) → bool`

Checks if a session is currently active.

**Parameters:**
- `sessionId`: Session identifier

**Returns:**
- `bool`: True if session exists, is not completed, and not expired

---

### AttestationRegistry

#### `registerAttestation(bytes32 sessionId, bytes32 attestationHash, uint256 expiry)`

Registers a new attestation.

**Access:** REGISTRAR_ROLE required

**Parameters:**
- `sessionId`: Associated session ID
- `attestationHash`: Hash of attestation data
- `expiry`: Unix timestamp when attestation expires

**Events:**
- `AttestationRegistered(bytes32 indexed sessionId, bytes32 indexed attestationHash, uint256 expiresAt)`

**Errors:**
- `InvalidExpiry()`: Expiry time is in the past

#### `validateAttestation(bytes32 attestationHash) → bool`

Checks if an attestation is valid.

**Parameters:**
- `attestationHash`: Attestation to validate

**Returns:**
- `bool`: True if attestation exists, not revoked, and not expired

#### `revokeAttestation(bytes32 attestationHash)`

Revokes an attestation before its expiry.

**Access:** REGISTRAR_ROLE required

**Parameters:**
- `attestationHash`: Attestation to revoke

**Events:**
- `AttestationRevoked(bytes32 indexed attestationHash)`

**Errors:**
- `AttestationNotFound()`: Attestation does not exist

---

### NullifierSet

#### `consumeNullifier(bytes32 nullifier)`

Marks a nullifier as used.

**Access:** CONSUMER_ROLE required

**Parameters:**
- `nullifier`: Nullifier value to consume

**Events:**
- `NullifierConsumed(bytes32 indexed nullifier, address indexed consumer)`

**Errors:**
- `NullifierAlreadyUsed(bytes32 nullifier)`: Nullifier was previously consumed
- `InvalidNullifier()`: Nullifier is zero

#### `isNullifierUsed(bytes32 nullifier) → bool`

Checks if a nullifier has been consumed.

**Parameters:**
- `nullifier`: Nullifier to check

**Returns:**
- `bool`: True if nullifier has been used

---

### ScoreEngine

#### `getLivenessScore(address user) → uint256`

Retrieves user's current liveness score.

**Parameters:**
- `user`: User address

**Returns:**
- `uint256`: Current liveness score (0-10000)

#### `updateScore(address user, int256 delta)`

Updates a user's score.

**Access:** SCORER_ROLE required

**Parameters:**
- `user`: User address
- `delta`: Score change (positive or negative)

**Events:**
- `ScoreUpdated(address indexed user, int256 delta, uint256 newScore)`

#### `applyDecay(address user)`

Applies time-based score decay.

**Parameters:**
- `user`: User address

**Events:**
- `ScoreDecayed(address indexed user, uint256 oldScore, uint256 newScore)`

#### `getLastActivity(address user) → uint256`

Gets timestamp of user's last activity.

**Parameters:**
- `user`: User address

**Returns:**
- `uint256`: Unix timestamp of last activity

#### `initializeScore(address user, uint256 initialScore)`

Initializes score for a new user.

**Access:** SCORER_ROLE required

**Parameters:**
- `user`: User address
- `initialScore`: Starting score value

**Errors:**
- `ScoreOverflow()`: Initial score exceeds MAX_SCORE

---

### PenaltyModule

#### `applyPenalty(address user, uint256 amount, string reason)`

Applies a penalty to a user.

**Access:** ENFORCER_ROLE required

**Parameters:**
- `user`: User to penalize
- `amount`: Score reduction amount
- `reason`: Description of penalty reason

**Events:**
- `Penalized(address indexed user, uint256 amount, string reason)`
- `Blacklisted(address indexed user, uint256 until)` (if triggered)

**Errors:**
- `InvalidPenaltyAmount()`: Amount is zero

#### `isBlacklisted(address user) → bool`

Checks if a user is currently blacklisted.

**Parameters:**
- `user`: User to check

**Returns:**
- `bool`: True if user is blacklisted

#### `removeBlacklist(address user)`

Removes a user from the blacklist.

**Access:** DEFAULT_ADMIN_ROLE required

**Parameters:**
- `user`: User to unblacklist

**Events:**
- `BlacklistRemoved(address indexed user)`

---

### ZKVerifier

#### `verifyProof(Proof proof, bytes32[] publicInputs) → bool`

Verifies a zero-knowledge proof.

**Parameters:**
- `proof`: Proof struct containing:
  - `bytes32 commitment`
  - `bytes32 response`
  - `bytes32 challenge`
- `publicInputs`: Array of public input values

**Returns:**
- `bool`: True if proof is valid

**Events:**
- `ProofVerified(bytes32 indexed proofHash, address indexed prover)`

**Errors:**
- `ProofAlreadyVerified()`: Proof was already verified
- `CommitmentAlreadyUsed()`: Commitment was already used
- `InvalidProof()`: Proof verification failed

## SDK API

### RiftBeaconSDK

#### `constructor(provider, gatewayAddress, signer?)`

Creates a new SDK instance.

**Parameters:**
- `provider`: ethers.js Provider instance
- `gatewayAddress`: Deployed LivenessGateway address
- `signer`: (optional) ethers.js Signer for transactions

#### `generateEntropy() → Promise<string>`

Generates device entropy for liveness proof.

**Returns:**
- Promise resolving to entropy hash (bytes32)

#### `startChallenge(duration?) → Promise<string>`

Creates a liveness challenge.

**Parameters:**
- `duration`: (optional) Challenge duration in seconds (default: 300)

**Returns:**
- Promise resolving to session ID

**Throws:**
- Error if no signer provided
- Error if transaction fails

#### `submitResponse(sessionId) → Promise<boolean>`

Submits response to a challenge.

**Parameters:**
- `sessionId`: Session ID from startChallenge

**Returns:**
- Promise resolving to true on success

**Throws:**
- Error if no signer provided
- Error if transaction fails

#### `isSessionActive(sessionId) → Promise<boolean>`

Checks if a session is active.

**Parameters:**
- `sessionId`: Session ID to check

**Returns:**
- Promise resolving to boolean

#### `getLivenessScore(address, scoreEngineAddress) → Promise<bigint>`

Retrieves liveness score for an address.

**Parameters:**
- `address`: User address to query
- `scoreEngineAddress`: Deployed ScoreEngine address

**Returns:**
- Promise resolving to score value

## Integration Examples

### JavaScript/TypeScript

```typescript
import { RiftBeaconSDK } from '@riftbeacon/sdk';
import { ethers } from 'ethers';

// Initialize
const provider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
const wallet = new ethers.Wallet(privateKey, provider);
const sdk = new RiftBeaconSDK(provider, gatewayAddress, wallet);

// Create challenge
const sessionId = await sdk.startChallenge(300);

// Submit response
await sdk.submitResponse(sessionId);

// Check score
const score = await sdk.getLivenessScore(
  wallet.address,
  scoreEngineAddress
);
```

### Solidity Integration

```solidity
import "@riftbeacon/contracts/interfaces/ILivenessGateway.sol";
import "@riftbeacon/contracts/interfaces/IScoreEngine.sol";

contract MyAirdrop {
    ILivenessGateway public gateway;
    IScoreEngine public scoreEngine;
    
    uint256 public constant MIN_SCORE = 1000;
    
    function claim() external {
        uint256 score = scoreEngine.getLivenessScore(msg.sender);
        require(score >= MIN_SCORE, "Insufficient liveness score");
        
        // Distribute tokens
        // ...
    }
}
```

