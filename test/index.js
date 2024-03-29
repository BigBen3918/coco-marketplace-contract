const { expect } = require("chai");
const bs58 = require("bs58");
const { ethers } = require("hardhat");
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("localhost", "5001", { protocol: "http" });
const { delay, fromBigNum, toBigNum, saveFiles, sign } = require("./utils.js");
var owner;
var userWallet;

var storeFront, NFT1, NFTA;
var marketplace;

//mock
var testToken;
var wETH;
var db = {};
var tokenId;

describe("Create UserWallet", function () {
    it("Create account", async function () {
        [owner, userWallet] = await ethers.getSigners();

        console.log(owner.address, userWallet.address);
    });
});

describe("deploy contract", function () {
    it("store front contract", async function () {
        const Factory = await ethers.getContractFactory("StoreFront");
        storeFront = await Factory.deploy(
            owner.address,
            "storeFrontContract",
            "sfc"
        );
        await storeFront.deployed();
    });
    it("nft contracts", async function () {
        const Factory = await ethers.getContractFactory("NFT");
        NFT1 = await Factory.deploy("test1NFT", "t1NFT");
        await NFT1.deployed();

        const NFTA_ = await ethers.getContractFactory("NFTA");
        NFTA = await NFTA_.deploy("test1NFT", "t1NFT");
        await NFTA.deployed();
    });
    it("test token", async function () {
        const Factory = await ethers.getContractFactory("Token");
        testToken = await Factory.deploy(toBigNum("1000000000000000"));
        await testToken.deployed();
    });
    it("test weth token", async function () {
        const Factory = await ethers.getContractFactory("WETH");
        wETH = await Factory.deploy();
        await wETH.deployed();
    });
    it("marketplace contract", async function () {
        const Factory = await ethers.getContractFactory("Marketplace");
        marketplace = await Factory.deploy(wETH.address);
        await marketplace.deployed();
    });
});

// describe("store front test contract", function () {
//     it("mint nft", async function () {
//         const createNFT = async (metadata, nftAddress) => {
//             let bufferfile = Buffer.from(JSON.stringify(metadata));

//             let file = await ipfs.files.add(bufferfile);
//             const bytes = bs58.decode(file[0].hash);
//             const hex = Buffer.from(bytes).toString("hex");
//             tokenId = "0x" + hex.slice(4);
//             console.log("prefix", hex.slice(0, 4));
//             console.log("tokenId", tokenId);
//             let tokenInfo = db && db[nftAddress] && db[nftAddress][tokenId];
//             if (tokenInfo != null) throw new Error("token already minted");

//             let collection = {
//                 [tokenId]: {
//                     owner: owner.address,
//                 },
//             };
//             db[nftAddress] = collection;
//         };

//         let metadata = { name: "test1" };
//         let metadata2 = { name: "test2" };
//         await createNFT(metadata, storeFront.address);
//         await createNFT(metadata2, storeFront.address);
//     });
//     it("onsale nft", async function () {
//         const onsaleNFT = async (
//             nftAddress,
//             tokenId,
//             ownerAddress,
//             _priceInWei,
//             _expiresAt
//         ) => {
//             //backend
//             if (db[nftAddress][tokenId].owner != ownerAddress)
//                 throw new Error("invalid request");
//             let onsaleData = {
//                 tokenId,
//                 owner: ownerAddress,
//                 market: marketplace.address,
//                 _priceInWei: _priceInWei,
//                 _expiresAt: _expiresAt,
//                 signer: owner,
//             };
//             let signature = await sign(onsaleData);

//             //front end
//             console.log(fromBigNum(_priceInWei));
//             var { market, _priceInWei, _expiresAt } = onsaleData;
//             var tx = await storeFront.mintAndOnsale(
//                 tokenId,
//                 market,
//                 wETH.address,
//                 _priceInWei,
//                 _expiresAt,
//                 signature
//             );
//             await tx.wait();

