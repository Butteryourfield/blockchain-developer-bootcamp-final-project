pragma solidity ^0.8.10;

contract raffleLottery {
    // Owner address of the lottery contract
    address public owner;

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
    Player public winner;
    bool public isLotteryLive;

    // Modifiers
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    // Events
    event winnerDeclared(uint entryNumber, address playerAddress, uint jackpotTotal);
    event playerEntered(address playerAddress, uint numEntries);
    // testing if there will be a difference between running jackpot total and this.balance at the end
    event discrepencyTest(uint discrepency);

    // constructor
    constructor () public {
        // Set the owner of contract to the transaction sender/deployer
        owner = msg.sender;
        // name of lottery
        lotteryName = "Laugh Alottery";
        // ticket price
        ticketPrice = 1 ether;

        // Initialise at 1, first entry, so can be randomised between 1 and xxxx
        entryCount = 1;

        // Would default to 0 probs but good for clarity
        jackpotTotal = 0;

        // lottery is live when contract is created
        isLotteryLive = true;
    }

    // Fallback function reverting tx if invalid data/function called
    fallback() external payable {
        revert();
    }

    function enterLottery(uint numEntries) public payable {
        // Make sure a valid entry number is stated
        require(numEntries > 0);
        // Make sure the value of tx equals num entried * the price 
        // if not then something gone wrong... revert... maybe someone hacked the frontend??
        require(msg.value == numEntries*ticketPrice);
        // Make sure lottery is live before tx processed
        require(isLotteryLive);

        for (uint i = entryCount; i < entryCount+numEntries; i++) {
          entries[i].playerAddress = payable(msg.sender);
        }
    
        entryCount += numEntries;
        jackpotTotal += msg.value;
    
        // event
        emit playerEntered(msg.sender, numEntries);
    }

    function declareWinner() public isOwner {
        // for testing
        uint discrepency = jackpotTotal - address(this).balance;
        emit discrepencyTest(discrepency);

        // % of jackpot to winner
        // jackpotTotal = 0.999*address(this).balance;
        jackpotTotal = address(this).balance;

       
        // generate random entry number between 1 -> entryCount
        uint randomEntryNumber = generateRandomNumber();
    
        entries[randomEntryNumber].playerAddress.transfer(jackpotTotal);

        // Mark the lottery inactive
        isLotteryLive = false;
    
        // event
        emit winnerDeclared(randomEntryNumber, entries[randomEntryNumber].playerAddress, jackpotTotal);
        
        // owner commision
        // address payable _owner = owner;
        selfdestruct(payable(owner));
    }

    // when starting this project i didnt think about the nature of randomising numbers on the blockchain
    // now i see there are some limiting factors that make it hard to fairly randomise on the blockchain
    // Anyone who figures out how your contract produces randomness can anticipate its results and use this information to exploit your app
    // like malicious actors could predict the parameters used to randomise and gain an unfair advantage possibly
    // and randomising using complex algorithms takes to much computational power so is not viable on the network
    // Unless a portion of the jackpot goes to gas fees to do just that!
    
    function generateRandomNumber() private view returns(uint) {
        // found this new looking method for generating a somewhat random numero
        // still uses block timestamp which could be a method of attack for a malicious miner
        uint randNonce = 0;
        randNonce++; 
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % entryCount;
    }
}