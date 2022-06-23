const fs = require("fs");
// const metadata_hashs = require("../resources/metadata_hash.json");

const saveFiles = async (fileName, data) => {
    const fs = require("fs");
    const contractsDir = "./build/";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(contractsDir + fileName, data);
    console.log("export file", fileName);
};

const saveAbis = async () => {
    const ERC20ABI = artifacts.readArtifactSync("ERC20").abi;
    const NFTABI = artifacts.readArtifactSync("NFT").abi;
    const MarketplaceABI = artifacts.readArtifactSync("Marketplace").abi;
    await saveFiles(
        "abis.json",
        JSON.stringify(
            {
                ERC20: ERC20ABI,
                NFT: NFTABI,
                Marketplace: MarketplaceABI,
            },
            undefined,
            4
        )
    );
};

async function main() {
    saveAbis();
    // ERC20
    const ERC20Token_ = await ethers.getContractFactory("Token");
    const ERC20Token = await ERC20Token_.deploy(1e9);
    //NFT
    const NFT_1 = await hre.ethers.getContractFactory("NFT");
    const NFT1 = await NFT_1.deploy("test1 NFT", "t1NFT");
    await NFT1.deployed();

    // for (var i = 0; i < 5; i++) {
    //     await NFT1.create(metadata_hashs[i]);
    // }

    const NFT_2 = await hre.ethers.getContractFactory("NFT");
    const NFT2 = await NFT_2.deploy("test2 NFT", "t2NFT");
    await NFT2.deployed();

    // for (var i = 2; i < 4; i++) {
    //     await NFT2.create(metadata_hashs[i]);
    // }

    const NFT_3 = await hre.ethers.getContractFactory("NFT");
    const NFT3 = await NFT_3.deploy("test3 NFT", "t3NFT");
    await NFT3.deployed();

    // for (var i = 1; i < 5; i++) {
    //     await NFT3.create(metadata_hashs[i]);
    // }

    //marketplace
    const Marketplace_ = await hre.ethers.getContractFactory("Marketplace");
    const Marketplace = await Marketplace_.deploy(ERC20Token.address);
    await Marketplace.deployed();

    const addresses = {
        ERC20: ERC20Token.address,
        NFT: {
            NFT1: NFT1.address,
            NFT2: NFT2.address,
            NFT3: NFT3.address,
        },
        Marketplace: Marketplace.address,
    };
    await saveFiles("addresses.json", JSON.stringify(addresses, undefined, 4));
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
