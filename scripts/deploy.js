const hre = require("hardhat");

async function main() {
  console.log("Deploying RiftBeacon contracts...");

  // Deploy NullifierSet
  const NullifierSet = await hre.ethers.getContractFactory("NullifierSet");
  const nullifierSet = await NullifierSet.deploy();
  await nullifierSet.waitForDeployment();
  console.log("NullifierSet deployed to:", await nullifierSet.getAddress());

  // Deploy AttestationRegistry
  const AttestationRegistry = await hre.ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await AttestationRegistry.deploy();
  await attestationRegistry.waitForDeployment();
  console.log("AttestationRegistry deployed to:", await attestationRegistry.getAddress());

  // Deploy ScoreEngine
  const ScoreEngine = await hre.ethers.getContractFactory("ScoreEngine");
  const scoreEngine = await ScoreEngine.deploy();
  await scoreEngine.waitForDeployment();
  console.log("ScoreEngine deployed to:", await scoreEngine.getAddress());

  // Deploy ZKVerifier
  const ZKVerifier = await hre.ethers.getContractFactory("ZKVerifier");
  const zkVerifier = await ZKVerifier.deploy();
  await zkVerifier.waitForDeployment();
  console.log("ZKVerifier deployed to:", await zkVerifier.getAddress());

  // Deploy LivenessGateway
  const LivenessGateway = await hre.ethers.getContractFactory("LivenessGateway");
  const livenessGateway = await LivenessGateway.deploy(
    await attestationRegistry.getAddress(),
    await nullifierSet.getAddress(),
    await scoreEngine.getAddress()
  );
  await livenessGateway.waitForDeployment();
  console.log("LivenessGateway deployed to:", await livenessGateway.getAddress());

  // Deploy PenaltyModule
  const PenaltyModule = await hre.ethers.getContractFactory("PenaltyModule");
  const penaltyModule = await PenaltyModule.deploy(
    await scoreEngine.getAddress()
  );
  await penaltyModule.waitForDeployment();
  console.log("PenaltyModule deployed to:", await penaltyModule.getAddress());

  // Setup roles
  console.log("\nSetting up roles...");
  
  const REGISTRAR_ROLE = await attestationRegistry.REGISTRAR_ROLE();
  const CONSUMER_ROLE = await nullifierSet.CONSUMER_ROLE();
  const SCORER_ROLE = await scoreEngine.SCORER_ROLE();

  await attestationRegistry.grantRole(REGISTRAR_ROLE, await livenessGateway.getAddress());
  console.log("Granted REGISTRAR_ROLE to LivenessGateway");

  await nullifierSet.grantRole(CONSUMER_ROLE, await livenessGateway.getAddress());
  console.log("Granted CONSUMER_ROLE to LivenessGateway");

  await scoreEngine.grantRole(SCORER_ROLE, await livenessGateway.getAddress());
  await scoreEngine.grantRole(SCORER_ROLE, await penaltyModule.getAddress());
  console.log("Granted SCORER_ROLE to LivenessGateway and PenaltyModule");

  console.log("\nDeployment complete!");
  console.log("\nContract Addresses:");
  console.log("===================");
  console.log("NullifierSet:", await nullifierSet.getAddress());
  console.log("AttestationRegistry:", await attestationRegistry.getAddress());
  console.log("ScoreEngine:", await scoreEngine.getAddress());
  console.log("ZKVerifier:", await zkVerifier.getAddress());
  console.log("LivenessGateway:", await livenessGateway.getAddress());
  console.log("PenaltyModule:", await penaltyModule.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

