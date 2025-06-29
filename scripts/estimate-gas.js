const hre = require("hardhat");

async function main() {
  console.log("Estimating gas costs...\n");

  const [signer] = await ethers.getSigners();
  
  // Deploy test contract
  const ScoreEngine = await ethers.getContractFactory("ScoreEngine");
  const scoreEngine = await ScoreEngine.deploy();
  await scoreEngine.waitForDeployment();

  console.log("ScoreEngine deployed\n");
  console.log("Operation Gas Estimates:");
  console.log("========================\n");

  // Estimate initializeScore
  try {
    const tx1 = await scoreEngine.initializeScore.populateTransaction(signer.address, 100);
    const gas1 = await ethers.provider.estimateGas(tx1);
    console.log(`initializeScore: ${gas1.toString()} gas`);
  } catch (e) {
    console.log("initializeScore: N/A (requires role)");
  }

  // Estimate updateScore
  try {
    const tx2 = await scoreEngine.updateScore.populateTransaction(signer.address, 50);
    const gas2 = await ethers.provider.estimateGas(tx2);
    console.log(`updateScore: ${gas2.toString()} gas`);
  } catch (e) {
    console.log("updateScore: N/A (requires role)");
  }

  console.log("\n✓ Gas estimation complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

