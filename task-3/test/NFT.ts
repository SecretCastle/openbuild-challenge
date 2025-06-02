const { expect } = require('chai')
const { ethers } = require('hardhat')  

describe("NFT测试", () => {
    let myNFT;
    let owner, addr1, addr2;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const NFTFactory = await ethers.getContractFactory("MyNFT");
        myNFT = await NFTFactory.deploy();
        await myNFT.waitForDeployment();
    })

    describe("铸造NFT",  () => {
        it("铸造", async () => {
            await myNFT.mintNFT(addr1.address, 'ipfs://test')
            expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
        })

        it("Token递增", async () => {
            await myNFT.mintNFT(addr1.address, 'ipfs://test1')
            await myNFT.mintNFT(addr2.address, 'ipfs://test12')

            expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
            expect(await myNFT.ownerOf(1)).to.equal(addr2.address);
            expect(await myNFT.totalSupply()).to.equal(2);
        })
        
        it('我锻造的NFT清单', async () => {
            await myNFT.mintNFT(addr1.address, 'ipfs://test1')
            await myNFT.mintNFT(addr1.address, 'ipfs://test2')
            await myNFT.mintNFT(addr1.address, 'ipfs://test3')
            
            // NFTLists
            const nftList = await myNFT.NFTLists(addr1.address);
            expect(nftList.length).to.equal(3);
        })
    })

    describe("NFT转账", () => {
        beforeEach(async () => {
            // 先给addr1铸造一个NFT
            await myNFT.mintNFT(addr1.address, 'ipfs://test1')
        })

        it("持有者可转账NFT", async () => {
            await myNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
            expect(await myNFT.ownerOf(0)).to.equal(addr2.address);
        })

        it("非持有者不可转账NFT", async () => {
            await expect(
                myNFT.connect(addr2).transferFrom(addr1.address, addr2.address, 0)
            ).to.be.reverted;
        })
    })
})