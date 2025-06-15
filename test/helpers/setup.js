const { ethers } = require("hardhat");

async function deployFullSystem() {
  const [deployer] = await ethers.getSigners();

  // Deploy dependencies
  const NullifierSet = await ethers.getContractFactory("NullifierSet");
  const nullifierSet = await NullifierSet.deploy();
  await nullifierSet.waitForDeployment();

  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await AttestationRegistry.deploy();
  await attestationRegistry.waitForDeployment();

  const ScoreEngine = await ethers.getContractFactory("ScoreEngine");
  const scoreEngine = await ScoreEngine.deploy();
  await scoreEngine.waitForDeployment();

  const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
  const zkVerifier = await ZKVerifier.deploy();
  await zkVerifier.waitForDeployment();

  // Deploy main contracts
  const LivenessGateway = await ethers.getContractFactory("LivenessGateway");
  const livenessGateway = await LivenessGateway.deploy(
    await attestationRegistry.getAddress(),
    await nullifierSet.getAddress(),
    await scoreEngine.getAddress()
  );
  await livenessGateway.waitForDeployment();

  const PenaltyModule = await ethers.getContractFactory("PenaltyModule");
  const penaltyModule = await PenaltyModule.deploy(
    await scoreEngine.getAddress()
  );
  await penaltyModule.waitForDeployment();

  // Setup roles
  const REGISTRAR_ROLE = await attestationRegistry.REGISTRAR_ROLE();
  const CONSUMER_ROLE = await nullifierSet.CONSUMER_ROLE();
  const SCORER_ROLE = await scoreEngine.SCORER_ROLE();

  await attestationRegistry.grantRole(REGISTRAR_ROLE, await livenessGateway.getAddress());
  await nullifierSet.grantRole(CONSUMER_ROLE, await livenessGateway.getAddress());
  await scoreEngine.grantRole(SCORER_ROLE, await livenessGateway.getAddress());
  await scoreEngine.grantRole(SCORER_ROLE, await penaltyModule.getAddress());

  return {
    nullifierSet,
    attestationRegistry,
    scoreEngine,
    zkVerifier,
    livenessGateway,
    penaltyModule,
    deployer
  };
}

async function createChallenge(livenessGateway, signer) {
  const challengeHash = ethers.keccak256(ethers.toUtf8Bytes(`challenge-${Date.now()}`));
  const duration = 300;

  const tx = await livenessGateway.connect(signer).startChallenge(challengeHash, duration);
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
  return parsed.args[0]; // sessionId
}

module.exports = {
  deployFullSystem,
  createChallenge
};

