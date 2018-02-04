import getWeb3Instance from './web3';
import contract from 'truffle-contract';
import wishing_tree_artifacts from '../build/contracts/WishingTree.json';
import leaves from '../resources/word_groups.csv';
import trunk from '../resources/noun_441084_cc.svg';
import * as d3 from 'd3';

export function loadTreeTrunk() {
    return trunk;
}

export function loadLeavesConfiguration() {
    const colNames = "text,size,group\n" + leaves;
    const data = d3.csvParse(colNames);
    return data;
}

class Service {
    constructor() {
        this.web3 = getWeb3Instance();
        this.wishingTreeContract = this.initializeContract(wishing_tree_artifacts, this.web3.currentProvider);
        this.wishingTreeContract.setProvider(this.web3.currentProvider);

        this.account = null;
        this.account2 = null;

        // Get the initial account balance so it can be displayed.
        // getAccounts does not return promise, so we are hoping account becomes available before it is used.
        // probably should rewrite it so it's more reliable.
        this.web3.eth.getAccounts((err, accs) => {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            this.account = accs[0];
            this.account2 = accs[1];
        })
    }

    async getMessage(idx) {
        if (this.account === null) {
            throw Error('Account not avaialble!');
        }

        try {
            const instance = await this.getSmartContractInstance();
            const message = await instance.readMessage.call(idx, { from: this.account });
            return message;
        } catch (e) {
            console.error(e);
        }
    }

    async purchaseMessage(idx, msg) {
        const instance = await this.getSmartContractInstance();
        const tx = await instance.addMessage(idx, msg, { from: this.account, value: this.web3.toWei(1, "ether") });
        console.log(tx);
        return tx;
    }

    async withdraw() {
        const instance = await this.getSmartContractInstance();
        instance.withdraw({ from: this.account2 });
    }

    initializeContract(artifacts, provider) {
        const sc = contract(artifacts);
        sc.setProvider(provider);

        return sc;
    }

    async getSmartContractInstance() {
        if (this.instance) return this.instance;

        this.instance = await this.wishingTreeContract.deployed(); // cache
        return this.instance;
    }
}

export default new Service();
