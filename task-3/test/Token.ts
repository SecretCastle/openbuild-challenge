const { expect } = require('chai');
const {ethers} = require('hardhat')

describe("Token", () => {
    let myToken, owner, addr1, addr2;
    const INITIAL_SUPPLY = ethers.parseEther("1000000");

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const TokenFactory = await ethers.getContractFactory("MyToken");
        myToken = await TokenFactory.deploy(INITIAL_SUPPLY);
        await myToken.waitForDeployment();
    })

    describe("基础功能", () => {
        it("部署合约时，初始供应量正确", async () => {
            expect(await myToken.totalSupply()).to.equal(INITIAL_SUPPLY);
            expect(await myToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
        })

        it("当前所涉及的角色账户代币详情", async () => {
            expect(await myToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
            expect(await myToken.balanceOf(addr1.address)).to.equal(0);
            expect(await myToken.balanceOf(addr2.address)).to.equal(0);
        })

        it("转账功能", async () => {
            // 转账100个代币给addr1
            await myToken.transfer(addr1.address, ethers.parseEther("1000"));
            expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
            expect(await myToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - ethers.parseEther("1000"));
            
            // addr1转账50个代币给addr2
            await myToken.connect(addr1).transfer(addr2.address, ethers.parseEther("500"));
            expect(await myToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("500"));
            expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("500"));
            expect(await myToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - ethers.parseEther("1000"));
        })
    })

    describe("授权与委托转账", async () => {
        it("owner授权1000代币给addr1使用，addr1从owner中转1000给addr2", async () => {
            const approvalAmount = ethers.parseEther("1000");
            await myToken.approve(addr1.address, approvalAmount);
            await myToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("200"));
            expect(await myToken.balanceOf(addr2.address)).to.not.equal(approvalAmount);
            expect(await myToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("200"));
            expect(await myToken.allowance(owner.address, addr1.address)).to.equal(approvalAmount - ethers.parseEther("200"));
        })

        it("授权超过余额的代币转账", async () => {
            const approvalAmount = ethers.parseEther("1000");
            await myToken.approve(addr1.address, approvalAmount);
            await expect(myToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("2000")))
                .to.be.reverted;
        })
    })
})