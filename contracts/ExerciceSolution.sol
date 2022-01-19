pragma solidity ^0.6.0;

import "./ERC20Claimable.sol";
import "./ERC20Mintable.sol";

contract ExerciceSolution {
    mapping(address => uint256) tokenBalance;
    ERC20Claimable claimableERC20;
    ERC20Mintable mintableERC20;

    constructor (ERC20Claimable _claimableToken, ERC20Mintable _mintableERC20) public {
        claimableERC20 = _claimableToken;
        mintableERC20 = _mintableERC20;
    }

    function claimTokensOnBehalf() external{
        claimableERC20.claimTokens();
        uint256 amount = claimableERC20.distributedAmount();
        tokenBalance[msg.sender] += amount;
        mintableERC20.mint(msg.sender, amount);

    }
    //see last amount , balance of tokens claimed

	function tokensInCustody(address callerAddress) external returns (uint256){
        return tokenBalance[callerAddress];
    }

	function withdrawTokens(uint256 amountToWithdraw) external returns (uint256){
        claimableERC20.transfer(msg.sender, amountToWithdraw);
        tokenBalance[msg.sender]-=amountToWithdraw;
        mintableERC20.burn(msg.sender, amountToWithdraw);
        return amountToWithdraw;
    }

	function depositTokens(uint256 amountToWithdraw) external returns (uint256){
        claimableERC20.transferFrom(msg.sender, address(this), amountToWithdraw);
        tokenBalance[msg.sender]+=amountToWithdraw;
        mintableERC20.mint(msg.sender, amountToWithdraw);
        return amountToWithdraw;
    }

	function getERC20DepositAddress() external returns (address){
        return address(mintableERC20);
    }

}