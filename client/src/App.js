import React, { Component, useState } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import raffleLotteryContract from "./contracts/raffleLottery.json";
import getWeb3 from "./getWeb3";
// import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3';
import { useWeb3React } from "@web3-react/core"
import { injected } from "./Connector"

// import Header from "./Header";
// import { injected } from "./Connector";
import { Button } from "@material-ui/core";
// import { useWeb3React } from "@web3-react/core"
// const { active, account, activate, deactivate } = useWeb3React()

// import { useEthers, useEtherBalance } from "@usedapp/core";

import { inspect } from 'util' // or directly
// or 
// var util = require('util')

import "./App.css";

class App extends Component {
  state = { 
    // storageValue: 0, 
    lotteryStatus: '-', 
    owner: '-',
    runningJackpot: 0, 
    entryTotal: 0, 
    ticketPrice: 0,
    numEntries: 0,
    web3: null, 
    account: null, 
    contract: null,
  };

  componentDidMount = async () => {
    try {
      // const { active, account, library, connector, activate, deactivate } = useWeb3React.activate
      
      // bypass getWeb3.js to try use connect button
      // Get network provider and web3 instance.
      // const provider = new Web3.providers.HttpProvider(
      //   "http://127.0.0.1:8545"
      // );
      // const web3 = new Web3(provider);

      const web3 = new Web3(window.ethereum);
         
      // console.log("No web3 instance injected, using Local web3.");
    
      // const web3 = await getWeb3();

      // // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts();
      
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      

      // Default storage contract
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      // Lotteru contract
      const deployedNetwork = raffleLotteryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        raffleLotteryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: null, contract: instance }, this.runGetter);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  // example for storage contract
  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  // Lottery Contract initial run
  runGetter = async () => {
    const { contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    
    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    const responseLotteryStatus = await contract.methods.isLotteryLive().call();
    
    var lotteryStatusString = '';
    var ticketPriceResponse = 0;
    var ownerOfLottery = '';
    // Update state with the result.
    if (responseLotteryStatus) {
      ticketPriceResponse = await contract.methods.ticketPrice().call();
      // convert wei into eth
      // ticketPriceResponse = ticketPriceResponse/(Math.pow(10, 18))
      lotteryStatusString = 'ACTIVE'
      ownerOfLottery = await contract.methods.owner().call();
    }
    else lotteryStatusString = 'INACTIVE';

    this.setState({ lotteryStatus: lotteryStatusString });
    this.setState({ ticketPrice: ticketPriceResponse });
    this.setState({ owner: ownerOfLottery });
    
  };
 // TRYING TO GET THE METAMASK CONNECT BUTTON TO WORK!.....
  connect(event) {
    // const web3 = await getWeb3();
    try {
      // useEthers().activateBrowserWallet;
      // const web3 = await getWeb3();
      // if (window.ethereum) {
    // Use web3 to get the user's accounts.
      // const accounts = await web3.window;
      // await window.ethereum.enable();
      window.ethereum.enable().then(() => {
        this.state.web3.eth.getAccounts((errors, accounts) => {
          this.state.web3.currentProvider.selectedAddress = accounts[0]
          return this.setState({ account: accounts[0] });
        })
      });

      
        


        // this.state.web3.eth.getAccounts((errors, accounts) => {
        //   return this.setState({ account: accounts[0] });
        // })

        // this.setState({ acounts: null });

        // just too see if button is responding...
      
    } catch (ex) {
      // this.setState({ numEntries: this.state.numEntries += 1 })  // for debugging
      console.log(ex)
    }    
  }

  disconnect(event) {
    try {
      // window.ethereum.on('disconnect')
      this.state.web3.currentProvider.selectedAddress = null
      this.setState({ account: null })

      
    } catch (ex) {
      // this.setState({ numEntries: this.state.numEntries += 1 }) // for debugging
      console.log(ex)
    }    
  }
  
  // export const loadAccount = async (dispatch, web3) => {
  //   const accounts = await web3.eth.getAccounts();
  //   const account = accounts[0];
  //   dispatch(accountLoaded(account));
  //   return account;
  // }

  // connect = async () => {
  //   try {
  //     await useWeb3React().activate(injected)
  //     this.setState({ numEntries: this.state.numEntries -= 1 })
  //   } catch (ex) {
  //     this.setState({ numEntries: this.state.numEntries += 1 })
  //     console.log(ex)
  //   }
  // }

  handleIncrementEntryNumber(event){
    this.setState({ numEntries: this.state.numEntries += 1 })
  }
  
  handleDecrementEntryNumber(event){
    if (!this.state.numEntries == 0) {
      this.setState({ numEntries: this.state.numEntries -= 1 })
    }
  }

  handleSubmit(event){
    const contract = this.state.contract
    const account = this.state.account

    // window.ethereum.enable().then(() => {
    //   this.state.web3.eth.getAccounts((errors, accounts) => {
    //     this.state.web3.currentProvider.selectedAddress = accounts[0]
    //     return this.setState({ account: accounts[0] });
    //   })
    // });

    contract.methods.enterLottery(this.state.numEntries).send({
      from: account, 
      value: this.state.numEntries*this.state.ticketPrice,
      // gas: 10000000000,
      // gasPrice: '30000000000000'
    })

    this.runGetter()
  }

  render() {
    var util = require('util') // inspecting web3 object

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/* <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div> */}
{/*         
        <button>click me</button>
        <button variant="primary" size="lg">
        Large button
        </button> */}
        {/* <Button
          // onClick={disconnect}
          variant="contained"
          color="primary"
          style={{
            marginRight: "150px",
            width: "250px"
          }}
        >
            Disconnect
        </Button> */}
        {/* <span
          style={{
            marginLeft: "auto",
            padding: "15px"
          }}>
          Connect + Select MetaMask Account ---{">"}
        </span> */}
        <Button
          onClick={this.connect.bind(this)} // Disable onClick until can get the metamask button to work...
          variant="contained"
          color="primary"
          style={{
            marginRight: "-1300px",
            width: "250px"
          }}>
            Connect MetaMask
        </Button>
        <Button
          onClick={this.disconnect.bind(this)} // Disable onClick until can get the metamask button to work...
          variant="contained"
          color="secondary"
          style={{
            marginRight: "0px",
            width: "250px"
          }}>
            Deselect Account
        </Button>
        <div>
          <span
            style={{
              marginRight: "-1370px",
              padding: "15px"
            }}>
            * - Connect/Select MetaMask Account - *
          </span>
          <span
            style={{
              marginRight: "0px",
              padding: "15px"
            }}>
            * ---- Deselect MetaMask Account ---- *
          </span>
        </div>
        <div>
          <span
            style={{
              marginRight: "-1360px",
              padding: "10px"
            }}>
            (Only opens window if no account connected yet)
          </span>
          <span
            style={{
              marginRight: "0px",
              padding: "40px"
            }}>
            (Only deselects, disconnect account in ext)
          </span>
        </div>
        <div>
        <h1>Laugh Alottery</h1>
        <h3><i>- because laughter is the language of joy -</i></h3>
        <p>__________________________________________________________________________________________________________________</p>
        <div><b>Status:</b> {this.state.lotteryStatus}</div>
        <div><b>Current Jackpot:</b> {this.state.runningJackpot}</div>
        <div><b>Total Number of Entries:</b> {this.state.entryTotal}</div>
        <div><b>Ticket Price:</b> {this.state.ticketPrice/(Math.pow(10, 18))} ETH</div>
        <div><b>Owner Address</b> {this.state.owner} </div>
        <p>__________________________________________________________________________________________________________________</p>
        </div>

        <p><h2>Enter Lottery</h2> (Add entries and SUBMIT)</p>
        <button onClick={this.handleIncrementEntryNumber.bind(this)}>More Entries</button>
        <button onClick={this.handleDecrementEntryNumber.bind(this)}>Less Entries</button>
        <div><b>Number of Tickets:</b> {this.state.numEntries}</div>
        <div><b>Price of Tickets:</b> {(this.state.numEntries*this.state.ticketPrice)/(Math.pow(10, 18))} ETH </div>
        <div>_______</div>
        <button onClick={this.handleSubmit.bind(this)}>SUBMIT</button>
        <div>^^^^^^^</div>
        <p>__________________________________________________________________________________________________________________</p>
        {/* <div>Account Pub Keys: {this.state.account != null ? this.state.account : '-'}</div> */}
        <div><b>Selected Account:</b> {this.state.web3.currentProvider.selectedAddress != null ? this.state.web3.currentProvider.selectedAddress : '-'}</div>
        __________________________________________________________________________________________________________________
        {/* <div>{util.inspect(this.state.web3)}</div> */}
      
{/* 
        <Select value={ticketNumRange} label="Ticket Number" onChange={handleTicketNumRangeChange}>
          {ticketNumRanges.map((age) => {
            return <MenuItem value={age}>{age}</MenuItem>;
          })}
        </Select> */}
      </div>
    );
  }
}

export default App;
