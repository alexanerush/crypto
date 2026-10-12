
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("MultiSigWallet", function () {
  async function deployWalletFixture() {
    const [owner1, owner2, owner3, recipient, outsider] =
      await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");

    const wallet: any = await MultiSigWallet.deploy(
      [owner1.address, owner2.address, owner3.address],
      2
    );

    await wallet.waitForDeployment();

    return { wallet, owner1, owner2, owner3, recipient, outsider };
  }

  it("sets owners and confirmation threshold", async function () {
    const { wallet, owner1, owner2, owner3 } =
      await deployWalletFixture();

    expect(await wallet.requiredConfirmations()).to.equal(2);
    expect(await wallet.isOwner(owner1.address)).to.equal(true);
    expect(await wallet.isOwner(owner2.address)).to.equal(true);
    expect(await wallet.isOwner(owner3.address)).to.equal(true);
    expect(await wallet.getTransactionCount()).to.equal(0);
  });

  it("rejects duplicate owners", async function () {
    const [owner1] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MultiSigWallet");

    await expect(
      Factory.deploy([owner1.address, owner1.address], 2)
    ).to.be.revertedWith("Duplicate owner");
  });

  it("allows an owner to submit a transaction", async function () {
    const { wallet, owner1, recipient } =
      await deployWalletFixture();

    await expect(
      wallet.connect(owner1).submitTransaction(
        recipient.address,
        ethers.parseEther("1"),
        "0x"
      )
    ).to.emit(wallet, "SubmitTransaction");

    expect(await wallet.getTransactionCount()).to.equal(1);
  });

  it("executes a transaction only after enough confirmations", async function () {
    const { wallet, owner1, owner2, recipient } =
      await deployWalletFixture();

    const amount = ethers.parseEther("1");

    await owner1.sendTransaction({
      to: await wallet.getAddress(),
      value: amount,
    });

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      amount,
      "0x"
    );

    await wallet.connect(owner1).confirmTransaction(0);

    await expect(
      wallet.connect(owner1).executeTransaction(0)
    ).to.be.revertedWith("Not enough confirmations");

    await wallet.connect(owner2).confirmTransaction(0);

    const balanceBefore = await ethers.provider.getBalance(
      recipient.address
    );

    await expect(
      wallet.connect(owner1).executeTransaction(0)
    ).to.emit(wallet, "ExecuteTransaction");

    const balanceAfter = await ethers.provider.getBalance(
      recipient.address
    );

    expect(balanceAfter - balanceBefore).to.equal(amount);

    const transaction = await wallet.getTransaction(0);
    expect(transaction.executed).to.equal(true);
  });

  it("allows an owner to revoke a confirmation", async function () {
    const { wallet, owner1, recipient } =
      await deployWalletFixture();

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      ethers.parseEther("1"),
      "0x"
    );

    await wallet.connect(owner1).confirmTransaction(0);
    await wallet.connect(owner1).revokeConfirmation(0);

    const transaction = await wallet.getTransaction(0);

    expect(transaction.numConfirmations).to.equal(0);
    expect(await wallet.isConfirmed(0, owner1.address)).to.equal(false);
  });

  it("rejects duplicate confirmations", async function () {
    const { wallet, owner1, recipient } =
      await deployWalletFixture();

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      ethers.parseEther("1"),
      "0x"
    );

    await wallet.connect(owner1).confirmTransaction(0);

    await expect(
      wallet.connect(owner1).confirmTransaction(0)
    ).to.be.revertedWith("Already confirmed");
  });

  it("rejects actions from non-owners", async function () {
    const { wallet, outsider, recipient } =
      await deployWalletFixture();

    await expect(
      wallet.connect(outsider).submitTransaction(
        recipient.address,
        ethers.parseEther("1"),
        "0x"
      )
    ).to.be.revertedWith("Not an owner");
  });

  it("rejects execution of a nonexistent transaction", async function () {
    const { wallet, owner1 } = await deployWalletFixture();

    await expect(
      wallet.connect(owner1).executeTransaction(0)
    ).to.be.revertedWith("Transaction does not exist");
  });

  it("rejects a zero confirmation threshold", async function () {
    const [owner1] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MultiSigWallet");

    await expect(
      Factory.deploy([owner1.address], 0)
    ).to.be.revertedWith("Invalid confirmation threshold");
  });

  it("rejects a threshold greater than the number of owners", async function () {
    const [owner1, owner2] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MultiSigWallet");

    await expect(
      Factory.deploy([owner1.address, owner2.address], 3)
    ).to.be.revertedWith("Invalid confirmation threshold");
  });

  it("rejects the zero address as an owner", async function () {
    const Factory = await ethers.getContractFactory("MultiSigWallet");

    await expect(
      Factory.deploy([ethers.ZeroAddress], 1)
    ).to.be.revertedWith("Invalid owner");
  });

  it("rejects revoking a confirmation that was never given", async function () {
    const { wallet, owner1, recipient } =
      await deployWalletFixture();

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      ethers.parseEther("1"),
      "0x"
    );

    await expect(
      wallet.connect(owner1).revokeConfirmation(0)
    ).to.be.revertedWith("Not confirmed");
  });

  it("rejects execution when the wallet has insufficient funds", async function () {
    const { wallet, owner1, owner2, recipient } =
      await deployWalletFixture();

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      ethers.parseEther("1"),
      "0x"
    );

    await wallet.connect(owner1).confirmTransaction(0);
    await wallet.connect(owner2).confirmTransaction(0);

    await expect(
      wallet.connect(owner1).executeTransaction(0)
    ).to.be.revertedWith("Transaction failed");

    const transaction = await wallet.getTransaction(0);
    expect(transaction.executed).to.equal(false);
  });

  // Additional edge-case tests

  it("rejects an empty owners list", async function () {
    const Factory = await ethers.getContractFactory("MultiSigWallet");

    await expect(
      Factory.deploy([], 1)
    ).to.be.revertedWith("Owners required");
  });

  it("emits confirmation and revocation events", async function () {
    const { wallet, owner1, recipient } =
      await deployWalletFixture();

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      ethers.parseEther("1"),
      "0x"
    );

    await expect(
      wallet.connect(owner1).confirmTransaction(0)
    )
      .to.emit(wallet, "ConfirmTransaction")
      .withArgs(owner1.address, 0);

    await expect(
      wallet.connect(owner1).revokeConfirmation(0)
    )
      .to.emit(wallet, "RevokeConfirmation")
      .withArgs(owner1.address, 0);
  });

  it("rejects executing a transaction more than once", async function () {
    const { wallet, owner1, owner2, recipient } =
      await deployWalletFixture();

    const amount = ethers.parseEther("1");

    await owner1.sendTransaction({
      to: await wallet.getAddress(),
      value: amount,
    });

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      amount,
      "0x"
    );

    await wallet.connect(owner1).confirmTransaction(0);
    await wallet.connect(owner2).confirmTransaction(0);
    await wallet.connect(owner1).executeTransaction(0);

    await expect(
      wallet.connect(owner1).executeTransaction(0)
    ).to.be.revertedWith("Transaction already executed");
  });

  it("preserves other owners' confirmations when one owner revokes", async function () {
    const { wallet, owner1, owner2, recipient } =
      await deployWalletFixture();

    await wallet.connect(owner1).submitTransaction(
      recipient.address,
      ethers.parseEther("1"),
      "0x"
    );

    await wallet.connect(owner1).confirmTransaction(0);
    await wallet.connect(owner2).confirmTransaction(0);
    await wallet.connect(owner1).revokeConfirmation(0);

    const transaction = await wallet.getTransaction(0);

    expect(transaction.numConfirmations).to.equal(1);
    expect(await wallet.isConfirmed(0, owner1.address)).to.equal(false);
    expect(await wallet.isConfirmed(0, owner2.address)).to.equal(true);
  });
});
