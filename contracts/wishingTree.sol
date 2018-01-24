pragma solidity ^0.4.2;

contract WishingTree {
    mapping (uint => string) messages;
    uint price = 1; // unit ether
    address public owner = msg.sender;
    
    function WishingTree() public {}modifier onlyBy(address _account) {require(msg.sender == _account);_;}
    
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
    
    function readMessages() public {}
    
    // event Transaction(string _type, address indexed user);
    // function StockExchange() {
        // holdings = 10000;
        // }
        // function buy() payable {
            // if(msg.value == 1 ether) {
                // balances[msg.sender] += 1;
                // holdings -= 1;
                // Transaction(\"Buy321\",msg.sender);
                // }
                // }
                // function sell() {
                    // balances[msg.sender] -= 1;
                    // holdings += 1;
                    // msg.sender.transfer(1 ether);
                    // Transaction(\"Sell\",msg.sender);
                    // }
                    // function getBalance(address addr) returns(uint) {
                        // return balances[addr];
                        // }
                        // function getHoldings() returns(uint) {
                            // return holdings;
                            // }
}
