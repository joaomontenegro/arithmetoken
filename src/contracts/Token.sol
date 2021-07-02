// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Token is ERC721URIStorage {
    event Minted(address indexed addr, uint256 indexed tokenId);

    using Counters for Counters.Counter;
    Counters.Counter private _info;

    enum Type {Operation, Number}
    enum Operation {None,  Add, Sub, Mul, Div }

    mapping (uint256 => Operation) private _operations;
    mapping (uint256 => int64) private _numbers;

    mapping (int64 => bool) private _mintedNumbers;

    address _minter = address(0);
    bool _minterSet = false;
    
    uint8 _initialMinted = 0;
    uint8 public constant _initialMax = 10;    

    struct TokenInfo 
    {
        uint256 id;
        Operation operation;
        int64 number;
        string uri;
    }

    constructor() ERC721("ArithmeToken", "ARI") {}

    function _mint(address addr, string memory uri) internal returns (uint256)
    {
        _info.increment();

        uint256 newTokenId = _info.current();
        super._mint(addr, newTokenId);
        _setTokenURI(newTokenId, uri);

        emit Minted(addr, newTokenId);

        return newTokenId;
    }

    function _isNumberMinted(int64 number) private view returns (bool) {
        return _mintedNumbers[number];
    }

    function _setNumberMinted(int64 number) private {
        _mintedNumbers[number] = true;
    }

    function setMinter(address minter) public returns (address) {
        require(!_minterSet, "setMinter() can only be called once.");
        _minter = minter;
        _minterSet= true;

        return _minter;
    }

    function getTokenInfo(uint256 tokenId) public view returns (TokenInfo memory) {
        require(_exists(tokenId), "Token: getting info of nonexistent token");

        TokenInfo memory info;
        info.id = tokenId;
        info.operation = getOperation(tokenId);
        info.number = getNumber(tokenId);
        info.uri = tokenURI(tokenId);

        return info;
    }

    function getTokenInfos(address addr) public view returns (TokenInfo[] memory) {
        uint256 balance = balanceOf(addr);
        TokenInfo[] memory info = new TokenInfo[](balance);
        uint256 found = 0;
        
        for (uint256 i=0; found < balance; i++) {
            if (_exists(i) && ownerOf(i) == addr) {
                info[found] = getTokenInfo(i);
                found++;
            }
        }

        return info;
    }

    function getType(uint256 tokenId) public view returns (Type) {
        require(_exists(tokenId), "Token: getting type of nonexistent token");
        if (getOperation(tokenId) != Operation.None) {
            return Type.Operation;
        } else {
            return Type.Number;
        }
    }

    function getNumber(uint256 tokenId) public view returns (int64) {
        require(_exists(tokenId), "Token: getting number of nonexistent token");
        return _numbers[tokenId];
    }

    function getOperation(uint256 tokenId) public view returns (Operation) {
        require(_exists(tokenId), "Token: getting op of nonexistent token");
        return _operations[tokenId];
    }

    // TODO: remove?
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

    function mintNumber(address acct, string memory uri, int64 number) public returns (uint256)
    {
        require(!_isNumberMinted(number), "The token for that number was already minted.");

        // After the initial tokens are minted, only the minter address will be able to mint more.
        if (_initialMinted >= _initialMax) {
            require(_msgSender() == _minter, "Only the minter address can mint new Tokens.");
        }
        _initialMinted++;

        uint256 newTokenId = _mint(acct, uri);
        _numbers[newTokenId] = number;
        _setNumberMinted(number);

        return newTokenId;
    }

    function mintOperation(address acct, string memory uri, Operation operation) public returns (uint256)
    {
        uint256 newTokenId = _mint(acct, uri);
        _operations[newTokenId] = operation;

        return newTokenId;
    }


}