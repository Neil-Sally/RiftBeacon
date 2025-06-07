const hre = require("hardhat");

async function main() {
  console.log("Verifying contracts on block explorer...");

  const contracts = [
    {
      name: "NullifierSet",
      address: process.env.NULLIFIER_SET_ADDRESS,
      args: []
    },
    {
      name: "AttestationRegistry",
      address: process.env.ATTESTATION_REGISTRY_ADDRESS,
      args: []
    },
    {
      name: "ScoreEngine",
      address: process.env.SCORE_ENGINE_ADDRESS,
      args: []
    },
    {
      name: "ZKVerifier",
      address: process.env.ZK_VERIFIER_ADDRESS,
      args: []
    },
    {
      name: "LivenessGateway",
      address: process.env.LIVENESS_GATEWAY_ADDRESS,
      args: [
        process.env.ATTESTATION_REGISTRY_ADDRESS,
        process.env.NULLIFIER_SET_ADDRESS,
        process.env.SCORE_ENGINE_ADDRESS
      ]
    },
    {
      name: "PenaltyModule",
      address: process.env.PENALTY_MODULE_ADDRESS,
      args: [process.env.SCORE_ENGINE_ADDRESS]
    }
  ];

  for (const contract of contracts) {
    if (!contract.address) {
      console.log(`Skipping ${contract.name}: Address not provided`);
      continue;
    }

    try {
      console.log(`Verifying ${contract.name} at ${contract.address}...`);
      
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.args
      });
      
      console.log(`✓ ${contract.name} verified successfully`);
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`✓ ${contract.name} already verified`);
      } else {
        console.error(`✗ Error verifying ${contract.name}:`, error.message);
      }
    }
  }

  console.log("\nVerification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

