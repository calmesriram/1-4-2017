// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import register_artifacts from '../../build/contracts/Register.json';
import Bank_artifacts from '../../build/contracts/Bank.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var register = contract(register_artifacts);
var Bank = contract(Bank_artifacts);
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    register.setProvider(web3.currentProvider);

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
    });
    this.showBalance();
  $("#register-bank").click(function(event) {

    var self = this;
   
    var interest = parseInt(document.getElementById("interest").value);
    var loan_interest = parseInt(document.getElementById("loan-interest").value);
    var deposit_interest = parseInt(document.getElementById("deposit-interest").value);
    var bank_name = document.getElementById("bank-name").value;
  
    $("#status").html("Initiating transaction... (please wait)");

   register.deployed().then(function(instance) {
      return instance.register(bank_name, deposit_interest, loan_interest, interest, {from: account, gas: 6000000});
    }).then(function() {
      $("#status").html("Transaction complete!");
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });
  $("#deposit-bank").click(function(event) {

    var self = this;

    var deposit_amount = parseInt(document.getElementById("da").value);

    $("#status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      console.log(web3.toWei(da, 'ether'));
      return instance.deposit({from: account, gas: 6000000, value: web3.toWei(da, 'ether')});
    }).then(function() {
      $("#status").html("Transaction complete!");
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });

    $("#withdraw-amount").click(function(event) {

      var self = this;
  
      var withdraw = parseInt(document.getElementById("w").value);
  
      $("#status").html("Initiating transaction... (please wait)");
  
      Bank.deployed().then(function(instance) {
        console.log(web3.toWei(withdraw, 'ether'));
        return instance.withdraw({from: account, gas: 6000000, value: web3.toWei(withdraw, 'ether')});
      }).then(function() {
        $("#status").html("Transaction complete!");
        App.showBalance();
      }).catch(function(e) {
        console.log(e);
        $("#status").html("Error in transaction; see log.");
      });
    });
   
  $("#transfer-amount").click(function(event) {

    var self = this;
    var address = parseInt(document.getElementById("t").value);
    var amount = parseInt(document.getElementById("t1").value);
    $("#status").html("Initiating transaction... (please wait)");

   Bank.deployed().then(function(instance) {
    console.log(web3.toWei(withdraw, 'ether'));
      return instance.transfer(address, {from: account, gas: 6000000, value: web3.toWei(withdraw, 'ether')});
    }).then(function() {
      $("#status").html("Transaction complete!");
      App.showBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error in transaction; see log.");
    });
  });
  },



  showBalance: function() {
    var self = this;

    var bank;
    
    register.deployed().then(function(instance) {
      bank = instance;
      return instance.isRegistered(account);
    }).then(function(val) {
      console.log(val);
      if (val == true) {
        $("#bank-info").html("This bank has registered");
      } else {
        $("#bank-info").html("This bank has not registered yet");
      }
      return bank.fetchBalance(account);
    }).then(function(val) {
      $("#balance-address").html("This bank's balance is " + val);
    }).catch(function(e) {
      console.log(e);
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
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
