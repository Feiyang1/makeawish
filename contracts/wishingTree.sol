pragma solidity ^0.4.2;

contract WishingTree {
    mapping (uint => string) messages;
    uint price = 1; // unit ether
    address public owner = msg.sender;
    
    function WishingTree() public {}
    modifier onlyBy(address _account) {require(msg.sender == _account);_;}
    
    function addMessage(uint idx, string message) payable public {
        if(msg.value >= price) {
            if (keccak256(messages[idx]) != keccak256("")) {
             // space is already taken
             return;
            }
            messages[idx] = message;
        }
    }
    
    function readMessage(uint idx) public returns(string) {
        return messages[idx];
    }
    
    function withdraw() public 
    onlyBy(owner) {
        owner.transfer(this.balance);
    }

}
