// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Token is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum Type {Operation, Number}
    mapping (uint256 => Type) private _types;
    
    enum Operation { Add, Sub, Mul, Div }
    mapping (uint256 => Operation) private _operations;
    
    mapping (uint256 => int64) private _numbers;

    constructor() ERC721("ArithmeToken", "ARI") {}

    function _mint(address addr, string memory uri) internal returns (uint256)
    {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        super._mint(addr, newTokenId);
        _setTokenURI(newTokenId, uri);

        return newTokenId;
    }

    function getTokensInAddress(address addr) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(addr);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 found = 0;
        
        for (uint256 i=0; found < balance; i++) {
            if (_exists(i) && ownerOf(i) == addr) {
                tokenIds[found] = i;
                found++;
            }
        }

        return tokenIds;
    }

    function getType(uint256 tokenId) public view returns (Type) {
        require(_exists(tokenId), "Token: getting type of nonexistent token");
        return _types[tokenId];
    }

    function getNumber(uint256 tokenId) public view returns (int64) {
        require(_exists(tokenId), "Token: getting number of nonexistent token");
        require(getType(tokenId) == Type.Number, "Token: getting number from Operation token");
        return _numbers[tokenId];
    }

    function getOperation(uint256 tokenId) public view returns (Operation) {
        require(_exists(tokenId), "Token: getting op of nonexistent token");
        require(getType(tokenId) == Type.Operation, "Token: getting operation from Number token");
        return _operations[tokenId];
    }

    function getOperationText(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token: getting text of nonexistent token");
        require(getType(tokenId) == Type.Operation, "Token: getting text from Number token");
        
        Operation op = getOperation(tokenId);
        if (op == Operation.Add) {
            return "+";
        } else if (op == Operation.Sub) {
            return "-";
        } else if (op == Operation.Mul) {
            return "*";
        } else if (op == Operation.Div) {
            return "/";
        }

        return "";
    }

    function runOperation(Operation op, int64 v1, int64 v2) public pure returns (int64) {
        if (op == Operation.Add) {
            return v1 + v2;
        } else if (op == Operation.Sub) {
            return v1 - v2;
        } else if (op == Operation.Mul) {
            return v1 * v2;
        } else if (op == Operation.Div) {
            return v1 / v2;
        }

        return 0;
    }

    function runOperation(uint256 tokenId, int64 v1, int64 v2) public view returns (int64) {
        require(_exists(tokenId), "Token: calculating using a nonexistent token");
        require(getType(tokenId) == Type.Operation, "Token: calculating using a Number token");

        return runOperation(getOperation(tokenId), v1, v2);
    }

    // TODO Permissions?
    function mintNumber(address acct, string memory uri, int64 number) public returns (uint256)
    {
        uint256 newTokenId = _mint(acct, uri);
        _types[newTokenId] = Type.Number;
        _numbers[newTokenId] = number;

        return newTokenId;
    }

    // TODO Permissions?
    function mintOperation(address acct, string memory uri, Operation operation) public returns (uint256)
    {
        uint256 newTokenId = _mint(acct, uri);
        _types[newTokenId] = Type.Operation;
        _operations[newTokenId] = operation;

        return newTokenId;
    }


}