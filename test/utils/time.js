const { ethers } = require("hardhat");

/**
 * Time manipulation utilities for testing
 */

async function increaseTime(seconds) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine");
}

async function setNextBlockTimestamp(timestamp) {
  await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
  await ethers.provider.send("evm_mine");
}

async function getCurrentTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

async function mineBlocks(count) {
  for (let i = 0; i < count; i++) {
    await ethers.provider.send("evm_mine");
  }
}

module.exports = {
  increaseTime,
  setNextBlockTimestamp,
  getCurrentTimestamp,
  mineBlocks
};

