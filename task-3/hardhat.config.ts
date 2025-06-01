import type { HardhatUserConfig } from "hardhat/config";
import  "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: PRIVATE_KEY ? ['0x' + PRIVATE_KEY] : [],
    }
  }
};

export default config;
