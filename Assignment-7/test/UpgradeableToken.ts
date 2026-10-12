
import { expect } from "chai";
import { network } from "hardhat";
import type { Contract } from "ethers";

const { ethers } = await network.connect();

type TokenContract = Contract & {
  transfer(to: string, amount: bigint): Promise<unknown>;
  mint(to: string, amount: bigint): Promise<unknown>;
  balanceOf(account: string): Promise<bigint>;
  totalSupply(): Promise<bigint>;
  upgradeToAndCall(
    implementation: string,
    data: string
  ): Promise<{ wait(): Promise<unknown> }>;
};

describe("Upgradeable MyToken", function () {
  async function deployToken() {
    const [owner, recipient, stranger] = await ethers.getSigners();
    const initialSupply = ethers.parseUnits("1000000", 18);

    const implementation = await ethers.deployContract("MyTokenV1");
    await implementation.waitForDeployment();

    const initializationData = implementation.interface.encodeFunctionData(
      "initialize",
      [initialSupply]
    );

    const proxy = await ethers.deployContract("MyTokenProxy", [
      await implementation.getAddress(),
      initializationData,
    ]);
    await proxy.waitForDeployment();

    const proxyAddress = await proxy.getAddress();
    const tokenV1 = (await ethers.getContractAt(
      "MyTokenV1",
      proxyAddress
    )) as unknown as TokenContract;

    return {
      owner,
      recipient,
      stranger,
      initialSupply,
      proxyAddress,
      tokenV1,
    };
  }

  it("assigns the initial supply to the owner", async function () {
    const { owner, initialSupply, tokenV1 } = await deployToken();

    expect(await tokenV1.totalSupply()).to.equal(initialSupply);
    expect(await tokenV1.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("transfers tokens between accounts", async function () {
    const { owner, recipient, tokenV1 } = await deployToken();
    const amount = ethers.parseUnits("100", 18);

    await tokenV1.connect(owner).getFunction("transfer")(
      recipient.address,
      amount
    );

    expect(await tokenV1.balanceOf(owner.address)).to.equal(
      ethers.parseUnits("999900", 18)
    );
    expect(await tokenV1.balanceOf(recipient.address)).to.equal(amount);
  });

  it("allows the owner to mint tokens", async function () {
    const { owner, recipient, tokenV1 } = await deployToken();
    const amount = ethers.parseUnits("50", 18);

    await tokenV1.connect(owner).getFunction("mint")(
      recipient.address,
      amount
    );

    expect(await tokenV1.balanceOf(recipient.address)).to.equal(amount);
    expect(await tokenV1.totalSupply()).to.equal(
      ethers.parseUnits("1000050", 18)
    );
  });

  it("prevents non-owners from minting tokens", async function () {
    const { recipient, stranger, tokenV1 } = await deployToken();
    const amount = ethers.parseUnits("50", 18);

    let reverted = false;

    try {
      await tokenV1.connect(stranger).getFunction("mint")(
        recipient.address,
        amount
      );
    } catch {
      reverted = true;
    }

    expect(reverted).to.equal(true);
  });

  it("upgrades to V2 without changing token balances or supply", async function () {
    const { owner, recipient, tokenV1, proxyAddress, initialSupply } =
      await deployToken();

    const amount = ethers.parseUnits("100", 18);

    await tokenV1.connect(owner).getFunction("transfer")(
      recipient.address,
      amount
    );

    const ownerBalanceBefore = await tokenV1.balanceOf(owner.address);
    const recipientBalanceBefore = await tokenV1.balanceOf(recipient.address);
    const supplyBefore = await tokenV1.totalSupply();

    const implementationV2 = await ethers.deployContract("MyTokenV2");
    await implementationV2.waitForDeployment();

    await tokenV1.connect(owner).getFunction("upgradeToAndCall")(
      await implementationV2.getAddress(),
      "0x"
    );

    const tokenV2 = await ethers.getContractAt("MyTokenV2", proxyAddress);

    expect(await tokenV2.version()).to.equal("V2");
    expect(await tokenV2.balanceOf(owner.address)).to.equal(ownerBalanceBefore);
    expect(await tokenV2.balanceOf(recipient.address)).to.equal(
      recipientBalanceBefore
    );
    expect(await tokenV2.totalSupply()).to.equal(supplyBefore);
    expect(await tokenV2.totalSupply()).to.equal(initialSupply);
  });
});
