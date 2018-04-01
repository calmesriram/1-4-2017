// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/High_low.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var bet_address = [];
var total_games;



window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.basicfunctions();
    });
  },

  basicfunctions : function(){
    $("#account").val(account)
    
    web3.eth.getBalance(account, (err, balance) => {
      balance = web3.fromWei(balance, "ether") + ""
      $("#balance").val(balance.trim())
    });
  },

  broker : function(){
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.check_broker({from: account});
    }).then(function(result) {
      self.basicfunctions();
      if(result){
        $("#result").html('');
        $("#mine_stack").html('');
        $("#bet_list").html('');

        $("#result").html('<label for="sname">Stock Name : </label>&nbsp;&nbsp;<input type="text" id="sname" /><br>\
        <label for="sprice">Strike Price  : </label>&nbsp;&nbsp;<input type="text" id="sprice" /><br>\
        <label for="etime">Expire Time : </label>&nbsp;&nbsp;<input type="text" id="etime" /><br>\
        <button onclick="App.broker_bet_add();">Add Bet</button>');

        $("#mine_stack").html('<label for="stake_amount">Stake Amount  </label>&nbsp;&nbsp;<input type="text" id="stake_amount" /><br>\
        <button onclick="App.add_broker_stake();">Add Stake</button>');
        $("#bet_list").append('<table class="table table-striped"><thead><tr><th>Stock Name</th><th>Stock Price</th><th>Expire Time</th></tr></thead><tbody id="body_bet"></tbody></table>');
        

        self.bet_list();
        self.viewStack();

      }
      else{
        $("#result").html('<label for="Benter">Enter Ammount </label>&nbsp;&nbsp;<input type="text" id="Benter" /><button onclick="App.broker_reg();">Register</button>')
      }
      
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });

  },

  broker_reg : function(){
    var amo = parseInt($("#Benter").val());

    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.add_broker({from: account,gas: 6000000,value:web3.toWei(amo, 'ether')});
    }).then(function(result) {
      self.broker();
      alert("Success !!!");
    });

  },

  broker_bet_add : function(){
    var sname = $("#sname").val();
    var sprice = parseInt($("#sprice").val());
    var etime = parseInt($("#etime").val());

    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.broker_set_game(sname,sprice,etime,{from: account,gas: 6000000});
    }).then(function(result) {
      self.broker();
      alert("Success !!!");
      
      
    });

  },

  bet_list: function(){
    $("#body_bet").html('');
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.game_number(account);
    }).then(function(result) {
      var bet_count = result.toNumber();
      var bet_obj={};
      for (var i=0;i<bet_count;i++){
          self.bet_items(i);
      }
      return bet_obj;
    });
  },

  bet_items : function(i){

    var self = this;
    var meta;
    var a = MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.game_set_map(account,parseInt(i));
    }).then(function(result) {
      $("#body_bet").append('<tr><td>'+result[0]+'</td><td>'+result[1].toNumber()+'</td><td>'+result[2].toNumber()+'</td></tr>')
    });
  },

  add_broker_stake : function(){

    var stake_amount  = parseInt($("#stake_amount").val());
    
    var self = this;
    var meta;
    var a = MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.add_broker_stake(stake_amount,{from: account,value:stake_amount,gas: 6000000});
    }).then(function(result) {
      self.viewStack();
      alert("Success !!!");
      //$("#body_bet").append('<tr><td>'+result[0]+'</td><td>'+result[1].toNumber()+'</td><td>'+result[2].toNumber()+'</td></tr>')
    });
  },

  viewStack : function(){
    var self = this;
    var meta;
    var a = MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.broker_map(account);
    }).then(function(result) {
      $("#b_stack").html('<label for="stack_amt">Your Stake Ammount :<input class="form-control" id="stack_amt" value='+result.toNumber()+' readonly /></label>');

      //$("#body_bet").append('<tr><td>'+result[0]+'</td><td>'+result[1].toNumber()+'</td><td>'+result[2].toNumber()+'</td></tr>')
    });
  },

  trader : function(){
    //bet_address = [];

    $("#result").html('');
    $("#mine_stack").html('');
    $("#bet_list").html('');
    $("#b_stack").html('');
    var res_obj = {};
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.game_id({from: account});
    });
  },

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();

});
