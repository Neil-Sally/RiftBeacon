# Release Notes

## Version 0.1.0 - Alpha Release

**Release Date**: September 2025

### Highlights

This is the initial alpha release of RiftBeacon, a liveness-based Sybil resistance protocol.

### New Features

#### Smart Contracts
- LivenessGateway for proof submission
- AttestationRegistry for attestation management
- NullifierSet for uniqueness enforcement
- ScoreEngine with decay mechanism
- ZKVerifier for privacy-preserving proofs
- PenaltyModule for farming prevention

#### SDK
- TypeScript SDK for client integration
- Support for Optimism and Base networks
- Comprehensive type definitions
- Error handling and retries

#### Developer Tools
- Deployment scripts
- Verification scripts
- Testing utilities
- Gas analysis tools

#### Documentation
- Complete API reference
- Integration guides
- Security documentation
- Architecture overview

### Known Limitations

- Simplified ZK verification (production should use Groth16/PLONK)
- Not yet audited
- Testnet only - DO NOT use in production

### Breaking Changes

None - initial release

### Migration Guide

Not applicable - initial release

### Contributors

Special thanks to all 6 core contributors who made this release possible.

### What's Next

See [ROADMAP.md](docs/ROADMAP.md) for future plans.

### Support

- GitHub Issues: https://github.com/Neil-Sally/RiftBeacon/issues
- Documentation: [docs/](docs/)

