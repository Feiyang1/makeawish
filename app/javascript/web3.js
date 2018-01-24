import Web3 from 'web3';

export default function getWeb3Instance() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        return new Web3(web3.currentProvider);
    } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        return new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
};