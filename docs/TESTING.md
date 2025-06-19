# Testing Guide

## Running Tests

### All Tests
```bash
npx hardhat test
```

### Specific Test File
```bash
npx hardhat test test/LivenessGateway.test.js
```

### With Coverage
```bash
npx hardhat coverage
```

### With Gas Reporting
```bash
REPORT_GAS=true npx hardhat test
```

## Test Structure

### Unit Tests
- Located in `test/*.test.js`
- Test individual contract functions
- Mock dependencies where needed

### Integration Tests
- Located in `test/integration/`
- Test complete workflows
- Use full contract deployment

### Test Helpers
- Located in `test/helpers/`
- Setup functions for deployment
- Common test utilities

## Writing Tests

### Example Test
```javascript
describe("MyContract", function () {
  let contract;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("MyContract");
    contract = await Contract.deploy();
  });

  it("Should do something", async function () {
    expect(await contract.doSomething()).to.equal(expectedValue);
  });
});
```

## Best Practices

1. Test all happy paths
2. Test all error cases
3. Test edge cases
4. Use descriptive test names
5. Keep tests independent
6. Clean up after tests
7. Mock external dependencies

## Coverage Goals

- Target: > 90% coverage
- Critical paths: 100% coverage
- Security-sensitive code: 100% coverage

