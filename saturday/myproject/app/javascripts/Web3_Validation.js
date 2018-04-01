function plug()
{
	 if (typeof web3 !== 'undefined')
        {
            web3 = new Web3(web3.currentProvider);
            alert("Metamask Plugged in.....")
            check();
        }
       else
        {
               alert("First You need to install meta mask");
	       window.location.assign("https://metamask.io/")
               return;
        }
}
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
// Use Mist/MetaMask's provider
/*window.web3 = new Web3(web3.currentProvider); 
if (web3.currentProvider.isMetaMask === true) {
    if (typeof web3.eth.defaultAccount === 'undefined')
     {
        document.body.innerHTML = '<body><h1>Oops! Your browser does not support Ethereum Ðapps.</h1></body>';   
     }
    else {
            alert("Unlocked");
         }
}
}*/
function check()
{
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
// Use Mist/MetaMask's provider
window.web3 = new Web3(web3.currentProvider); 
if (web3.currentProvider.isMetaMask === true) {
if (typeof web3.eth.defaultAccount === 'undefined')
 {
         document.body.innerHTML = '<body><h1>Oops! You Need to Unlock your Account</h1></body>';   
 }
else
 {
      alert("Metamask is Unlocked");
  }
}
}
