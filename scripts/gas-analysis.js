const hre = require("hardhat");

async function main() {
  console.log("Running gas analysis...\n");

  const contracts = [
    "NullifierSet",
    "AttestationRegistry",
    "ScoreEngine",
    "LivenessGateway",
    "PenaltyModule"
  ];

  for (const contractName of contracts) {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.deploy();
    
    const deployTx = contract.deploymentTransaction();
    const receipt = await deployTx.wait();
    
    console.log(`${contractName}:`);
    console.log(`  Deployment gas: ${receipt.gasUsed.toString()}`);
    console.log(`  Address: ${await contract.getAddress()}\n`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

