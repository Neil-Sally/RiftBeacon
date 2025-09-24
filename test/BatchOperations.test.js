const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatchOperations", function () {
  let batchOps, scoreEngine;
  let owner, operator, user1, user2, user3;

  beforeEach(async function () {
    [owner, operator, user1, user2, user3] = await ethers.getSigners();

    const ScoreEngine = await ethers.getContractFactory("ScoreEngine");
    scoreEngine = await ScoreEngine.deploy();
    await scoreEngine.waitForDeployment();

    const BatchOperations = await ethers.getContractFactory("BatchOperations");
    batchOps = await BatchOperations.deploy(await scoreEngine.getAddress());
    await batchOps.waitForDeployment();

    const OPERATOR_ROLE = await batchOps.OPERATOR_ROLE();
    const SCORER_ROLE = await scoreEngine.SCORER_ROLE();

    await batchOps.grantRole(OPERATOR_ROLE, operator.address);
    await scoreEngine.grantRole(SCORER_ROLE, await batchOps.getAddress());
  });

  it("Should batch update scores", async function () {
    const users = [user1.address, user2.address, user3.address];
    const deltas = [100, 200, 150];

    await expect(
      batchOps.connect(operator).batchUpdateScores(users, deltas)
    ).to.emit(batchOps, "BatchScoreUpdate");
  });

  it("Should reject mismatched arrays", async function () {
    const users = [user1.address, user2.address];
    const deltas = [100];

    await expect(
      batchOps.connect(operator).batchUpdateScores(users, deltas)
    ).to.be.reverted;
  });
});

