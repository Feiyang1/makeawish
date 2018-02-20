import getWeb3Instance from './web3';
import contract from 'truffle-contract';
import wishing_tree_artifacts from '../build/contracts/WishingTree.json';
import * as d3 from 'd3';

class Service {
    constructor() {
        this.web3 = getWeb3Instance();
        this.wishingTreeContract = this.initializeContract(wishing_tree_artifacts, this.web3.currentProvider);
        this.account = null;
    }

    initAccount() {
        return new Promise((resolve, reject) => {
            this.web3.eth.getAccounts((err, accs) => {
                if (err != null) {
                    alert("There was an error fetching your accounts.");
                    reject();
                    return;
                }
    
                if (accs.length == 0) {
                    alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    reject();
                    return;
                }
    
                this.account = accs[0];
                resolve(this.account);
            });
        });
    }

    async getMessage(idx) {

        console.log(await this.getOwner());
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
        instance.withdraw({ from: this.account });
    }

    async getOwner() {
        const instance = await this.getSmartContractInstance();
        return await instance.getOwner.call();
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
