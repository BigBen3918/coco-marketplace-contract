const { expect } = require("chai");
const { ethers } = require("hardhat");

var ERC20Token = {};
var Marketplace = {};
var NFT = {};

describe("contract deploy", () => {
    it("ERC20Token", async () => {
        const ERC20Token_ = await hre.ethers.getContractFactory("ERC20Token");
        ERC20Token = await ERC20Token_.deploy("test token", "test", 18, 1e9);
    });

    it("NFT", async () => {
        const NFT_ = await hre.ethers.getContractFactory("NFT");
        NFT = await NFT_.deploy("test NFT", "tNFT");
        await NFT.deployed();
    });

    it("marketplace", async () => {
        const Marketplace_ = await hre.ethers.getContractFactory("Marketplace");
        Marketplace = await Marketplace_.deploy(ERC20Token.address);
        await Marketplace.deployed();
    });
})

describe("contract test", () => {
    it("NFT", async () => {
        var tx = await NFT.create("tokenURI");
        await tx.wait();

        expect(await NFT.tokenURI(0)).to.be.equal("tokenURI")
    });
})