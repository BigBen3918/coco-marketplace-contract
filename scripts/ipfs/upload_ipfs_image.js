const ipfs = require("./ipfs_api");
const fs = require("fs");
// const nftInfos = require("../../resources/nftInfos.json");

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const upload_IFPS = async () => {
    const basic_ipfs_url = "https://ipfs.io/ipfs/";

    // const basic_file_path = "./resources/images/";
    const basic_file_path = "./resources/authors/";
    var ipfsHashes = {};

    for (var i = 0; i < 3; i++) {
        var index = i + 1;

        const contents = fs.readFileSync(
            basic_file_path + "author-" + index + ".jpg"
        );
        console.log(basic_file_path + "author-" + index + ".jpg");

        var result = await ipfs.files.add(contents);
        var ipfsHash = basic_ipfs_url + result[0].hash;
        console.log(ipfsHash);
        ipfsHashes[index] = ipfsHash;

        await delay(10000);
    }
    fs.writeFile(
        "./resources/ipfshashes_images.json",
        JSON.stringify(ipfsHashes, null, 4),
        function (err, content) {
            if (err) throw err;
            console.log("complete");
        }
    );
};

upload_IFPS(10);
