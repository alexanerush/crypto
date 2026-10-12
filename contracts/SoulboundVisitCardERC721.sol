 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundVisitCardERC721 is ERC721, Ownable {
    uint256 private _nextTokenId = 1;

    struct VisitCardMetadata {
        string studentName;
        string studentID;
        string course;
        string metadataURI;
    }

    mapping(uint256 => VisitCardMetadata) private _visitCards;
    mapping(string => bool) private _studentIDUsed;
    mapping(address => bool) public hasVisitCard;

    error SoulboundToken();
    error StudentAlreadyHasCard();
    error StudentIDAlreadyUsed();
    error InvalidMetadata();

    constructor()
        ERC721("Student Visit Card", "SVC")
        Ownable(msg.sender)
    {}

    function mintVisitCard(
        address student,
        string calldata studentName,
        string calldata studentID,
        string calldata course,
        string calldata metadataURI
    ) external onlyOwner returns (uint256 tokenId) {
        if (
            student == address(0) ||
            bytes(studentName).length == 0 ||
            bytes(studentID).length == 0 ||
            bytes(course).length == 0 ||
            bytes(metadataURI).length == 0
        ) {
            revert InvalidMetadata();
        }

        if (hasVisitCard[student]) {
            revert StudentAlreadyHasCard();
        }

        if (_studentIDUsed[studentID]) {
            revert StudentIDAlreadyUsed();
        }

        tokenId = _nextTokenId++;

        hasVisitCard[student] = true;
        _studentIDUsed[studentID] = true;

        _visitCards[tokenId] = VisitCardMetadata({
            studentName: studentName,
            studentID: studentID,
            course: course,
            metadataURI: metadataURI
        });

        _safeMint(student, tokenId);
    }

    function getVisitCardMetadata(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory studentName,
            string memory studentID,
            string memory course,
            string memory metadataURI
        )
    {
        ownerOf(tokenId);

        VisitCardMetadata storage card = _visitCards[tokenId];

        return (
            card.studentName,
            card.studentID,
            card.course,
            card.metadataURI
        );
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        ownerOf(tokenId);
        return _visitCards[tokenId].metadataURI;
    }

    function approve(
        address,
        uint256
    ) public pure override {
        revert SoulboundToken();
    }

    function setApprovalForAll(
        address,
        bool
    ) public pure override {
        revert SoulboundToken();
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);

        if (from != address(0) && to != address(0)) {
            revert SoulboundToken();
        }

        return super._update(to, tokenId, auth);
    }
}
