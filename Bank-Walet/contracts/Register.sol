pragma solidity^0.4.0;
contract Register
{
    struct bank_Details
    {
        string name;
        uint256 bal;
        uint256 time;
        uint256 loan_interst;
        uint fixed_deposit_interst;
        uint account_deposit_interst;
    }
    
    mapping(address=>bank_Details) public bank_d1;
    //mapping(uint=>address) public reg_user;
    address[] public reg_user;

    
    function register(string name,uint _loan_interst,uint _fixed_deposit,uint _acc_dep_int)public payable returns(string)
    {
        if(bank_d1[msg.sender].time==0)
        {
            bank_d1[msg.sender].name=name;
            bank_d1[msg.sender].loan_interst=_loan_interst;
            bank_d1[msg.sender].fixed_deposit_interst=_fixed_deposit;
            bank_d1[msg.sender].account_deposit_interst=_acc_dep_int;
            bank_d1[msg.sender].bal=msg.value;
            bank_d1[msg.sender].time=now;
        
            reg_user.push(msg.sender);
            return "Successfully Registered";
        }
        else
        {
            return "Account Alreay Exist";
        }
    }
  
    function show_registers() public view returns(address[])
    {
        return reg_user;
    }
    function show_bank_detail(uint index,uint intr_type)public view returns(string bank_name,address tem_add,uint intr)
    {
        tem_add=reg_user[index];
        bank_name=bank_d1[tem_add].name;
        if(intr_type==0)
        {
            intr=bank_d1[tem_add].loan_interst;
        }
        if(intr_type==1)
        {
            intr=bank_d1[tem_add].fixed_deposit_interst;
        }
        if(intr_type==2)
        {
            intr=bank_d1[tem_add].account_deposit_interst;
        }
    }
}
