# Deployment Guide

## Prerequisites

- Node.js 18+
- Hardhat
- Sufficient ETH for gas fees on target network

## Environment Setup

Create `.env` file:

```bash
PRIVATE_KEY=your_private_key_here
OPTIMISM_RPC_URL=https://mainnet.optimism.io
BASE_RPC_URL=https://mainnet.base.org
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Deployment Steps

### 1. Compile Contracts

```bash
npx hardhat compile
```

### 2. Deploy to Testnet

```bash
npx hardhat run scripts/deploy.js --network optimism-goerli
```

### 3. Verify Contracts

```bash
npx hardhat run scripts/verify.js --network optimism-goerli
```

## Contract Deployment Order

1. NullifierSet
2. AttestationRegistry
3. ScoreEngine
4. ZKVerifier
5. LivenessGateway (requires addresses from 1-3)
6. PenaltyModule (requires ScoreEngine address)

## Post-Deployment

### Setup Roles

The deployment script automatically configures:
- REGISTRAR_ROLE for AttestationRegistry
- CONSUMER_ROLE for NullifierSet
- SCORER_ROLE for ScoreEngine

### Test Deployment

```bash
npx hardhat run scripts/interact.js --network optimism-goerli
```

## Mainnet Deployment Checklist

- [ ] All tests passing
- [ ] Code audited
- [ ] Testnet deployment successful
- [ ] Role configuration verified
- [ ] Contract verification complete
- [ ] Multisig setup for admin functions
- [ ] Emergency procedures documented
- [ ] Monitoring infrastructure ready

## Network Configurations

### Optimism Mainnet

```javascript
optimism: {
  url: process.env.OPTIMISM_RPC_URL,
  chainId: 10,
  accounts: [process.env.PRIVATE_KEY]
}
```

### Base Mainnet

```javascript
base: {
  url: process.env.BASE_RPC_URL,
  chainId: 8453,
  accounts: [process.env.PRIVATE_KEY]
}
```

## Troubleshooting

### Gas Estimation Failed

Increase gas limit in hardhat.config.js

### Verification Failed

Ensure correct constructor arguments and API key

### Role Grant Failed

Check deployer has admin permissions

