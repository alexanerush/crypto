
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameCharacterCollectionERC1155
 * @notice A collection of 10 distinct game characters.
 */
contract GameCharacterCollectionERC1155 is ERC1155, Ownable {
    uint256 public constant CHARACTER_COUNT = 10;

    struct CharacterMetadata {
        string name;
        string imageURI;
        string color;
        uint256 speed;
        uint256 strength;
        string rarity;
    }

    mapping(uint256 => CharacterMetadata) private _characters;
    mapping(uint256 => string) private _metadataURIs;

    bool public collectionMinted;
    bool public charactersInitialized;

    error InvalidTokenId();
    error InvalidMetadata();
    error CollectionAlreadyMinted();
    error CharactersAlreadyInitialized();
    error CharactersNotInitialized();

    constructor() ERC1155("") Ownable(msg.sender) {}

    /**
     * @notice Initialize all 10 game characters after deployment.
     * @dev Can only be called once by the contract owner.
     */
    function initializeCharacters() external onlyOwner {
        if (charactersInitialized) {
            revert CharactersAlreadyInitialized();
        }

        charactersInitialized = true;

        _setCharacter(1, "Shadow Knight", "Black", 7, 9, "Legendary");
        _setCharacter(2, "Frost Mage", "Blue", 6, 8, "Epic");
        _setCharacter(3, "Flame Archer", "Red", 9, 7, "Epic");
        _setCharacter(4, "Forest Guardian", "Green", 5, 9, "Rare");
        _setCharacter(5, "Storm Assassin", "Purple", 10, 6, "Legendary");
        _setCharacter(6, "Iron Golem", "Gray", 3, 10, "Rare");
        _setCharacter(7, "Solar Priest", "Gold", 6, 7, "Uncommon");
        _setCharacter(8, "Void Hunter", "Black", 8, 8, "Epic");
        _setCharacter(9, "Ocean Samurai", "Cyan", 7, 8, "Rare");
        _setCharacter(10, "Crystal Dragon", "Silver", 8, 10, "Legendary");
    }

    function _setCharacter(
        uint256 tokenId,
        string memory characterName,
        string memory color,
        uint256 speed,
        uint256 strength,
        string memory rarity
    ) private {
        _characters[tokenId] = CharacterMetadata({
            name: characterName,
            imageURI: "",
            color: color,
            speed: speed,
            strength: strength,
            rarity: rarity
        });
    }

    function setCharacterMetadata(
        uint256 tokenId,
        string calldata metadataURI,
        string calldata imageURI
    ) external onlyOwner {
        if (!charactersInitialized) {
            revert CharactersNotInitialized();
        }

        _validateTokenId(tokenId);

        if (
            bytes(metadataURI).length == 0 ||
            bytes(imageURI).length == 0
        ) {
            revert InvalidMetadata();
        }

        _metadataURIs[tokenId] = metadataURI;
        _characters[tokenId].imageURI = imageURI;

        emit URI(metadataURI, tokenId);
    }

    function uri(
        uint256 tokenId
    ) public view override returns (string memory) {
        _validateTokenId(tokenId);
        return _metadataURIs[tokenId];
    }

    function getCharacterMetadata(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory characterName,
            string memory imageURI,
            string memory color,
            uint256 speed,
            uint256 strength,
            string memory rarity
        )
    {
        _validateTokenId(tokenId);

        CharacterMetadata storage character = _characters[tokenId];

        return (
            character.name,
            character.imageURI,
            character.color,
            character.speed,
            character.strength,
            character.rarity
        );
    }

    function mintCollection() external onlyOwner {
        if (!charactersInitialized) {
            revert CharactersNotInitialized();
        }

        if (collectionMinted) {
            revert CollectionAlreadyMinted();
        }

        uint256[] memory ids = new uint256[](CHARACTER_COUNT);
        uint256[] memory amounts = new uint256[](CHARACTER_COUNT);

        for (uint256 i = 0; i < CHARACTER_COUNT; i++) {
            uint256 tokenId = i + 1;

            if (bytes(_metadataURIs[tokenId]).length == 0) {
                revert InvalidMetadata();
            }

            ids[i] = tokenId;
            amounts[i] = 1;
        }

        collectionMinted = true;
        _mintBatch(owner(), ids, amounts, "");
    }

    function mintCharactersBatch(
        address recipient,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external onlyOwner {
        if (!charactersInitialized) {
            revert CharactersNotInitialized();
        }

        if (collectionMinted) {
            revert CollectionAlreadyMinted();
        }

        if (
            recipient == address(0) ||
            ids.length == 0 ||
            ids.length != amounts.length
        ) {
            revert InvalidMetadata();
        }

        for (uint256 i = 0; i < ids.length; i++) {
            _validateTokenId(ids[i]);

            if (
                amounts[i] == 0 ||
                bytes(_metadataURIs[ids[i]]).length == 0
            ) {
                revert InvalidMetadata();
            }
        }

        _mintBatch(recipient, ids, amounts, "");
    }

    function _validateTokenId(uint256 tokenId) private pure {
        if (tokenId == 0 || tokenId > CHARACTER_COUNT) {
            revert InvalidTokenId();
        }
    }
}
