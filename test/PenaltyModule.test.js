const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PenaltyModule", function () {
  let penaltyModule, scoreEngine;
  let owner, enforcer, scorer, user1, user2;

  beforeEach(async function () {
    [owner, enforcer, scorer, user1, user2] = await ethers.getSigners();

    // Deploy ScoreEngine
    const ScoreEngine = await ethers.getContractFactory("ScoreEngine");
    scoreEngine = await ScoreEngine.deploy();
    await scoreEngine.waitForDeployment();

    // Deploy PenaltyModule
    const PenaltyModule = await ethers.getContractFactory("PenaltyModule");
    penaltyModule = await PenaltyModule.deploy(await scoreEngine.getAddress());
    await penaltyModule.waitForDeployment();

    // Setup roles
    const ENFORCER_ROLE = await penaltyModule.ENFORCER_ROLE();
    const SCORER_ROLE = await scoreEngine.SCORER_ROLE();

    await penaltyModule.grantRole(ENFORCER_ROLE, enforcer.address);
    await scoreEngine.grantRole(SCORER_ROLE, scorer.address);
    await scoreEngine.grantRole(SCORER_ROLE, await penaltyModule.getAddress());
  });

  describe("Penalty Application", function () {
    beforeEach(async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 1000);
    });

    it("Should apply penalty successfully", async function () {
      await expect(
        penaltyModule.connect(enforcer).applyPenalty(
          user1.address,
          100,
          "Suspicious activity"
        )
      ).to.emit(penaltyModule, "Penalized")
        .withArgs(user1.address, 100, "Suspicious activity");

      const score = await scoreEngine.getLivenessScore(user1.address);
      expect(score).to.equal(900);
    });

    it("Should track penalty count", async function () {
      await penaltyModule.connect(enforcer).applyPenalty(
        user1.address,
        50,
        "First warning"
      );

      const penalty = await penaltyModule.getPenalty(user1.address);
      expect(penalty.count).to.equal(1);
    });

    it("Should reject zero penalty amount", async function () {
      await expect(
        penaltyModule.connect(enforcer).applyPenalty(
          user1.address,
          0,
          "Invalid"
        )
      ).to.be.reverted;
    });

    it("Should reject penalty from non-enforcer", async function () {
      await expect(
        penaltyModule.connect(user2).applyPenalty(
          user1.address,
          100,
          "Unauthorized"
        )
      ).to.be.reverted;
    });
  });

  describe("Blacklisting", function () {
    beforeEach(async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 1000);
    });

    it("Should blacklist user with low score", async function () {
      const PENALTY_THRESHOLD = await penaltyModule.PENALTY_THRESHOLD();
      
      await expect(
        penaltyModule.connect(enforcer).applyPenalty(
          user1.address,
          Number(PENALTY_THRESHOLD) + 100,
          "Score below threshold"
        )
      ).to.emit(penaltyModule, "Blacklisted");

      const isBlacklisted = await penaltyModule.isBlacklisted(user1.address);
      expect(isBlacklisted).to.be.true;
    });

    it("Should blacklist user after 3 penalties", async function () {
      await penaltyModule.connect(enforcer).applyPenalty(user1.address, 50, "First");
      await penaltyModule.connect(enforcer).applyPenalty(user1.address, 50, "Second");
      
      await expect(
        penaltyModule.connect(enforcer).applyPenalty(user1.address, 50, "Third")
      ).to.emit(penaltyModule, "Blacklisted");

      const isBlacklisted = await penaltyModule.isBlacklisted(user1.address);
      expect(isBlacklisted).to.be.true;
    });

    it("Should return false for non-blacklisted user", async function () {
      const isBlacklisted = await penaltyModule.isBlacklisted(user1.address);
      expect(isBlacklisted).to.be.false;
    });

    it("Should expire blacklist after duration", async function () {
      // Apply penalty to trigger blacklist
      const PENALTY_THRESHOLD = await penaltyModule.PENALTY_THRESHOLD();
      await penaltyModule.connect(enforcer).applyPenalty(
        user1.address,
        Number(PENALTY_THRESHOLD) + 100,
        "Blacklist trigger"
      );

      expect(await penaltyModule.isBlacklisted(user1.address)).to.be.true;

      // Fast forward beyond blacklist duration
      const BLACKLIST_DURATION = await penaltyModule.BLACKLIST_DURATION();
      await ethers.provider.send("evm_increaseTime", [Number(BLACKLIST_DURATION) + 1]);
      await ethers.provider.send("evm_mine");

      expect(await penaltyModule.isBlacklisted(user1.address)).to.be.false;
    });
  });

  describe("Blacklist Management", function () {
    beforeEach(async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 1000);
      
      // Trigger blacklist
      const PENALTY_THRESHOLD = await penaltyModule.PENALTY_THRESHOLD();
      await penaltyModule.connect(enforcer).applyPenalty(
        user1.address,
        Number(PENALTY_THRESHOLD) + 100,
        "Blacklist"
      );
    });

    it("Should allow admin to remove blacklist", async function () {
      await expect(
        penaltyModule.removeBlacklist(user1.address)
      ).to.emit(penaltyModule, "BlacklistRemoved")
        .withArgs(user1.address);

      const isBlacklisted = await penaltyModule.isBlacklisted(user1.address);
      expect(isBlacklisted).to.be.false;
    });

    it("Should reject blacklist removal from non-admin", async function () {
      await expect(
        penaltyModule.connect(user2).removeBlacklist(user1.address)
      ).to.be.reverted;
    });
  });

  describe("Penalty Details", function () {
    beforeEach(async function () {
      await scoreEngine.connect(scorer).initializeScore(user1.address, 1000);
    });

    it("Should store penalty details", async function () {
      await penaltyModule.connect(enforcer).applyPenalty(
        user1.address,
        100,
        "Test penalty"
      );

      const penalty = await penaltyModule.getPenalty(user1.address);
      
      expect(penalty.count).to.equal(1);
      expect(penalty.reason).to.equal("Test penalty");
      expect(penalty.lastPenaltyTime).to.be.gt(0);
    });

    it("Should update penalty details on multiple penalties", async function () {
      await penaltyModule.connect(enforcer).applyPenalty(user1.address, 50, "First");
      
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");
      
      await penaltyModule.connect(enforcer).applyPenalty(user1.address, 75, "Second");

      const penalty = await penaltyModule.getPenalty(user1.address);
      
      expect(penalty.count).to.equal(2);
      expect(penalty.reason).to.equal("Second");
    });
  });
});

