import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

export default {
    solidity: "0.8.0",
    networks: {
        mumbai: {
            url: process.env.RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};