//             console.log(await storeFront.ownerOf(tokenId));
//         };

//         await onsaleNFT(
//             storeFront.address,
//             tokenId,
//             owner.address,
//             toBigNum("0.1", 18),
//             toBigNum("10000000000000000000", 0)
//         );
//     });
// });

// describe("normal test contract", function () {
//     it("mint nft", async function () {
//         var tx = await NFT1.mint("test1");
//         await tx.wait();
//         tx = await NFT1.mint("test2");
//         await tx.wait();
//     })
//     it("transfer nft", async function () {
//         var tx = await NFT1.transferFrom(owner.address, marketplace.address, "1");
//         await tx.wait();
//     })
//     it("onsale nft", async function () {
//         let tx = await NFT1.approve(marketplace.address, "0");
//         await tx.wait();
//         tx = await marketplace.createOrder(NFT1.address, owner.address, "0", wETH.address, toBigNum("1"), toBigNum("10000000000000000000", 0));
//         await tx.wait();
//     })
// });
// describe("ERC721a test contract", function () {
//     it("mint nft", async function () {
//         var tx = await NFTA.mint("2", ["test1", "test2"]);
//         await tx.wait();
//     })
//     it("transfer nft", async function () {
//         var tx = await NFTA.transferFrom(owner.address, marketplace.address, "1");
//         await tx.wait();
//     })
//     it("onsale nft", async function () {
//         let tx = await NFTA.approve(marketplace.address, "0");
//         await tx.wait();
//         tx = await marketplace.createOrder(NFTA.address, owner.address, "0", wETH.address, toBigNum("1"), toBigNum("10000000000000000000", 0));
//         await tx.wait();
//     })
// });

// describe("marketplace contract test", function () {
//     // it("buy nft", async function () {
//     //     let initBalance = await ethers.provider.getBalance(owner.address);
//     //     let tx = await (marketplace.connect(userWallet)).ExecuteOrder(storeFront.address, tokenId, toBigNum("1"), { value: toBigNum("1") });
//     //     await tx.wait();
//     //     let lastBalance = await ethers.provider.getBalance(owner.address);
//     //     console.log(fromBigNum(lastBalance.sub(initBalance)));
//     // });
//     it("bid nft", async function () {
//         let tx = await marketplace.PlaceBid(storeFront.address, tokenId, toBigNum("1"), toBigNum("10000000000000000000", 0), { value: toBigNum("1") });
//         await tx.wait();
//     });
//     it("accept bid nft", async function () {
//         let initBalance = await ethers.provider.getBalance(owner.address);
//         let tx = await marketplace.acceptBid(
//             storeFront.address,
//             tokenId,
//             toBigNum("1")
//         );
//         await tx.wait();
//         let lastBalance = await ethers.provider.getBalance(owner.address);
//         console.log(fromBigNum(lastBalance.sub(initBalance)));
//     });
// });

describe("Save contracts", function () {
    it("save bytecode", async function () {
        const bytecode = {
            NFT: artifacts.readArtifactSync("NFT").bytecode,
        };

        await saveFiles(
            "bytecode.json",
            JSON.stringify(bytecode, undefined, 4)
        );
    });
    it("save abis", async function () {
        const abis = {
            NFT: artifacts.readArtifactSync("NFT").abi,
            StoreFront: artifacts.readArtifactSync("StoreFront").abi,
            Marketplace: artifacts.readArtifactSync("Marketplace").abi,
            TestToken: artifacts.readArtifactSync("ERC20").abi,
        };
        await saveFiles("abis.json", JSON.stringify(abis, undefined, 4));
    });
    it("save addresses", async function () {
        const addresses = {
            StoreFront: storeFront.address,
            NFT1: NFT1.address,
            Marketplace: marketplace.address,
            TestToken: testToken.address,
            WETH: wETH.address,
        };
        await saveFiles(
            "addresses.json",
            JSON.stringify(addresses, undefined, 4)
        );
    });
});
