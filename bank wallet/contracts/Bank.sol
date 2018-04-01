pragma solidity ^0.4.18;
import "./Register.sol";

contract Bank is Register
{
    modifier ch_register()
    {
        require(bank_d1[msg.sender].time!=0);
        _;
    }
   
    function deposit()  public payable ch_register
    {
        require(msg.value>0);
        bank_d1[msg.sender].bal+=msg.value;
    }
   
    function withdraw(uint256 amount) ch_register public
    {
        require(bank_d1[msg.sender].bal>amount);
        bank_d1[msg.sender].bal-=amount;
        msg.sender.transfer(amount);
    }
   
    function transfer(address to,uint256 amount) ch_register public payable
    {  
        require(bank_d1[msg.sender].bal>amount);
        bank_d1[to].bal+=amount;
        bank_d1[msg.sender].bal-=amount;
        //to.transfer(amount);
    }
    
    function GetBalance() ch_register public constant returns (uint256)
    {
        return bank_d1[msg.sender].bal;
    }
}