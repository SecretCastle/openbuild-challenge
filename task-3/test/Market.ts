const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("Market测试", () => {
    let nftMarket, myNFT, myToken, owner, seller, buyer;
    const TOKEN_ID = 0;
    const PRICE = ethers.parseEther("1.0");

    beforeEach(async () => {
        [owner, seller, buyer] = await ethers.getSigners();

        //部署NFT合约
        const NFTFactory = await ethers.getContractFactory("MyNFT");
        myNFT = await NFTFactory.deploy();
        await myNFT.waitForDeployment();

        // 部署ERC20代币合约
        const TokenFactory = await ethers.getContractFactory("MyToken");
        myToken = await TokenFactory.deploy(ethers.parseEther("1000000"));
        await myToken.waitForDeployment();
        const tokenAddress = await myToken.getAddress();

        // 转移代币给买家 100代币
        await myToken.transfer(buyer.address, ethers.parseEther("100"));

        // 部署市场合约
        const MarketFactory = await ethers.getContractFactory("NFTMarketplace");
        nftMarket = await MarketFactory.deploy(tokenAddress);
        await nftMarket.waitForDeployment();
        const marketAddress = await nftMarket.getAddress();

        // 铸造NFT给卖家
        await myNFT.mintNFT(seller.address, 'ipfs://test1');

        // 卖家批准市场合约管理NFT
        await myNFT.connect(seller).setApprovalForAll(marketAddress, true);

        // 买家批准市场合约使用代币
        await myToken.connect(buyer).approve(marketAddress, PRICE);
    })

    describe("NFT市场功能", () => {
        it("上架NFT", async () => {
            const nftAddress = await myNFT.getAddress();
            const tokenAddress = await myToken.getAddress();

            await nftMarket.connect(seller).listNFT(
                nftAddress,
                TOKEN_ID,
                PRICE,
                tokenAddress
            )
            const list = await nftMarket.listings(nftAddress, TOKEN_ID);
            expect(list.seller).to.equal(seller.address);
            expect(list.price).to.equal(PRICE);
            expect(list.erc20Token).to.equal(tokenAddress);
        })

        
        it("非拥有者不能上架NFT", async () => {
            const nftAddress = await myNFT.getAddress();
            const tokenAddress = await myToken.getAddress();

            await expect(
                nftMarket.connect(buyer).listNFT(
                    nftAddress,
                    TOKEN_ID,
                    PRICE,
                    tokenAddress
                )
            ).to.be.reverted;
        })
    })

    describe("购买NFT", () => {
        beforeEach(async () => {
            const nftAddress = await myNFT.getAddress();
            const tokenAddress = await myToken.getAddress();

            // 卖家上架NFT
            await nftMarket.connect(seller).listNFT(
                nftAddress,
                TOKEN_ID,
                PRICE,
                tokenAddress
            );
        })

        it("买家购买卖家的NFT", async () => {
            const nftAddress = await myNFT.getAddress();
            // 买家购买NFT
            await nftMarket.connect(buyer).buyNFT(
                nftAddress,
                TOKEN_ID
            )
            // 此时nft的owner地址已改为买家地址
            expect(await myNFT.ownerOf(TOKEN_ID)).to.equal(buyer.address);

            // 卖家对应的nft地址为空
            const listing = await nftMarket.listings(nftAddress, TOKEN_ID);
            expect(listing.seller).to.equal(ethers.ZeroAddress);
        })

        it("价格不足不能购买NFT", async () => {
            const nftAddress = await myNFT.getAddress();
            // 创建一个新的买家地址，无足的代币余额
            const poolBuyer = await ethers.provider.getSigner();
            // owner给新玩家转账
            await myToken.transfer(poolBuyer.address, ethers.parseEther("0.1"));

            // 尝试购买NFT
            await expect(nftMarket.connect(poolBuyer).buyNFT(nftAddress, TOKEN_ID)).to.be.reverted;
            
            // owner地址给新玩家再转账10个代币
            await myToken.transfer(poolBuyer.address, ethers.parseEther("10.0"));
            await myToken.connect(poolBuyer).approve(await nftMarket.getAddress(), ethers.parseEther("10.0"));
            await nftMarket.connect(poolBuyer).buyNFT(nftAddress, TOKEN_ID);
            expect(await myNFT.ownerOf(TOKEN_ID)).to.equal(poolBuyer.address);
        })

        
    })

    describe("归属性检查", () => {
        beforeEach(async () => {
            const nftAddress = await myNFT.getAddress();
            const tokenAddress = await myToken.getAddress();

            // 卖家上架NFT
            await nftMarket.connect(seller).listNFT(
                nftAddress,
                TOKEN_ID,
                PRICE,
                tokenAddress
            );
        })

        it("列举出所有的NFT", async () => {
            const nftAddress = await myNFT.getAddress();
            // 列举所有NFT
            const result = await nftMarket.getListing()
            expect(result.length).to.equal(1);
            expect(result[0].nftAddress).to.equal(nftAddress);
            expect(result[0].tokenId).to.equal(TOKEN_ID);
            expect(result[0].seller).to.equal(seller.address);
            expect(result[0].price).to.equal(PRICE);
        })

        it("属于卖家的NFT", async () => {
            // 获取卖家的NFT
            const result = await nftMarket.connect(seller).getListBelongToMe();
            expect(result.length).to.equal(1);
        })

        it("属于买家的NFT", async () => {
            // 获取卖家的NFT
            const result = await nftMarket.connect(buyer).getListBelongToMe();
            expect(result.length).to.equal(0);
        })
    })
})