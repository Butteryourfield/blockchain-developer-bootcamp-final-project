## blockchain-developer-bootcamp-final-project

PS. I understand I am late in submitting the final project, and am at peace with whatever is decided by the marker! Thanks

# Laugh Alottery 
### *because laughter is the language of joy *

## Project Description

For this project I decided to create a raffle based lottery where users could buy a number of tickets at a specified price. What they paid for the tickets would go into the Jackpot, and in return they would get a ticket number for each ticket purchased... After a certain period of time (up to the owner at the moment) the owner of the contract can decide to end the lottery, in so doing calling a function to randomise a number from the list of ticket numbers and whoever holds that ticket number (linked to the address they bought the tickets) would recieve the Jackpot prize in their account - with a 1% commision fee remaining in the contract to pay for the owners deployment gas and hard work...(Y)
The user interface would remain with the winner decleration on for a period of time, again up to the owner, before the owner initiates a self destruct command, destroying the contract, and sending any remaining (1%) balance to the owners account

I realise this setup has a number of implications, some noteable ones being that for the users to be keen to participate, the owner needs to be a trustworthy party... or else all sorts of problems could arise, from the owner not issuing winner declaration commands to them buying tickets themselves and attempting to predict the randomised number (as the owner gets to pick a ideally spontaneous nonce to be used in the random num generator)
The implementation of the code is rudimentary and could be a lot more organised and concise for sure, but it works and serves as a proof of concept, hopefully being an adequate project for this course aswell...

## How to Install

0. Requires Node/npm installed (my version is `v16.13.1`)
1. Clone this repository to your local device
2. Install truffle and ganache globally (using `npm install -g ganache-cli`, `npm install -g truffle`)
3. Navigate to and run npm install in both the folders 'client' (frontend) and 'truffle' (smart contracts)

## How to Run

0. Open 3 terminal windows (1. 'any global' directory 2. 'truffle' directory, 3. 'client' directory)
1. Start a local blockchain on the port 8545 by using the `ganache-cli` command in terminal (this should automatically start a localhost:8545 blockchain from the truffle-config.js).
2. In the truffle directory, run `truffle migrate --network development` (use tag `--reset` if redeploying) to compile and deploy the contracts to the running local blockchain.
3. In the client directory enter command `npm run start`, and you browser (gchrome for me) should automatically open up the user interface (it may take a little bit of time and a few refreshes before it grabs data from the contract)
4. Also make sure that metamask is running on the localhost:8545 network - use the ganache-cli memnomic to import test account into metamask (be aware account 1 will likely be the owner account)

## How to Interact

If no account is connected, clicking 'Connect MetaMask' will open up a metamask window where you can connect multiple accounts - note only the current account will be able to send transactions and if you want to switch accounts you must do so in the metamask extension and then press 'Connect MetaMask' again in order to selecet that account on the interface.
Users can increase/decrease the amount of tickets they would like using the buttons, the price automatically calculated, and when they are happy with it, can click submit, opening metamask transaction confirmation window
Once the transaction is sent the user should see there transaction processed succesfully and recieve a notification under the submit button with the details of their entry (including ticket numbers)

To end the lottery and declare a winner, from the owner account selected a nonce value is randomly chosen by the owner to help generate stronger randomness, and then the button 'END LOTTERY ABD DECLARE WINNER' can be pressed
The lottery will determine a winne, send 99% of the Jackpot to that address, display their public details on the interface, and wait for the next command

To finish, after a period of time the owner can call the Self Destruct function by pressing the 'Self Destruct' Button... This destroys the contract, releases all the contracts data from the interface, and sends all remaming contract balance (1% jackpot) to the owners address

Redeploy contract to start again! - Can also change the ticket price with the raffleLottery.sol contract constructor

## Directory Structure

*`/client/` - Frontend stuff
- App.js one page interface that is updated depending on 3 main lottery states
- `/src/contracts/` stores the ABI formats of the contracts

*`/truffle/` - All the smart contract/solidity stuff
- One contract in raffleLottery.sol
- `/test/` tests folder... with nothing in it atm...
