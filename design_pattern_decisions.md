# Design Patterns

* Inheritance and interfaces: 
- The project contract imports `Ownable.sol` from OpenZeppelin library.
- The testing scripts using the test tools from OpenZepplin library, namely the expectRevert function

# Access Control Pattern
- Adds restrictions to calling function 'declareWinner' by using modifiers (`onlyOwner`) from the imported `Ownable` contract
- Also restriction on the owner to entering the lottery as this would cause an unfair advantage... though of course the owner could just enter from a different address easily... - but using a locally made modifier for this , not openZepplin


