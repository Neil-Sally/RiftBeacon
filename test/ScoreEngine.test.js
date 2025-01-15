const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScoreEngine", function () {
  let scoreEngine;
  let owner, scorer, user1, user2;

  beforeEach(async function () {
    [owner, scorer, user1, user2] = await ethers.getSigners();

    const ScoreEngine = await ethers.getContractFactory("ScoreEngine");
    scoreEngine = await ScoreEngine.deploy();
    await scoreEngine.waitForDeployment();

    const SCORER_ROLE = await scoreEngine.SCORER_ROLE();
    await scoreEngine.grantRole(SCORER_ROLE, scorer.address);
  });

  describe("Score Updates", function () {
    it("Should initialize score for new user", async function () {
      const initialScore = 100;
      await scoreEngine.connect(scorer).initializeScore(user1.address, initialScore);

      const score = await scoreEngine.getLivenessScore(user1.address);
      expect(score).to.equal(initialScore);
    });

    it("Should update score positively", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 100);
      await scoreEngine.connect(scorer).updateScore(user1.address, 50);

      const score = await scoreEngine.getLivenessScore(user1.address);
      expect(score).to.equal(150);
    });

    it("Should update score negatively", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 100);
      await scoreEngine.connect(scorer).updateScore(user1.address, -30);

      const score = await scoreEngine.getLivenessScore(user1.address);
      expect(score).to.equal(70);
    });

    it("Should cap score at MAX_SCORE", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 9900);
      await scoreEngine.connect(scorer).updateScore(user1.address, 500);

      const score = await scoreEngine.getLivenessScore(user1.address);
      const MAX_SCORE = await scoreEngine.MAX_SCORE();
      expect(score).to.equal(MAX_SCORE);
    });

    it("Should not allow score below zero", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 50);
      await scoreEngine.connect(scorer).updateScore(user1.address, -100);

      const score = await scoreEngine.getLivenessScore(user1.address);
      expect(score).to.equal(0);
    });

    it("Should reject updates from non-scorer", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 100);

      await expect(
        scoreEngine.connect(user2).updateScore(user1.address, 50)
      ).to.be.reverted;
    });
  });

  describe("Score Decay", function () {
    it("Should apply decay correctly", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 1000);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [86400]); // 1 day
      await ethers.provider.send("evm_mine");

      await scoreEngine.applyDecay(user1.address);

      const score = await scoreEngine.getLivenessScore(user1.address);
      expect(score).to.be.lt(1000);
    });

    it("Should not decay if insufficient time passed", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 1000);

      await scoreEngine.applyDecay(user1.address);

      const score = await scoreEngine.getLivenessScore(user1.address);
      expect(score).to.equal(1000);
    });
  });

  describe("Activity Tracking", function () {
    it("Should track last activity time", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 100);

      const lastActivity = await scoreEngine.getLastActivity(user1.address);
      expect(lastActivity).to.be.gt(0);
    });

    it("Should update last activity on score change", async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 100);
      const firstActivity = await scoreEngine.getLastActivity(user1.address);

      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");

      await scoreEngine.connect(scorer).updateScore(user1.address, 50);
      const secondActivity = await scoreEngine.getLastActivity(user1.address);

      expect(secondActivity).to.be.gt(firstActivity);
    });
  });
});

