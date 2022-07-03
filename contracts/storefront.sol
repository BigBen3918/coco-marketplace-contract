// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./IMarketplace.sol";

library Base58 {
    bytes constant prefix1 = hex"0a";
    bytes constant prefix2 = hex"080212";
    bytes constant postfix = hex"18";
    bytes constant sha256MultiHash = hex"1220";
    bytes constant ALPHABET =
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

    /// @dev Converts hex string to base 58
    function toBase58(bytes memory source)
        internal
        pure
        returns (bytes memory)
    {
        //   function toBytes(uint256 x) returns (bytes b) {

        if (source.length == 0) return new bytes(0);
        uint8[] memory digits = new uint8[](64); //TODO: figure out exactly how much is needed
        digits[0] = 0;
        uint8 digitlength = 1;
        for (uint256 i = 0; i < source.length; ++i) {
            uint carry = uint8(source[i]);
            for (uint256 j = 0; j < digitlength; ++j) {
                carry += uint(digits[j]) * 256;
                digits[j] = uint8(carry % 58);
                carry = carry / 58;
            }

            while (carry > 0) {
                digits[digitlength] = uint8(carry % 58);
                digitlength++;
                carry = carry / 58;
            }
        }
        //return digits;
        return toAlphabet(reverse(truncate(digits, digitlength)));
    }

    function truncate(uint8[] memory array, uint8 length)
        internal
        pure
        returns (uint8[] memory)
    {
        uint8[] memory output = new uint8[](length);
        for (uint256 i = 0; i < length; i++) {
            output[i] = array[i];
        }
        return output;
    }

    function reverse(uint8[] memory input)
        internal
        pure
        returns (uint8[] memory)
    {
        uint8[] memory output = new uint8[](input.length);
        for (uint256 i = 0; i < input.length; i++) {
            output[i] = input[input.length - 1 - i];
        }
        return output;
    }

    function toAlphabet(uint8[] memory indices)
        internal
        pure
        returns (bytes memory)
    {
        bytes memory output = new bytes(indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            output[i] = ALPHABET[indices[i]];
        }
        return output;
    }
}

library VerifySignature {
    function getEthSignedMessageHash(bytes32 _messageHash)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}

contract StoreFront is ERC721, ERC721Enumerable {
    mapping(uint256 => string) private TokenURI;

    using Address for address;
    using Strings for uint;
    using Base58 for bytes;

    mapping(uint => address) public creators;

    address public signerAddress;
    string private baseUri;

    constructor(
        address adminAddress,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        signerAddress = adminAddress;
        baseUri = "https://ipfs.io/ipfs"; //"https://ipfs.io/ipfs";
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function creatorOf(uint tokenId) public view virtual returns (address) {
        address creator = creators[tokenId];
        return creator;
    }

    function mintAndOnsale(
        uint tokenId,
        address market,
        address _acceptedToken,
        uint256 _priceInWei,
        uint256 _expiresAt,
        bytes memory signature
    ) public payable {
        //mint
        require(
            verify(
                tokenId,
                msg.sender,
                market,
                _priceInWei,
                _expiresAt,
                signature
            ),
            "invalid params"
        );
        creators[tokenId] = msg.sender;
        _mint(address(this), tokenId);
        address owner = ownerOf(tokenId);
        require(
            owner == address(this),
            string(abi.encodePacked(owner, "/", address(this)))
        );
        _approve(market, tokenId);
        IMarketplace(market).createOrder(
            address(this),
            msg.sender,
            tokenId,
            _acceptedToken,
            _priceInWei,
            _expiresAt
        );
    }

    function tokenURI(uint tokenId)
        public
        view
        override
        returns (string memory)
    {
        bytes memory src = new bytes(32);
        assembly {
            mstore(add(src, 32), tokenId)
        }
        bytes memory dst = new bytes(34);
        dst[0] = 0x12;
        dst[1] = 0x20;
        for (uint i = 0; i < 32; i++) {
            dst[i + 2] = src[i];
        }
        return string(abi.encodePacked(baseUri, "/", dst.toBase58()));
    }

    function getMessageHash(
        uint tokenId,
        address owner,
        address market,
        uint256 _priceInWei,
        uint256 _expiresAt
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    tokenId,
                    owner,
                    market,
                    _priceInWei,
                    _expiresAt
                )
            );
    }

    function verify(
        uint tokenId,
        address owner,
        address market,
        uint256 _priceInWei,
        uint256 _expiresAt,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = getMessageHash(
            tokenId,
            owner,
            market,
            _priceInWei,
            _expiresAt
        );
        bytes32 ethSignedMessageHash = VerifySignature.getEthSignedMessageHash(
            messageHash
        );
        return
            VerifySignature.recoverSigner(ethSignedMessageHash, signature) ==
            signerAddress;
    }
}
