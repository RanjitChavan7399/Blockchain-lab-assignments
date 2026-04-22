// scripts/deploy.cjs - uses require() only, no import statements
const fs   = require("fs");
const path = require("path");

async function main() {
  console.log("\nDeploying ProductTransaction to Sepolia...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address :", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance :", ethers.formatEther(balance), "ETH\n");

  if (parseFloat(ethers.formatEther(balance)) < 0.005) {
    console.error("Not enough ETH! Get Sepolia ETH from https://sepoliafaucet.com");
    process.exit(1);
  }

  const Factory  = await ethers.getContractFactory("ProductTransaction");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Contract deployed to:", address);
  console.log("Etherscan:", "https://sepolia.etherscan.io/address/" + address);

  // Auto-write address into .env
  const envPath = path.resolve(process.cwd(), ".env");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  if (envContent.includes("VITE_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(/VITE_CONTRACT_ADDRESS=.*/, "VITE_CONTRACT_ADDRESS=" + address);
  } else {
    envContent += "\nVITE_CONTRACT_ADDRESS=" + address;
  }
  fs.writeFileSync(envPath, envContent);

  console.log("\n.env updated — VITE_CONTRACT_ADDRESS =", address);
  console.log("\nNext: npm run dev");
}

main().catch((e) => { console.error(e); process.exit(1); });
