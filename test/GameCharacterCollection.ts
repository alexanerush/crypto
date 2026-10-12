import { expect } from "chai";
import { network } from "hardhat";

describe("GameCharacterCollectionERC1155", function () {
  async function deployGame() {
    const { ethers } = await network.connect();
    const [owner, student, other] = await ethers.getSigners();

    const GameFactory = await ethers.getContractFactory(
      "GameCharacterCollectionERC1155"
    );

    const game: any = await GameFactory.deploy();
    await game.waitForDeployment();

    await (await game.initializeCharacters()).wait();

    return { game, owner, student, other };
  }

  async function configureMetadata(game: any) {
    for (let id = 1; id <= 10; id++) {
      const metadataURI = `ipfs://characters/character-${id}.json`;
      const imageURI = `ipfs://images/character-${id}.svg`;

      await (
        await game.setCharacterMetadata(
          id,
          metadataURI,
          imageURI
        )
      ).wait();
    }
  }

  it("initializes 10 different game characters", async function () {
    const { game } = await deployGame();

    expect(await game.CHARACTER_COUNT()).to.equal(10n);
    expect(await game.charactersInitialized()).to.equal(true);

    const names = [
      "Shadow Knight",
      "Frost Mage",
      "Flame Archer",
      "Forest Guardian",
      "Storm Assassin",
      "Iron Golem",
      "Solar Priest",
      "Void Hunter",
      "Ocean Samurai",
      "Crystal Dragon",
    ];

    const uniqueNames = new Set<string>();

    for (let id = 1; id <= 10; id++) {
      const character = await game.getCharacterMetadata(id);

      expect(character[0]).to.equal(names[id - 1]);
      expect(character[2]).to.not.equal("");
      expect(character[3]).to.be.greaterThan(0n);
      expect(character[4]).to.be.greaterThan(0n);
      expect(character[5]).to.not.equal("");

      uniqueNames.add(character[0]);
    }

    expect(uniqueNames.size).to.equal(10);
  });

  it("allows the owner to set unique metadata URIs", async function () {
    const { game } = await deployGame();

    await configureMetadata(game);

    const uniqueURIs = new Set<string>();

    for (let id = 1; id <= 10; id++) {
      const expectedURI = `ipfs://characters/character-${id}.json`;
      const expectedImage = `ipfs://images/character-${id}.svg`;

      expect(await game.uri(id)).to.equal(expectedURI);

      const character = await game.getCharacterMetadata(id);
      expect(character[1]).to.equal(expectedImage);

      uniqueURIs.add(await game.uri(id));
    }

    expect(uniqueURIs.size).to.equal(10);
  });

  it("mints exactly 10 NFTs, one per character ID", async function () {
    const { game, owner } = await deployGame();

    await configureMetadata(game);

    await (await game.mintCollection()).wait();

    expect(await game.collectionMinted()).to.equal(true);

    for (let id = 1; id <= 10; id++) {
      expect(await game.balanceOf(owner.address, id)).to.equal(1n);
    }
  });

  it("prevents minting the collection twice", async function () {
    const { game } = await deployGame();

    await configureMetadata(game);

    await (await game.mintCollection()).wait();

    await expect(
      game.mintCollection()
    ).to.be.revertedWithCustomError(
      game,
      "CollectionAlreadyMinted"
    );
  });

  it("supports batch minting", async function () {
    const { game, student } = await deployGame();

    await configureMetadata(game);

    await (
      await game.mintCharactersBatch(
        student.address,
        [1, 2, 3],
        [2, 3, 1]
      )
    ).wait();

    expect(await game.balanceOf(student.address, 1)).to.equal(2n);
    expect(await game.balanceOf(student.address, 2)).to.equal(3n);
    expect(await game.balanceOf(student.address, 3)).to.equal(1n);
  });

  it("supports batch transfers to a student wallet", async function () {
    const { game, owner, student } = await deployGame();

    await configureMetadata(game);

    await (await game.mintCollection()).wait();

    await (
      await game.safeBatchTransferFrom(
        owner.address,
        student.address,
        [1, 2],
        [1, 1],
        "0x"
      )
    ).wait();

    expect(await game.balanceOf(student.address, 1)).to.equal(1n);
    expect(await game.balanceOf(student.address, 2)).to.equal(1n);

    expect(await game.balanceOf(owner.address, 1)).to.equal(0n);
    expect(await game.balanceOf(owner.address, 2)).to.equal(0n);
  });

  it("prevents unauthorized minting", async function () {
    const { game, student } = await deployGame();

    await expect(
      game.connect(student).mintCollection()
    ).to.be.revertedWithCustomError(
      game,
      "OwnableUnauthorizedAccount"
    );

    await expect(
      game.connect(student).mintCharactersBatch(
        student.address,
        [1],
        [1]
      )
    ).to.be.revertedWithCustomError(
      game,
      "OwnableUnauthorizedAccount"
    );
  });

  it("rejects invalid character IDs", async function () {
    const { game } = await deployGame();

    await expect(
      game.getCharacterMetadata(0)
    ).to.be.revertedWithCustomError(game, "InvalidTokenId");

    await expect(
      game.getCharacterMetadata(11)
    ).to.be.revertedWithCustomError(game, "InvalidTokenId");

    await expect(
      game.setCharacterMetadata(
        11,
        "ipfs://invalid.json",
        "ipfs://invalid.svg"
      )
    ).to.be.revertedWithCustomError(game, "InvalidTokenId");
  });
});
