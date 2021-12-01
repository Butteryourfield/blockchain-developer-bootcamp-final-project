import React, { Component, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import raffleLotteryContract from "./contracts/raffleLottery.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    storageValue: 0, 
    lotteryStatus: '-', 
    runningJackpot: 0, 
    entryTotal: 0, 
    ticketPrice: 0,
    numEntries: 0,
    web3: null, 
    accounts: null, 
    contract: null 
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
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
      this.setState({ web3, accounts, contract: instance }, this.runInitialGetter);
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
  runInitialGetter = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    
    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    const responseLotteryStatus = await contract.methods.isLotteryLive().call();
    
    var lotteryStatusString = '';
    var ticketPriceResponse = 0;
    // Update state with the result.
    if (responseLotteryStatus) {
      ticketPriceResponse = await contract.methods.ticketPrice().call();
      // convert wei into eth
      ticketPriceResponse = ticketPriceResponse/(Math.pow(10, 18))
      lotteryStatusString = 'ACTIVE'
    }
    else lotteryStatusString = 'INACTIVE';

    this.setState({ lotteryStatus: lotteryStatusString });
    this.setState({ ticketPrice: ticketPriceResponse });
    
  };

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
    const accounts = this.state.accounts

  }

  render() {
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
        <div>
        <h1>Laugh Alottery</h1>
        <h3><i>Laughter is the language of Joy</i></h3>
        <p>__________________________________________________________________________________________________________________</p>
        <div><b>Status:</b> {this.state.lotteryStatus}</div>
        <div><b>Current Jackpot:</b> {this.state.runningJackpot}</div>
        <div><b>Total Number of Entries:</b> {this.state.entryTotal}</div>
        <div><b>Ticket Price:</b> {this.state.ticketPrice} ETH</div>
        <p>__________________________________________________________________________________________________________________</p>
        </div>

        <p><h2>Enter Lottery</h2> (Add entries and SUBMIT)</p>
        <button onClick={this.handleIncrementEntryNumber.bind(this)}>More Entries</button>
        <button onClick={this.handleDecrementEntryNumber.bind(this)}>Less Entries</button>
        <div><b>Number of Tickets:</b> {this.state.numEntries}</div>
        <div><b>Price of Tickets:</b> {this.state.numEntries*this.state.ticketPrice} ETH </div>
        <div>_______</div>
        <button onClick={this.handleSubmit.bind(this)}>SUBMIT</button>
        <div>^^^^^^^</div>
      
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
