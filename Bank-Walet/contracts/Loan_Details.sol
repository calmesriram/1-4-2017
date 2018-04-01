pragma solidity ^0.4.0;
import "./Register.sol";
import "./Bank.sol";

contract Loan_Details is Bank
{
    uint eth=1 ether;
    //uint256 public ln_req_count=0;
    struct loan_get
    {
        address bank_address;
        uint256 amount;
        uint256 count;
        uint last_setl_time;
        uint time;
        uint months;
        uint bal_ln;
        uint installment;
        uint256 id;
    }
    
    mapping (address=>mapping(uint256=>loan_get))public ln_get;
    mapping(address=>uint256)public ln_get_count;
    
    struct loan_pro
    {
        address bank_address;
        uint256 amount;
        uint time;
        uint months;
    }
    
    mapping (address=>mapping(uint256=>loan_pro))public ln_pro;
    mapping(address=>uint256)public ln_pro_count;
    
    function req_loan(address bank_address,uint256 amt,uint8 year) public payable
    {
        require(bank_d1[msg.sender].time!=0);
        require(bank_d1[bank_address].time!=0);
        require(bank_address!=msg.sender);
        
        require (bank_d1[bank_address].bal > amt *eth);
            
        bank_d1[msg.sender].bal += amt*eth;
        bank_d1[bank_address].bal -= amt*eth;
        
        
        
        ln_get[msg.sender][ln_get_count[msg.sender]].bank_address = bank_address;
        ln_get[msg.sender][ln_get_count[msg.sender]].amount = amt*eth;
        ln_get[msg.sender][ln_get_count[msg.sender]].months=year*12;
        ln_get[msg.sender][ln_get_count[msg.sender]].time=now;
        ln_get[msg.sender][ln_get_count[msg.sender]].last_setl_time=now;
        ln_get[msg.sender][ln_get_count[msg.sender]].installment=(amt*eth)/(year*12);
        ln_get[msg.sender][ln_get_count[msg.sender]].bal_ln = amt*eth;
        ln_get[msg.sender][ln_get_count[msg.sender]].id = ln_get_count[msg.sender];
        
        ln_pro[bank_address][ln_pro_count[bank_address]].bank_address = msg.sender;
        ln_pro[bank_address][ln_pro_count[bank_address]].amount = amt*eth;
        ln_pro[bank_address][ln_pro_count[bank_address]].months=year*12;
        ln_pro[bank_address][ln_pro_count[bank_address]].time=now;
        
        ln_pro_count[bank_address]++;
        ln_get_count[msg.sender]++;
    }
    
    function settlement(uint ln_id) public
    {
        uint temp_count=ln_get[msg.sender][ln_id].count;
        uint temp_month=ln_get[msg.sender][ln_id].months;
        uint temp_bal_ln=ln_get[msg.sender][ln_id].bal_ln;
        uint temp_ins=ln_get[msg.sender][ln_get_count[msg.sender]].installment;
        uint temp_last=ln_get[msg.sender][ln_get_count[msg.sender]].last_setl_time + 1 minutes;//30 days;
        address temp_bank_address=ln_get[msg.sender][ln_id].bank_address;
        
        require(temp_count<temp_month);
        require((temp_last + 1 minutes)<=now);
        
        uint intr=bank_d1[temp_bank_address].loan_interst;
        uint amont=( temp_bal_ln * (intr/100) ) /100;
        
        require(amont+temp_ins<=bank_d1[msg.sender].bal);
        
        bank_d1[msg.sender].bal -= amont+temp_ins;
        bank_d1[temp_bank_address].bal += amont+temp_ins;
        
        ln_get[msg.sender][ln_get_count[msg.sender]].last_setl_time = temp_last +1 minutes;//30 days;
        ln_get[msg.sender][ln_id].bal_ln-=temp_ins;
        ln_get[msg.sender][ln_id].count++;
    }
}