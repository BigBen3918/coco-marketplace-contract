const ipfs = require("./ipfs_api");
const fs = require("fs");
const nftInfos = require("../../resources/metadata.json");

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const upload_IFPS = async () => {
    const basic_ipfs_url = "https://ipfs.io/ipfs/";
    var ipfsHashes = {};

    for (var i = 0; i < nftInfos.length; i++) {
        console.log(nftInfos[i]);

        var result = await ipfs.files.add(
            Buffer.from(JSON.stringify(nftInfos[i]))
        );
        var ipfsHash = basic_ipfs_url + result[0].hash;
        console.log(ipfsHash);

        ipfsHashes[index] = ipfsHash;
        await delay(10000);
    }
    fs.writeFile(
        "./resources/metadata_hash.json",
        JSON.stringify(ipfsHashes, null, 4),
        function (err, content) {
            if (err) throw err;
            console.log("complete");
        }
    );
};

upload_IFPS(10);
