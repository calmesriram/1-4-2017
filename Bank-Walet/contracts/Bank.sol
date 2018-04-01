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
   
    function withdraw() ch_register public payable
    {
        require(bank_d1[msg.sender].bal>msg.value);
        bank_d1[msg.sender].bal-=msg.value;
        
        address me=msg.sender;
        me.transfer(msg.value);
    }
   
    function transfer(address to) ch_register public payable
    {  
        require(bank_d1[msg.sender].bal>msg.value);
        bank_d1[to].bal+=msg.value;
        bank_d1[msg.sender].bal-=msg.value;
        //to.transfer(msg.value);
    }
    
    function GetBalance() ch_register public constant returns (uint256)
    {
        return bank_d1[msg.sender].bal;
    }

    function fetchBalance(address _banker) public constant returns (uint256)
    {
        return bank_d1[_banker].bal;
    }

    function isRegistered(address _bank) public constant returns (bool) {
      return bank_d1[_bank].time > 0;
    }
}
