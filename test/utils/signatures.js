const { ethers } = require("hardhat");

/**
 * Signature utilities for testing
 */

async function signMessage(signer, message) {
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  return await signer.signMessage(ethers.getBytes(messageHash));
}

async function signTypedData(signer, domain, types, value) {
  return await signer.signTypedData(domain, types, value);
}

function splitSignature(signature) {
  return ethers.Signature.from(signature);
}

function recoverAddress(message, signature) {
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  return ethers.recoverAddress(messageHash, signature);
}

module.exports = {
  signMessage,
  signTypedData,
  splitSignature,
  recoverAddress
};

