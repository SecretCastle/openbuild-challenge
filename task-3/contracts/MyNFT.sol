// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    struct NFTInfo {
        uint256 tokenId;
        string tokenURI;
    }

    mapping(address => uint256[]) private _ownedTokens;

    constructor() ERC721("MyNFT", "MNFT") {
        tokenCounter = 0;
    }

    // 监听NFT铸造事件
    event NFTMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI
    );

    function mintNFT(
        address to,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 tokenId = tokenCounter++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // 添加到地址的持有列表中
        _ownedTokens[to].push(tokenId);

        emit NFTMinted(to, tokenId, tokenURI);
        return tokenId;
    }

    function totalSupply() public view returns (uint256) {
        return tokenCounter;
    }

    function NFTLists(address from) public view returns (NFTInfo[] memory) {
        uint256[] memory owned = _ownedTokens[from];
        NFTInfo[] memory result = new NFTInfo[](owned.length);
        for (uint256 i = 0; i < owned.length; i++) {
            result[i] = NFTInfo(owned[i], tokenURI(owned[i]));
        }
        return result;
    }
}
