# Troubleshooting Guide

## Common Issues

### Installation Problems

**Issue:** `npm install` fails

**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Compilation Errors

**Issue:** Solidity compilation fails

**Solution:**
- Check Solidity version compatibility
- Ensure all dependencies are installed
- Run `npx hardhat clean` then `npx hardhat compile`

### Test Failures

**Issue:** Tests are failing

**Solution:**
- Ensure contracts are compiled
- Check if you're on the correct network
- Review test output for specific errors

### Deployment Issues

**Issue:** Deployment transaction fails

**Solution:**
- Check sufficient ETH balance for gas
- Verify RPC URL is correct
- Increase gas limit if needed

### SDK Problems

**Issue:** SDK connection fails

**Solution:**
- Verify provider URL
- Check contract addresses are correct
- Ensure wallet has signing permissions

## Getting Help

If issues persist:
1. Check existing GitHub issues
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

