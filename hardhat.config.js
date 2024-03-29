require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
// require("./tasks");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//     const accounts = await ethers.getSigners();

//     for (const account of accounts) {
//         console.log(account.address);
//     }
// });

// task("check-price", "", async (taskArgs, hre) => {
//     const [owner] = await ethers.getSigners();
//     const Factory = await ethers.getContractFactory("Marketplace");
//     const marketplace = await Factory.attach(
//         "0x3b84A563F30e228b6E52Faf71912CB35B7BC4d47"
//     );
//     let data = await marketplace.orderByAssetId(
//         "0x8bC30e656151e2EB862b80B395A76c050527D6A5",
//         "0xa45cedbed0905b5b518466648e3834af4e86c23d92ddd57c6f31c4e7c3d7972c"
//     );
//     console.log(data);
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        ganache: {
            url: "http://127.0.0.1:7545",
        },
        fantom_test: {
            url: "https://rpc.testnet.fantom.network",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
        ethereum: {
            url: "https://main-light.eth.linkpool.io/",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
        ICICB: {
            url: "http://3.17.193.52/",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
        ICICBtestnet: {
            url: "http://13.58.153.103/",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
        bsc: {
            url: "https://bsc-dataseed1.ninicoin.io/",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
        matic: {
            url: "https://rpc-mainnet.matic.quiknode.pro",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
        fantom: {
            url: "https://rpc.ftm.tools/",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
        rinkby: {
            url: "http://85.206.160.196",
            accounts: [process.env.PRIVATEKEY, process.env.PRIVATEKEY1],
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: "CGPDXGVTQXTQVQV4JZ9CTTXUE21IXAGKVB",
    },
    solidity: {
        compilers: [
            {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    mocha: {
        timeout: 200000,
    },
};
