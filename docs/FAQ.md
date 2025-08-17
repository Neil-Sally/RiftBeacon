# Frequently Asked Questions

## General

### What is RiftBeacon?

RiftBeacon is a liveness-based Sybil resistance protocol that verifies user presence without compromising privacy. It uses challenge-response proofs, entropy validation, and scoring mechanisms to ensure fair distribution and anti-bot protection.

### How does it differ from other Sybil resistance solutions?

Unlike identity-based solutions (ZK-identity, SBTs), RiftBeacon focuses on liveness and presence without revealing personal information, biometrics, or device fingerprints.

### What blockchains does it support?

RiftBeacon is designed for EVM-compatible chains, primarily Optimism and Base, but can be deployed on any EVM chain.

## Technical

### How does the challenge-response mechanism work?

1. User initiates a challenge with a time window (30s - 10min)
2. Device generates entropy and attestation
3. Response is submitted within the time window
4. System validates and updates liveness score

### What is a liveness score?

A numerical value (0-10,000) representing user engagement and authenticity. Higher scores indicate more active and legitimate users.

### How does score decay work?

Scores decrease by 0.1% per day of inactivity to ensure only active users maintain high scores.

### What happens if I'm blacklisted?

Blacklisting lasts 7 days and occurs after 3 penalties or when score drops below 500. Admin can remove blacklist early.

## Integration

### How do I integrate RiftBeacon?

1. Install the SDK: `npm install @riftbeacon/sdk`
2. Initialize with your provider and contract addresses
3. Use SDK methods to create challenges and verify scores

### What's the minimum score for airdrops?

This varies by application, but typical ranges are:
- Low-value: 500-1000
- Medium-value: 1000-2000
- High-value: 2000-5000

### Can I use it with existing contracts?

Yes! Import the Score Engine interface and query user scores in your smart contracts.

## Security

### Is it audited?

Not yet. Professional audit is planned before mainnet deployment. Do not use in production without thorough security review.

### How is privacy maintained?

- No personal data stored
- No biometric requirements
- No device fingerprinting
- Optional ZK proofs for unlinkability

### Can the system be gamed?

Multiple protections exist:
- Nullifier-based uniqueness
- Time-bound challenges
- Score decay
- Penalty system
- Blacklisting

## Development

### How do I run tests?

```bash
npm install
npx hardhat test
```

### How do I deploy contracts?

```bash
npx hardhat run scripts/deploy.js --network optimism
```

### Where can I find examples?

Check the `contracts/examples` and `sdk/examples` directories.

## Support

### Where can I get help?

- GitHub Issues: Report bugs and request features
- Documentation: See `docs/` directory
- Coming soon: Discord community

### How can I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Is there a bug bounty?

Not yet. Will be announced after mainnet launch.

