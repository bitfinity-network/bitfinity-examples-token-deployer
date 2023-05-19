// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ERC20TokenDeployer {
    struct Token {
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
        string image;
        address tokenAddress;
        address owner;
        uint256 fee;
    }

    Token[] public tokens;
    uint256 public feePercentage = 10;
    mapping(address => Token) public addressToToken;

    function createToken(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply,
        string memory _image,
        uint256 _fee
    ) external {
        require(_totalSupply > 10, "Total supply is low");
        Token memory newToken = Token(
            _name,
            _symbol,
            _decimals,
            _totalSupply,
            _image,
            address(0),
            msg.sender,
            _fee
        );

        MyToken tokenContract = new MyToken(
            _name,
            _symbol,
            _decimals,
            _totalSupply
        );

        newToken.tokenAddress = address(tokenContract);
        //_mint(tokenContract, _totalSupply);
        // tokenContract._mint(msg.sender, _totalSupply);
        //tokenContract.mintTotalSupply(_totalSupply);
        tokens.push(newToken);
        tokenContract.transferTo(msg.sender, _totalSupply);
        addressToToken[msg.sender] = newToken;
    }

    function mintToAddress(
        uint256 tokenId,
        address _to,
        uint256 _amount
    ) external payable {
        require(tokenId < tokens.length, "Invalid token ID");
        Token memory token = tokens[tokenId];
        require(msg.value >= token.fee, "Insufficient fee");

        uint256 feeAmount = (msg.value * feePercentage) / 100;
        uint256 transferAmount = msg.value - feeAmount;

        MyToken(token.tokenAddress).transferTo(_to, _amount * token.decimals);
        (bool transferOne, ) = payable(token.owner).call{value: transferAmount}(
            ""
        );
        require(transferOne, "Owner Transfer failed.");
        //console.log("Balance of ", balance);
        //MyToken(token.tokenAddress).transfer(_to, _amount);
    }

    function getAllTokens() external view returns (Token[] memory) {
        return tokens;
    }

    function getTokenBalance(
        address _tokenAddress
    ) external view returns (uint256) {
        return MyToken(_tokenAddress).balanceOf(_tokenAddress);
    }

    function getTokenCount() external view returns (uint256) {
        return tokens.length;
    }

    function getToken(uint256 tokenId) external view returns (Token memory) {
        require(tokenId < tokens.length, "Invalid token ID");
        return tokens[tokenId];
    }
}

contract MyToken is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) ERC20(_name, _symbol) {
        _mint(address(this), _totalSupply);
    }

    function transferTo(address _to, uint256 _amount) external returns (bool) {
        _transfer(address(this), _to, _amount);
        return true;
    }
}
