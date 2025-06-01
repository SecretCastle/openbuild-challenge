const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("👷 Deploying contracts with:", deployer.address);

  // 1. Deploy MyToken
  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy(hre.ethers.parseEther("1000000"));
  await token.waitForDeployment();
  console.log("✅ MyToken deployed to:", await token.getAddress());

  // 2. Deploy MyNFT
  const NFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("✅ MyNFT deployed to:", await nft.getAddress());

  // 3. Deploy NFTMarketplace
  const Market = await hre.ethers.getContractFactory("NFTMarketplace");
  const market = await Market.deploy(await token.getAddress());
  await market.waitForDeployment();
  console.log("✅ NFTMarketplace deployed to:", await market.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
});
