const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZKVerifier", function () {
  let zkVerifier;
  let owner, prover1, prover2;

  beforeEach(async function () {
    [owner, prover1, prover2] = await ethers.getSigners();

    const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
    zkVerifier = await ZKVerifier.deploy();
    await zkVerifier.waitForDeployment();
  });

  describe("Commitment Registration", function () {
    it("Should register commitment successfully", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("commitment-1"));

      await expect(zkVerifier.connect(prover1).registerCommitment(commitment))
        .to.emit(zkVerifier, "CommitmentRegistered")
        .withArgs(commitment, prover1.address);
    });

    it("Should reject duplicate commitment", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("commitment-1"));

      await zkVerifier.connect(prover1).registerCommitment(commitment);

      await expect(
        zkVerifier.connect(prover2).registerCommitment(commitment)
      ).to.be.reverted;
    });
  });

  describe("Proof Verification", function () {
    it("Should verify valid proof", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("commitment"));
      const challenge = ethers.keccak256(ethers.toUtf8Bytes("challenge"));
      const publicInputs = [ethers.keccak256(ethers.toUtf8Bytes("input1"))];
      
      const response = ethers.keccak256(
        ethers.solidityPacked(
          ["bytes32", "bytes32", "bytes32[]"],
          [commitment, challenge, publicInputs]
        )
      );

      const proof = {
        commitment,
        response,
        challenge
      };

      await expect(zkVerifier.verifyProof(proof, publicInputs))
        .to.emit(zkVerifier, "ProofVerified");
    });

    it("Should reject invalid proof", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("commitment"));
      const challenge = ethers.keccak256(ethers.toUtf8Bytes("challenge"));
      const response = ethers.keccak256(ethers.toUtf8Bytes("wrong-response"));
      const publicInputs = [ethers.keccak256(ethers.toUtf8Bytes("input1"))];

      const proof = {
        commitment,
        response,
        challenge
      };

      await expect(zkVerifier.verifyProof(proof, publicInputs)).to.be.reverted;
    });

    it("Should reject duplicate proof verification", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("commitment"));
      const challenge = ethers.keccak256(ethers.toUtf8Bytes("challenge"));
      const publicInputs = [ethers.keccak256(ethers.toUtf8Bytes("input1"))];
      
      const response = ethers.keccak256(
        ethers.solidityPacked(
          ["bytes32", "bytes32", "bytes32[]"],
          [commitment, challenge, publicInputs]
        )
      );

      const proof = {
        commitment,
        response,
        challenge
      };

      await zkVerifier.verifyProof(proof, publicInputs);

      await expect(zkVerifier.verifyProof(proof, publicInputs)).to.be.reverted;
    });
  });
});

