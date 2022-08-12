// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "erc721a/contracts/ERC721A.sol";

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

contract NFTA is ERC721A {
    using Base58 for bytes;
    mapping(uint => string) metadatas;
    mapping(uint => address) creators;

    constructor(string memory _name, string memory _symbol)
        ERC721A(_name, _symbol)
    {}

    function mint(uint256 quantity, string[] memory uris) external payable {
        uint256 startTokenId = _nextTokenId();
        require(quantity == uris.length, "mint : Invalide parameters");
        for (uint256 i = 0; i < quantity; i++) {
            creators[startTokenId + i] = msg.sender;
            metadatas[startTokenId + i] = uris[i];
        }
        _mint(msg.sender, quantity);
    }

    function creatorOf(uint tokenId) public view virtual returns (address) {
        address creator = creators[tokenId];
        require(
            creator != address(0),
            "ERC721: owner query for nonexistent token"
        );
        return creator;
    }
}
