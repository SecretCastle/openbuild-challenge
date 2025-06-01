// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMarketplace {
    struct Listing {
        address seller;
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        address erc20Token;
    }

    IERC20 public paymentToken;
    mapping(address => mapping(uint256 => Listing)) public listings;
    Listing[] public allListings;

    event NFTListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        address erc20Token
    );
    event NFTPurchased(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }

    function listNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address erc20Token
    ) external {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
                nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[nftAddress][tokenId] = Listing(
            msg.sender,
            nftAddress,
            tokenId,
            price,
            erc20Token
        );
        allListings.push(listings[nftAddress][tokenId]);

        emit NFTListed(msg.sender, nftAddress, tokenId, price, erc20Token);
    }

    function buyNFT(address nftAddress, uint256 tokenId) external {
        Listing memory item = listings[nftAddress][tokenId];
        require(item.price > 0, "Item not listed");

        // 支付 ERC20 代币
        require(
            paymentToken.transferFrom(msg.sender, item.seller, item.price),
            "Token transfer failed"
        );

        // NFT 转给买家
        IERC721(nftAddress).safeTransferFrom(item.seller, msg.sender, tokenId);

        // 移除商品
        delete listings[nftAddress][tokenId];

        emit NFTPurchased(msg.sender, nftAddress, tokenId, item.price);
    }

    function getListing() public view returns (Listing[] memory) {
        return allListings;
    }

    // 获取属于我的 NFT 列表
    function getListBelongToMe() public view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allListings.length; i++) {
            if (allListings[i].seller == msg.sender) {
                count++;
            }
        }

        Listing[] memory myListings = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allListings.length; i++) {
            if (allListings[i].seller == msg.sender) {
                myListings[index] = allListings[i];
                index++;
            }
        }
        return myListings;
    }

    // 不属于我的NFT，也就是我可以买的
    function getListNotForMe() public view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allListings.length; i++) {
            if (allListings[i].seller != msg.sender) {
                count++;
            }
        }

        Listing[] memory notMyListings = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allListings.length; i++) {
            if (allListings[i].seller != msg.sender) {
                notMyListings[index] = allListings[i];
                index++;
            }
        }
        return notMyListings;
    }
}
