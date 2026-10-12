import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("MyToken", function () {
  async function deployToken() {
    const [owner, user1, user2] = await ethers.getSigners();

    const initialSupply = ethers.parseUnits("1000000", 18);
    const token = await ethers.deployContract("MyToken", [initialSupply]);

    await token.waitForDeployment();

    return { token, owner, user1, user2, initialSupply };
  }

  it("Should assign the initial supply to the owner", async function () {
    const { token, owner, initialSupply } = await deployToken();

    expect(await token.totalSupply()).to.equal(initialSupply);
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("Should transfer tokens between accounts", async function () {
    const { token, owner, user1 } = await deployToken();

    const amount = ethers.parseUnits("100", 18);

    await token.connect(owner).transfer(user1.address, amount);

    expect(await token.balanceOf(user1.address)).to.equal(amount);
  });

  it("Should allow the owner to mint new tokens", async function () {
    const { token, user1, initialSupply } = await deployToken();

    const amount = ethers.parseUnits("500", 18);

    await token.mint(user1.address, amount);

    expect(await token.balanceOf(user1.address)).to.equal(amount);
    expect(await token.totalSupply()).to.equal(initialSupply + amount);
  });

  it("Should prevent non-owners from minting tokens", async function () {
    const { token, user1 } = await deployToken();

    const amount = ethers.parseUnits("100", 18);

    await expect(
      token.connect(user1).mint(user1.address, amount)
    ).to.revert(ethers);
  });

  it("Should prevent transfers exceeding the available balance", async function () {
    const { token, user1, user2 } = await deployToken();

    const amount = ethers.parseUnits("100", 18);

    await expect(
      token.connect(user1).transfer(user2.address, amount)
    ).to.revert(ethers);
  });
});