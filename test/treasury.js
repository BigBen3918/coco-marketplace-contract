const { expect } = require("chai");
const { ethers } = require("hardhat");
const { delay, fromBigNum, toBigNum, saveFiles, sign } = require("./utils.js");

// owner
var owner, userWallet, provider;
var treasury;

// deploy mode
const isDeploy = true;

describe("Create UserWallet", function () {
    it("Create account", async function () {
        [owner, userWallet] = await ethers.getSigners();
        provider = ethers.provider;

        console.log(owner.address, userWallet.address);
    });
});

describe("deploy contract", function () {
    it("deploy treasury", async function () {
        const Treasury = await ethers.getContractFactory("treasury");
        treasury = await Treasury.deploy();
        await treasury.deployed();
    });
});

if (!isDeploy) {
    describe("test contract", function () {
        it("fill coin", async function () {
            var tx = await owner.sendTransaction({ to: treasury.address, value: toBigNum(1) });
            await tx.wait();
        });
        it("multi coin send", async function () {
            var tos = new Array(10).fill(userWallet.address);
            var amounts = new Array(10).fill(toBigNum(0.01));
            var tx = await treasury.multiSend(tos, amounts);
            await tx.wait();

            expect(await provider.getBalance(userWallet.address)).to.equal(toBigNum(10000.1))
        });
    });
}

describe("Save contracts", function () {
    it("save abis", async function () {
        const abis = {
            treasury: artifacts.readArtifactSync("treasury").abi
        };
        await saveFiles("treasury-abis.json", JSON.stringify(abis, undefined, 4));
    });
    it("save addresses", async function () {
        const addresses = {
            treasury: treasury.address
        };
        await saveFiles(
            "treasury-addresses.json",
            JSON.stringify(addresses, undefined, 4)
        );
    });
});