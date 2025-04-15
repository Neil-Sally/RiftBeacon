const hre = require("hardhat");

async function main() {
  console.log("Setting up contract roles...");

  const addresses = {
    gateway: process.env.LIVENESS_GATEWAY_ADDRESS,
    attestation: process.env.ATTESTATION_REGISTRY_ADDRESS,
    nullifier: process.env.NULLIFIER_SET_ADDRESS,
    score: process.env.SCORE_ENGINE_ADDRESS,
    penalty: process.env.PENALTY_MODULE_ADDRESS,
  };

  // Get contract instances
  const attestationRegistry = await ethers.getContractAt(
    "AttestationRegistry",
    addresses.attestation
  );
  const nullifierSet = await ethers.getContractAt(
    "NullifierSet",
    addresses.nullifier
  );
  const scoreEngine = await ethers.getContractAt(
    "ScoreEngine",
    addresses.score
  );

  // Grant roles
  const REGISTRAR_ROLE = await attestationRegistry.REGISTRAR_ROLE();
  const CONSUMER_ROLE = await nullifierSet.CONSUMER_ROLE();
  const SCORER_ROLE = await scoreEngine.SCORER_ROLE();

  console.log("Granting REGISTRAR_ROLE...");
  await attestationRegistry.grantRole(REGISTRAR_ROLE, addresses.gateway);

  console.log("Granting CONSUMER_ROLE...");
  await nullifierSet.grantRole(CONSUMER_ROLE, addresses.gateway);

  console.log("Granting SCORER_ROLE to Gateway...");
  await scoreEngine.grantRole(SCORER_ROLE, addresses.gateway);

  console.log("Granting SCORER_ROLE to PenaltyModule...");
  await scoreEngine.grantRole(SCORER_ROLE, addresses.penalty);

  console.log("Roles setup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

