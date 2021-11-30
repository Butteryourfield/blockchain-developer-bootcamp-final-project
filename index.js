// Configuration
var Web3 = require('web3');
const EthereumTransaction = require('ethereumjs-tx').Transaction;

// Use the RPC Server address provided by Ganache 
var web3 = new Web3('http://127.0.0.1:7545'); 

// Set Addresses from Ganache
var sendingAddress = '0x87A48EA006f5a2B5744fAFDa0dAe601C6E288716';
var receivingAddress = '0x43a232B81Ef2DC7219c625780dfDF5CB987e6333';

web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log);

// Create transaction
var rawTransaction = { 
	nonce: '0x01', 
	to: receivingAddress, 
	gasPrice: '0x4A817C800', 
	gasLimit: '0x6691B7', 
	value: '0x271'
}

// Sign Transaction
var privateKeySender  = new Buffer.from('05ebdf5e3f0a3cbbb7319329ae1612ed77a9d10ab0316644bd770d0831b43f6c', 'hex')
const tx = new EthereumTransaction (rawTransaction, { chain: 'mainnet', hardfork: 'petersburg' })
tx.sign(privateKeySender)
const serializedTransaction = tx.serialize()

// Send Transaction
web3.eth.sendSignedTransaction(serializedTransaction.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); 
});