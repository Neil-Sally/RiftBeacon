const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AttestationRegistry", function () {
  let attestationRegistry;
  let owner, registrar, user1;

  beforeEach(async function () {
    [owner, registrar, user1] = await ethers.getSigners();

    const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
    attestationRegistry = await AttestationRegistry.deploy();
    await attestationRegistry.waitForDeployment();

    const REGISTRAR_ROLE = await attestationRegistry.REGISTRAR_ROLE();
    await attestationRegistry.grantRole(REGISTRAR_ROLE, registrar.address);
  });

  describe("Attestation Registration", function () {
    it("Should register attestation successfully", async function () {
      const sessionId = ethers.keccak256(ethers.toUtf8Bytes("session-1"));
      const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-1"));
      const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      await expect(
        attestationRegistry.connect(registrar).registerAttestation(
          sessionId,
          attestationHash,
          expiry
        )
      ).to.emit(attestationRegistry, "AttestationRegistered")
        .withArgs(sessionId, attestationHash, expiry);
    });

    it("Should reject registration with past expiry", async function () {
      const sessionId = ethers.keccak256(ethers.toUtf8Bytes("session-1"));
      const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-1"));
      const pastExpiry = Math.floor(Date.now() / 1000) - 3600;

      await expect(
        attestationRegistry.connect(registrar).registerAttestation(
          sessionId,
          attestationHash,
          pastExpiry
        )
      ).to.be.reverted;
    });

    it("Should reject registration from non-registrar", async function () {
      const sessionId = ethers.keccak256(ethers.toUtf8Bytes("session-1"));
      const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-1"));
      const expiry = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        attestationRegistry.connect(user1).registerAttestation(
          sessionId,
          attestationHash,
          expiry
        )
      ).to.be.reverted;
    });
  });

  describe("Attestation Validation", function () {
    let sessionId, attestationHash, expiry;

    beforeEach(async function () {
      sessionId = ethers.keccak256(ethers.toUtf8Bytes("session-1"));
      attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-1"));
      expiry = Math.floor(Date.now() / 1000) + 3600;

      await attestationRegistry.connect(registrar).registerAttestation(
        sessionId,
        attestationHash,
        expiry
      );
    });

    it("Should validate registered attestation", async function () {
      const isValid = await attestationRegistry.validateAttestation(attestationHash);
      expect(isValid).to.be.true;
    });

    it("Should invalidate unregistered attestation", async function () {
      const unknownHash = ethers.keccak256(ethers.toUtf8Bytes("unknown"));
      const isValid = await attestationRegistry.validateAttestation(unknownHash);
      expect(isValid).to.be.false;
    });

    it("Should invalidate revoked attestation", async function () {
      await attestationRegistry.connect(registrar).revokeAttestation(attestationHash);
      
      const isValid = await attestationRegistry.validateAttestation(attestationHash);
      expect(isValid).to.be.false;
    });

    it("Should invalidate expired attestation", async function () {
      // Fast forward time beyond expiry
      await ethers.provider.send("evm_increaseTime", [7200]); // 2 hours
      await ethers.provider.send("evm_mine");

      const isValid = await attestationRegistry.validateAttestation(attestationHash);
      expect(isValid).to.be.false;
    });
  });

  describe("Attestation Revocation", function () {
    let attestationHash;

    beforeEach(async function () {
      const sessionId = ethers.keccak256(ethers.toUtf8Bytes("session-1"));
      attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-1"));
      const expiry = Math.floor(Date.now() / 1000) + 3600;

      await attestationRegistry.connect(registrar).registerAttestation(
        sessionId,
        attestationHash,
        expiry
      );
    });

    it("Should revoke attestation successfully", async function () {
      await expect(
        attestationRegistry.connect(registrar).revokeAttestation(attestationHash)
      ).to.emit(attestationRegistry, "AttestationRevoked")
        .withArgs(attestationHash);
    });

    it("Should reject revocation of non-existent attestation", async function () {
      const unknownHash = ethers.keccak256(ethers.toUtf8Bytes("unknown"));

      await expect(
        attestationRegistry.connect(registrar).revokeAttestation(unknownHash)
      ).to.be.reverted;
    });

    it("Should reject revocation from non-registrar", async function () {
      await expect(
        attestationRegistry.connect(user1).revokeAttestation(attestationHash)
      ).to.be.reverted;
    });
  });

  describe("Attestation Details", function () {
    it("Should retrieve full attestation details", async function () {
      const sessionId = ethers.keccak256(ethers.toUtf8Bytes("session-1"));
      const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-1"));
      const expiry = Math.floor(Date.now() / 1000) + 3600;

      await attestationRegistry.connect(registrar).registerAttestation(
        sessionId,
        attestationHash,
        expiry
      );

      const attestation = await attestationRegistry.getAttestation(attestationHash);
      
      expect(attestation.sessionId).to.equal(sessionId);
      expect(attestation.expiresAt).to.equal(expiry);
      expect(attestation.revoked).to.be.false;
      expect(attestation.registeredAt).to.be.gt(0);
    });
  });
});

