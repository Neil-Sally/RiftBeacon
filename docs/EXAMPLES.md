# Usage Examples

## Basic Liveness Proof

```javascript
const sdk = new RiftBeaconSDK(provider, gatewayAddress, signer);

// Create challenge
const sessionId = await sdk.startChallenge(300);

// Submit response
await sdk.submitResponse(sessionId);
```

## Check User Score

```javascript
const score = await sdk.getLivenessScore(userAddress, scoreEngineAddress);
console.log(`Score: ${score}`);
```

## Airdrop Integration

```solidity
function claimAirdrop() external {
    uint256 score = scoreEngine.getLivenessScore(msg.sender);
    require(score >= MIN_SCORE, "Insufficient score");
    // Distribute tokens
}
```

## DAO Voting

```solidity
function castVote(uint256 proposalId, bool support) external {
    uint256 votingPower = scoreEngine.getLivenessScore(msg.sender);
    require(votingPower >= MIN_VOTING_POWER, "Insufficient voting power");
    // Record vote
}
```

## Quest System

```solidity
function completeQuest(bytes32 sessionId) external {
    require(gateway.isSessionActive(sessionId), "Invalid proof");
    // Award rewards
}
```

