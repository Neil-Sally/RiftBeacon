const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LivenessGateway", function () {
  let livenessGateway;
  let attestationRegistry;
  let nullifierSet;
  let scoreEngine;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy dependencies
    const NullifierSet = await ethers.getContractFactory("NullifierSet");
    nullifierSet = await NullifierSet.deploy();
    await nullifierSet.waitForDeployment();

    const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
    attestationRegistry = await AttestationRegistry.deploy();
    await attestationRegistry.waitForDeployment();

    const ScoreEngine = await ethers.getContractFactory("ScoreEngine");
    scoreEngine = await ScoreEngine.deploy();
    await scoreEngine.waitForDeployment();

    // Deploy LivenessGateway
    const LivenessGateway = await ethers.getContractFactory("LivenessGateway");
    livenessGateway = await LivenessGateway.deploy(
      await attestationRegistry.getAddress(),
      await nullifierSet.getAddress(),
      await scoreEngine.getAddress()
    );
    await livenessGateway.waitForDeployment();

    // Setup roles
    const REGISTRAR_ROLE = await attestationRegistry.REGISTRAR_ROLE();
    const CONSUMER_ROLE = await nullifierSet.CONSUMER_ROLE();
    const SCORER_ROLE = await scoreEngine.SCORER_ROLE();

    await attestationRegistry.grantRole(REGISTRAR_ROLE, await livenessGateway.getAddress());
    await nullifierSet.grantRole(CONSUMER_ROLE, await livenessGateway.getAddress());
    await scoreEngine.grantRole(SCORER_ROLE, await livenessGateway.getAddress());
  });

  describe("Challenge Creation", function () {
    it("Should create a challenge successfully", async function () {
      const challengeHash = ethers.keccak256(ethers.toUtf8Bytes("test-challenge"));
      const duration = 300; // 5 minutes

      const tx = await livenessGateway.connect(user1).startChallenge(challengeHash, duration);
      await expect(tx).to.emit(livenessGateway, "ChallengeIssued");

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = livenessGateway.interface.parseLog(log);
          return parsed?.name === "ChallengeIssued";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
    });

    it("Should reject invalid duration", async function () {
      const challengeHash = ethers.keccak256(ethers.toUtf8Bytes("test-challenge"));
      const invalidDuration = 10; // Too short

      await expect(
        livenessGateway.connect(user1).startChallenge(challengeHash, invalidDuration)
      ).to.be.reverted;
    });
  });

  describe("Response Submission", function () {
    let sessionId, challengeHash;

    beforeEach(async function () {
      challengeHash = ethers.keccak256(ethers.toUtf8Bytes("test-challenge"));
      const duration = 300;

      const tx = await livenessGateway.connect(user1).startChallenge(challengeHash, duration);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          const parsed = livenessGateway.interface.parseLog(log);
          return parsed?.name === "ChallengeIssued";
        } catch {
          return false;
        }
      });

      const parsed = livenessGateway.interface.parseLog(event);
      sessionId = parsed.args[0];
    });

    it("Should submit response successfully", async function () {
      const attestation = ethers.toUtf8Bytes("test-attestation");
      const entropyHash = ethers.keccak256(ethers.toUtf8Bytes("test-entropy"));

      const tx = await livenessGateway.connect(user1).submitResponse(
        sessionId,
        attestation,
        entropyHash
      );

      await expect(tx).to.emit(livenessGateway, "ResponseSubmitted");
    });

    it("Should reject duplicate submissions", async function () {
      const attestation = ethers.toUtf8Bytes("test-attestation");
      const entropyHash = ethers.keccak256(ethers.toUtf8Bytes("test-entropy"));

      await livenessGateway.connect(user1).submitResponse(
        sessionId,
        attestation,
        entropyHash
      );

      await expect(
        livenessGateway.connect(user1).submitResponse(
          sessionId,
          attestation,
          entropyHash
        )
      ).to.be.reverted;
    });

    it("Should reject submission from wrong user", async function () {
      const attestation = ethers.toUtf8Bytes("test-attestation");
      const entropyHash = ethers.keccak256(ethers.toUtf8Bytes("test-entropy"));

      await expect(
        livenessGateway.connect(user2).submitResponse(
          sessionId,
          attestation,
          entropyHash
        )
      ).to.be.reverted;
    });
  });

  describe("Session Management", function () {
    it("Should check if session is active", async function () {
      const challengeHash = ethers.keccak256(ethers.toUtf8Bytes("test-challenge"));
      const duration = 300;

      const tx = await livenessGateway.connect(user1).startChallenge(challengeHash, duration);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          const parsed = livenessGateway.interface.parseLog(log);
          return parsed?.name === "ChallengeIssued";
        } catch {
          return false;
        }
      });

      const parsed = livenessGateway.interface.parseLog(event);
      const sessionId = parsed.args[0];

      const isActive = await livenessGateway.isSessionActive(sessionId);
      expect(isActive).to.be.true;
    });
  });
});

