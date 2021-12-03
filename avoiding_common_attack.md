# Avoiding Common Attack

I ran a MythX scan of the contract raffleLottery.sol and it came back with the following

0 High, 1 Medium, 7 Low - Vulnerabilities

SWC-104 - Medium Risk - To do with sending the lottery winner their prize - Unchecked return value from low-level external call - So I must implement a callback to check wether an exception was raised or not etc...

SWC-107 x6 - Low Risk - Read/Write of persistent state following external call - To fix need to read/write before external calls so that it negates the possibility of a reentrancy attack

SWC-108 - Low Risk - State variable visibility is not set - Must explicity state wether or not the mapping 'entries' is visible or not with private/public etc...

I use OpenZepplin Library to set owner of contract and only allow owner to exectue certain functions
Do not use tx.origin as it might be taken advantage of