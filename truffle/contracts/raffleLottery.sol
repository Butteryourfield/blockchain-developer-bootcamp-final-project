// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
// use single pragma version for security

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract raffleLottery is Ownable {
    // Owner address of the lottery contract through OpenZepplin

    // name of the lottery
    string public lotteryName;
    // ticket price
    uint public ticketPrice;
    // Running entry count
    uint public entryCount;
    // Running jackpot Total
    uint public jackpotTotal;

    // variables for players - player can enter name they choose... add name checking function if so)
    struct Player {
        // string name;
        address payable playerAddress;
    }
    
    // simple with no player name
    // create mapping of raffle ticket number -> player address
    mapping(uint => Player) entries;

    // Variables for lottery information
    bool public isLotteryLive; // inactive/active undeployed/deployed
    bool public hasLotteryEnded; // used for when a winner is declared on the deployed contract

    address public winnerAddress;
    uint public winnerEntryNumber;
    uint public winnerPrize;

    // Modifiers
    // only owner can declare winner
    // modifier isOwner() {
    //     require(msg.sender == owner);
    //     _;
    // }
    // Open Zepp ownable used

    // owner not allowed to enter lottery (as when they choose the randNonce in declareWinner they could use it advantageously)
    // ofc the owner could enter lottery from other accounts they have the private key too... this is a problem and requires trust
    modifier isNotOwner() {
        require(msg.sender != owner());
        _;
    }

    // Events
    event runningJackpotTotal(uint jackpotTotal);
    event runningEntryCount(uint entryCount);
    event lotteryActive(bool isLotteryLive);
    // enterLottery event
    event playerEntered(address playerAddress, uint numEntries, uint[] raffleNumbers);
    // declareWinner event
    event winnerDeclared(uint entryNumber, address playerAddress, uint jackpotTotal);
    // testing if there will be a difference between running jackpot total and this.balance at the end
    event discrepencyTest(uint discrepency);
    // event for testing num gen function
    event randomNumGen(uint randomNum);

    // constructor
    constructor () public {
        // name of lottery
        lotteryName = "Laugh Alottery";
        // ticket price
        ticketPrice = 1 ether;

        entryCount = 1; // initialise at 1, because we dont want a raffle ticket number of 0
        // Would default to 0 probs but good for clarity
        jackpotTotal = address(this).balance * 99 / 100;
        // 1% of jackpot goes to owner for delpoyment gas fees
        // Could build a contract that doesnt need to be redeployed from scratch
        // one that can initiate the lottery from the existing deployed contract

        // lottery is live when contract is created
        isLotteryLive = true;
        hasLotteryEnded = false;

        // For front end updates
        emit lotteryActive(isLotteryLive);
        emit runningEntryCount(entryCount);
        emit runningJackpotTotal(jackpotTotal);
    }

    // Fallback function reverting tx if invalid data/function called
    // so eth is only sent to contract via enterLottery function
    fallback() external payable {
        revert();
    }

    function enterLottery(uint numEntries) public payable isNotOwner {
        // Make sure a valid entry number is stated
        require(numEntries > 0);
        // require(numEntries < 30);
        // Make sure the value of tx equals num entried * the price 
        // if not then something gone wrong... revert... maybe someone hacked the frontend??
        require(msg.value == numEntries*ticketPrice);
        // Make sure lottery is live before tx processed
        require(isLotteryLive);

        // Temporay array to gather and emit the raffle ticket numbers of the player
        uint[] memory raffleNumbers = new uint[](numEntries);
        uint raffleNumberIndex = 0;

        for (uint i = entryCount; i < entryCount+numEntries; i++) {
          // ____________________________
          // entryCount += 1;
          // ^^^^^^^^^^^^^^^^^^^^^ this line
          // FOR ANYONE LOOKING AT MY CODE, i feel like you should know that i spent 
          // the better part of 2 days glued to my screen looking for a bug that i could not find
          // I resorted to resetting my computer to factory settings and reinstalling everything again
          // Little did i know the problem lay in this one little line of code
          // effectively transforming this for loop into an infinite one...
          // NO WONDER... well i guess i have now without a doubt learnt the hard way
          // I ALSO MUST THANK REMIX BECAUSE THAT IS HOW I REALISED!

          raffleNumbers[raffleNumberIndex] = i;
          raffleNumberIndex += 1;

          entries[i].playerAddress = payable(msg.sender);
        }

        entryCount += numEntries; // quick fix...
        // and whats even funnier, is that this was the inital method
        // and for some odd reason i implemented it in the for loop afterward

        jackpotTotal = address(this).balance * 99 / 100;
        // 99% of total balance is the prize
        // remaining balance goes to owner...
        // seems like its easy to create a lottery without commision so user
        // may be less inclined to use a lottery with owner commision
        // unless the commission goes to a good cause or something like a charitbale donation
        // commission for owner if the owner is trusted by the people entering lottery...
    
        // For front end updates
        // events for user confirmation
        emit playerEntered(msg.sender, numEntries, raffleNumbers);
        emit runningEntryCount(entryCount);
        emit runningJackpotTotal(jackpotTotal);
    }

    function declareWinner(uint randNonce) public onlyOwner {
        // Mark the lottery inactive so no more entries
        isLotteryLive = false;
        hasLotteryEnded = true;

        // For final front end lottery variable display updates
        emit lotteryActive(isLotteryLive); // to show on frontend lottery has finished
        emit runningEntryCount(entryCount);
        emit runningJackpotTotal(jackpotTotal);

        // for personal testing see if any discrepency
        // uint discrepency = jackpotTotal - address(this).balance;
        // emit discrepencyTest(discrepency);

        // between 1 and entryCount
        uint randomEntryNumber = generateRandomNumber(randNonce);
    
        entries[randomEntryNumber].playerAddress.call{value: jackpotTotal}("");
        
        winnerAddress = entries[randomEntryNumber].playerAddress;
        winnerEntryNumber = randomEntryNumber;
        winnerPrize = jackpotTotal;
    
        // winner declartion for updating front end with winner details...
        emit winnerDeclared(randomEntryNumber, entries[randomEntryNumber].playerAddress, jackpotTotal);
    }

    function selfDestruct() public onlyOwner {
        require(!isLotteryLive);

        // Self destruct contract after winner has been sent prize, and remaining balance goes to owner
        // TIMER TO DESCRUCT??
        selfdestruct(payable(owner()));
    }

    // when starting this project i didnt think about the nature of randomising numbers on the blockchain
    // now i see there are some limiting factors that make it hard to fairly randomise on the blockchain
    // Anyone who figures out how your contract produces randomness can anticipate its results and use this information to exploit your app
    // like malicious actors could predict the parameters used to randomise and gain an unfair advantage possibly
    // and randomising using complex algorithms takes to much computational power so is not viable on the network
    // Unless a portion of the jackpot goes to gas fees to do just that!
    
    // generate random entry number between 1 -> entryCount
    // -1 so that the entry number 0 can win the prize if minimum random number is 1...
    // owner Declares winner and can choose a random nonce for generator function so cannot be predicted by anyone
    // although owner could be malicious... and buy tickets and specify a nonce for their own gain
    // Owner priveledges could be set to multiple accounts aswell so that the 'msg.sender' input
    // in the generator function cannot be predicted...
    // since owner initiates the declareWinner function the block timestamp cannot be predicted i think?
    // all of this relies on the owner being trustworthy and transparent...

    function generateRandomNumber(uint randNonce) private view returns(uint) {
        // found this new looking method for generating a somewhat random numero
        // still uses block timestamp which could be a method of attack for a malicious miner
        randNonce++; 
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % entryCount;
    }

    // testing random number generator function 
    function generateRandomNumberTest(uint randNonce, uint entryCountTest) public onlyOwner {
        randNonce++; 
        uint randomNum = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % entryCountTest;
        emit randomNumGen(randomNum);
    }
}