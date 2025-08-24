const hre = require("hardhat");

/**
 * Interactive script for testing deployed contracts
 */
async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Interacting with contracts using account:", signer.address);

  // Contract addresses (replace with deployed addresses)
  const GATEWAY_ADDRESS = process.env.LIVENESS_GATEWAY_ADDRESS || "";
  const SCORE_ENGINE_ADDRESS = process.env.SCORE_ENGINE_ADDRESS || "";

  if (!GATEWAY_ADDRESS || !SCORE_ENGINE_ADDRESS) {
    console.error("Please set contract addresses in environment variables");
    process.exit(1);
  }

  // Get contract instances
  const gateway = await ethers.getContractAt("LivenessGateway", GATEWAY_ADDRESS);
  const scoreEngine = await ethers.getContractAt("ScoreEngine", SCORE_ENGINE_ADDRESS);

  // Create a challenge
  console.log("\n1. Creating challenge...");
  const challengeHash = ethers.keccak256(ethers.toUtf8Bytes("test-challenge-" + Date.now()));
  const duration = 300; // 5 minutes

  const tx = await gateway.startChallenge(challengeHash, duration);
  const receipt = await tx.wait();
  
  console.log("Challenge created! Transaction:", receipt.hash);

  // Get session info
  const challengeEvent = receipt.logs.find(log => {
    try {
      const parsed = gateway.interface.parseLog(log);
      return parsed?.name === "ChallengeIssued";
    } catch {
      return false;
    }
  });

  if (challengeEvent) {
    const parsed = gateway.interface.parseLog(challengeEvent);
    const sessionId = parsed.args[0];
    console.log("Session ID:", sessionId);

    // Check if session is active
    console.log("\n2. Checking session status...");
    const isActive = await gateway.isSessionActive(sessionId);
    console.log("Session active:", isActive);

    // Get session details
    const session = await gateway.getSession(sessionId);
    console.log("Session details:", {
      user: session.user,
      timestamp: session.timestamp.toString(),
      expiresAt: session.expiresAt.toString(),
      completed: session.completed
    });
  }

  // Check liveness score
  console.log("\n3. Checking liveness score...");
  const score = await scoreEngine.getLivenessScore(signer.address);
  console.log("Current liveness score:", score.toString());

  // Get last activity
  const lastActivity = await scoreEngine.getLastActivity(signer.address);
  console.log("Last activity:", lastActivity.toString());

  console.log("\nInteraction complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

