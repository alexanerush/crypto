import { expect } from "chai";
import { network } from "hardhat";

describe("SoulboundVisitCardERC721", function () {
  async function deployFixture() {
    const { ethers } = await network.connect();
    const [owner, student, anotherStudent] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory(
      "SoulboundVisitCardERC721"
    );

    const card: any = await Factory.deploy();
    await card.waitForDeployment();

    return { ethers, card, owner, student, anotherStudent };
  }

  const metadataURI = "ipfs://example-student-card-metadata";

  it("allows the owner to mint a student visit card", async function () {
    const { card, student } = await deployFixture();

    await card.mintVisitCard(
      student.address,
      "Alex",
      "STU001",
      "Blockchain Development",
      metadataURI
    );

    expect(await card.ownerOf(1)).to.equal(student.address);
    expect(await card.hasVisitCard(student.address)).to.equal(true);
    expect(await card.tokenURI(1)).to.equal(metadataURI);
  });

  it("stores student metadata", async function () {
    const { card, student } = await deployFixture();

    await card.mintVisitCard(
      student.address,
      "Alex",
      "STU001",
      "Blockchain Development",
      metadataURI
    );

    const data = await card.getVisitCardMetadata(1);

    expect(data.studentName).to.equal("Alex");
    expect(data.studentID).to.equal("STU001");
    expect(data.course).to.equal("Blockchain Development");
    expect(data.metadataURI).to.equal(metadataURI);
  });

  it("prevents minting two cards to the same wallet", async function () {
    const { card, student } = await deployFixture();

    await card.mintVisitCard(
      student.address,
      "Alex",
      "STU001",
      "Blockchain Development",
      metadataURI
    );

    await expect(
      card.mintVisitCard(
        student.address,
        "Alex",
        "STU002",
        "Blockchain Development",
        metadataURI
      )
    ).to.be.revertedWithCustomError(card, "StudentAlreadyHasCard");
  });

  it("prevents duplicate student IDs", async function () {
    const { card, student, anotherStudent } = await deployFixture();

    await card.mintVisitCard(
      student.address,
      "Alex",
      "STU001",
      "Blockchain Development",
      metadataURI
    );

    await expect(
      card.mintVisitCard(
        anotherStudent.address,
        "Sam",
        "STU001",
        "Blockchain Development",
        metadataURI
      )
    ).to.be.revertedWithCustomError(card, "StudentIDAlreadyUsed");
  });

  it("prevents unauthorized minting", async function () {
    const { card, student, anotherStudent } = await deployFixture();

    await expect(
      card.connect(student).mintVisitCard(
        anotherStudent.address,
        "Sam",
        "STU002",
        "Blockchain Development",
        metadataURI
      )
    ).to.be.revertedWithCustomError(card, "OwnableUnauthorizedAccount");
  });

  it("prevents transferring a soulbound token", async function () {
    const { card, student, anotherStudent } = await deployFixture();

    await card.mintVisitCard(
      student.address,
      "Alex",
      "STU001",
      "Blockchain Development",
      metadataURI
    );

    await expect(
      card.connect(student).transferFrom(
        student.address,
        anotherStudent.address,
        1
      )
    ).to.be.revertedWithCustomError(card, "SoulboundToken");
  });

  it("prevents token approvals", async function () {
    const { card, student, anotherStudent } = await deployFixture();

    await card.mintVisitCard(
      student.address,
      "Alex",
      "STU001",
      "Blockchain Development",
      metadataURI
    );

    await expect(
      card.connect(student).approve(
        anotherStudent.address,
        1
      )
    ).to.be.revertedWithCustomError(card, "SoulboundToken");

    await expect(
      card.connect(student).setApprovalForAll(
        anotherStudent.address,
        true
      )
    ).to.be.revertedWithCustomError(card, "SoulboundToken");
  });
});
