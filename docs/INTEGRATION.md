# Integration Guide

## Overview

This guide helps developers integrate RiftBeacon's liveness proof system into their applications.

## Quick Start

### 1. Install Dependencies

```bash
npm install @riftbeacon/sdk ethers
```

### 2. Basic Integration

```typescript
import { RiftBeaconSDK } from '@riftbeacon/sdk';
import { ethers } from 'ethers';

// Initialize SDK
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
const sdk = new RiftBeaconSDK(provider, 'GATEWAY_ADDRESS', wallet);

// Create challenge
const sessionId = await sdk.startChallenge(300);

// Submit response
await sdk.submitResponse(sessionId);

// Check score
const score = await sdk.getLivenessScore(wallet.address, 'SCORE_ENGINE_ADDRESS');
```

## Integration Patterns

### Pattern 1: Airdrop Gating

Use liveness scores to ensure fair token distribution.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@riftbeacon/contracts/interfaces/IScoreEngine.sol";

contract MyAirdrop {
    IScoreEngine public scoreEngine;
    uint256 public constant MIN_SCORE = 1000;
    
    function claim() external {
        require(
            scoreEngine.getLivenessScore(msg.sender) >= MIN_SCORE,
            "Insufficient liveness score"
        );
        // Distribute tokens
    }
}
```

### Pattern 2: DAO Governance

Weight votes by liveness engagement.

```solidity
contract LivenessGovernance {
    IScoreEngine public scoreEngine;
    
    function getVotingPower(address voter) public view returns (uint256) {
        uint256 score = scoreEngine.getLivenessScore(voter);
        // Scale voting power by score
        return (score * baseVotingPower) / 10000;
    }
}
```

### Pattern 3: Quest System

Require liveness proof for task completion.

```solidity
contract QuestSystem {
    ILivenessGateway public gateway;
    
    function completeQuest(bytes32 sessionId) external {
        require(
            gateway.isSessionActive(sessionId),
            "Invalid liveness proof"
        );
        // Award quest rewards
    }
}
```

## Frontend Integration

### React Example

```typescript
import { useState, useEffect } from 'react';
import { RiftBeaconSDK } from '@riftbeacon/sdk';
import { useWallet } from './hooks/useWallet';

function LivenessProofButton() {
  const { provider, signer } = useWallet();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const sdk = new RiftBeaconSDK(
    provider,
    process.env.GATEWAY_ADDRESS,
    signer
  );

  const handleProofGeneration = async () => {
    try {
      setLoading(true);
      
      // Create challenge
      const sessionId = await sdk.startChallenge(300);
      
      // Wait for user interaction or automatic response
      await sdk.submitResponse(sessionId);
      
      // Update score
      const newScore = await sdk.getLivenessScore(
        await signer.getAddress(),
        process.env.SCORE_ENGINE_ADDRESS
      );
      setScore(Number(newScore));
      
    } catch (error) {
      console.error('Proof generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Liveness Score: {score}</p>
      <button onClick={handleProofGeneration} disabled={loading}>
        {loading ? 'Generating Proof...' : 'Generate Liveness Proof'}
      </button>
    </div>
  );
}
```

### Vue.js Example

```vue
<template>
  <div>
    <p>Liveness Score: {{ score }}</p>
    <button @click="generateProof" :disabled="loading">
      {{ loading ? 'Generating...' : 'Generate Proof' }}
    </button>
  </div>
</template>

<script>
import { RiftBeaconSDK } from '@riftbeacon/sdk';

export default {
  data() {
    return {
      score: 0,
      loading: false,
      sdk: null
    };
  },
  mounted() {
    this.sdk = new RiftBeaconSDK(
      this.$provider,
      process.env.GATEWAY_ADDRESS,
      this.$signer
    );
  },
  methods: {
    async generateProof() {
      this.loading = true;
      try {
        const sessionId = await this.sdk.startChallenge(300);
        await this.sdk.submitResponse(sessionId);
        const newScore = await this.sdk.getLivenessScore(
          await this.$signer.getAddress(),
          process.env.SCORE_ENGINE_ADDRESS
        );
        this.score = Number(newScore);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## Backend Integration

### Node.js Express Example

```typescript
import express from 'express';
import { ethers } from 'ethers';
import { RiftBeaconSDK } from '@riftbeacon/sdk';

const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

app.post('/api/verify-liveness', async (req, res) => {
  try {
    const { address } = req.body;
    
    const sdk = new RiftBeaconSDK(
      provider,
      process.env.GATEWAY_ADDRESS
    );
    
    const score = await sdk.getLivenessScore(
      address,
      process.env.SCORE_ENGINE_ADDRESS
    );
    
    res.json({
      address,
      score: Number(score),
      eligible: Number(score) >= 1000
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## Testing Integration

### Unit Tests

```typescript
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Airdrop Integration', function() {
  it('should allow claim with sufficient score', async function() {
    // Setup
    const [user] = await ethers.getSigners();
    const airdrop = await deployAirdrop();
    
    // Set score
    await scoreEngine.initializeScore(user.address, 2000);
    
    // Claim
    await expect(airdrop.connect(user).claim())
      .to.emit(airdrop, 'AirdropClaimed');
  });
});
```

## Best Practices

### 1. Error Handling

Always handle potential errors gracefully:

```typescript
try {
  const sessionId = await sdk.startChallenge(300);
  await sdk.submitResponse(sessionId);
} catch (error) {
  if (error.code === 'SESSION_EXPIRED') {
    // Handle expired session
  } else if (error.code === 'INSUFFICIENT_SCORE') {
    // Handle low score
  } else {
    // Handle other errors
  }
}
```

### 2. Score Thresholds

Choose appropriate minimums for your use case:

- **Airdrops**: 1000-2000
- **Governance**: 500-1000
- **Premium Features**: 2000-5000
- **High-Value Actions**: 5000+

### 3. User Experience

- Show real-time score updates
- Explain liveness requirements
- Provide clear error messages
- Add loading states
- Cache score data appropriately

### 4. Security

- Validate all inputs
- Use environment variables for addresses
- Implement rate limiting
- Monitor for suspicious activity
- Keep dependencies updated

## Common Issues

### Issue: "Session Expired"
**Solution**: Reduce challenge duration or prompt users faster

### Issue: "Insufficient Score"
**Solution**: Lower threshold or guide users to build score

### Issue: "Transaction Failed"
**Solution**: Check gas limits and contract permissions

## Network Configurations

### Optimism Mainnet

```typescript
const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  gatewayAddress: '0x...',
  scoreEngineAddress: '0x...',
  chainId: 10
};
```

### Base Mainnet

```typescript
const config = {
  rpcUrl: 'https://mainnet.base.org',
  gatewayAddress: '0x...',
  scoreEngineAddress: '0x...',
  chainId: 8453
};
```

## Support

- Documentation: [docs/](.)
- GitHub Issues: [github.com/RiftBeacon/issues](https://github.com)
- Discord: Coming soon

## Examples Repository

Find complete examples at: [github.com/RiftBeacon/examples](https://github.com)

