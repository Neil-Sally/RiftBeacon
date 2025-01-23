const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NullifierSet", function () {
  let nullifierSet;
  let owner, consumer, user1;

  beforeEach(async function () {
    [owner, consumer, user1] = await ethers.getSigners();

    const NullifierSet = await ethers.getContractFactory("NullifierSet");
    nullifierSet = await NullifierSet.deploy();
    await nullifierSet.waitForDeployment();

    const CONSUMER_ROLE = await nullifierSet.CONSUMER_ROLE();
    await nullifierSet.grantRole(CONSUMER_ROLE, consumer.address);
  });

  describe("Nullifier Consumption", function () {
    it("Should consume a nullifier successfully", async function () {
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("test-nullifier"));

      await expect(
        nullifierSet.connect(consumer).consumeNullifier(nullifier)
      ).to.emit(nullifierSet, "NullifierConsumed")
        .withArgs(nullifier, consumer.address);

      const isUsed = await nullifierSet.isNullifierUsed(nullifier);
      expect(isUsed).to.be.true;
    });

    it("Should reject duplicate nullifier", async function () {
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("test-nullifier"));

      await nullifierSet.connect(consumer).consumeNullifier(nullifier);

      await expect(
        nullifierSet.connect(consumer).consumeNullifier(nullifier)
      ).to.be.reverted;
    });

    it("Should reject zero nullifier", async function () {
      const zeroNullifier = ethers.ZeroHash;

      await expect(
        nullifierSet.connect(consumer).consumeNullifier(zeroNullifier)
      ).to.be.reverted;
    });

    it("Should reject consumption from non-consumer", async function () {
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("test-nullifier"));

      await expect(
        nullifierSet.connect(user1).consumeNullifier(nullifier)
      ).to.be.reverted;
    });
  });

  describe("Nullifier Queries", function () {
    it("Should return false for unused nullifier", async function () {
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("unused-nullifier"));

      const isUsed = await nullifierSet.isNullifierUsed(nullifier);
      expect(isUsed).to.be.false;
    });

    it("Should track nullifier consumer", async function () {
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("test-nullifier"));

      await nullifierSet.connect(consumer).consumeNullifier(nullifier);

      const consumerAddress = await nullifierSet.getNullifierConsumer(nullifier);
      expect(consumerAddress).to.equal(consumer.address);
    });

    it("Should return zero address for unconsumed nullifier", async function () {
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("unused-nullifier"));

      const consumerAddress = await nullifierSet.getNullifierConsumer(nullifier);
      expect(consumerAddress).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Multiple Nullifiers", function () {
    it("Should handle multiple different nullifiers", async function () {
      const nullifier1 = ethers.keccak256(ethers.toUtf8Bytes("nullifier-1"));
      const nullifier2 = ethers.keccak256(ethers.toUtf8Bytes("nullifier-2"));
      const nullifier3 = ethers.keccak256(ethers.toUtf8Bytes("nullifier-3"));

      await nullifierSet.connect(consumer).consumeNullifier(nullifier1);
      await nullifierSet.connect(consumer).consumeNullifier(nullifier2);
      await nullifierSet.connect(consumer).consumeNullifier(nullifier3);

      expect(await nullifierSet.isNullifierUsed(nullifier1)).to.be.true;
      expect(await nullifierSet.isNullifierUsed(nullifier2)).to.be.true;
      expect(await nullifierSet.isNullifierUsed(nullifier3)).to.be.true;
    });
  });
});

