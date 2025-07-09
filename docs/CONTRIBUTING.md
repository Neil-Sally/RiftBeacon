# Contributing to RiftBeacon

Thank you for your interest in contributing to RiftBeacon! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with a clear title and description
3. Include steps to reproduce the bug
4. Provide relevant logs and error messages

### Suggesting Enhancements

1. Check existing issues and discussions
2. Create a new issue with detailed proposal
3. Explain the use case and benefits
4. Be open to feedback and discussion

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

```bash
# Clone repository
git clone https://github.com/Neil-Sally/RiftBeacon.git
cd RiftBeacon

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run coverage
npx hardhat coverage
```

## Coding Standards

### Solidity

- Use Solidity 0.8.20
- Follow OpenZeppelin style guide
- Add comprehensive NatSpec comments
- Write unit tests for all functions
- Optimize for gas efficiency

### TypeScript/JavaScript

- Use TypeScript where possible
- Follow ESLint configuration
- Write JSDoc comments
- Include type definitions

### Testing

- Aim for >90% code coverage
- Test edge cases and error conditions
- Use descriptive test names
- Group related tests

### Documentation

- Update README for user-facing changes
- Add JSDoc/NatSpec for all public APIs
- Include code examples
- Keep documentation up-to-date

## Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `chore:` Maintenance tasks
- `ci:` CI/CD changes

## Review Process

1. Maintainers will review your PR
2. Address feedback and comments
3. Maintain discussion civility
4. Be patient during review

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

