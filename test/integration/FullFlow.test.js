const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFullSystem, createChallenge } = require("../helpers/setup");

describe("Full Integration Flow", function () {
  let system, user1;

  beforeEach(async function () {
    [, user1] = await ethers.getSigners();
    system = await deployFullSystem();
  });

  it("Should complete full liveness proof flow", async function () {
    // Initialize user score
    await system.scoreEngine.initializeScore(user1.address, 100);

    // Create challenge
    const sessionId = await createChallenge(system.livenessGateway, user1);
    
    // Verify session is active
    const isActive = await system.livenessGateway.isSessionActive(sessionId);
    expect(isActive).to.be.true;

    // Submit response
    const attestation = ethers.toUtf8Bytes("test-attestation");
    const entropyHash = ethers.keccak256(ethers.toUtf8Bytes("test-entropy"));

    await system.livenessGateway.connect(user1).submitResponse(
      sessionId,
      attestation,
      entropyHash
    );

    // Check updated score
    const score = await system.scoreEngine.getLivenessScore(user1.address);
    expect(score).to.be.gt(100);
  });
});

