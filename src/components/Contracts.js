import Expression from '../abis/Expression.json'
import Token from '../abis/Token.json'
import {CreateNumberOnIPFS, CreateOperationOnIPFS, GetImageUriFromJson} from './IPFSImage'
import Web3 from 'web3'

class Contracts 
{
    constructor() 
    {
        this.tokenContract = {};
        this.exprContract  = {};
        this.account       = "0x0";
    }

    async initWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
            return false;
        }
    }

    async load() {
        const web3 = window.web3;
        if (!web3) {
            //todo
            return;
        }
        
        const networkId = await web3.eth.net.getId();
        
        // Get the current account
        const accounts = await web3.eth.getAccounts();
        this.account = accounts[0];
    
        // Load the Token contract
        const tokenData = Token.networks[networkId];
        if(tokenData) {
            this.tokenContract = new web3.eth.Contract(Token.abi, tokenData.address);
        } else {
            window.alert('Token contract not deployed to detected network.')
        }
    
        // Load the Math contract
        const mathData = Expression.networks[networkId];
        if(mathData) {
            this.exprContract = new web3.eth.Contract(Expression.abi, mathData.address);
        } else {
            window.alert('Expression contract not deployed to detected network.');
        }
    }

    registerMintedEventHandler(mintedEventHandler) {
         // Subscribe to events
         this.tokenContract.events.Minted(
            { fromBlock: 'latest', filter: {addr: this.account} },
            mintedEventHandler);
    }   

    async getTokenBalance()
    {
        return await this.tokenContract.methods.balanceOf(this.account).call();
    }

    async getTokens()
    {
        const tokenInfos = await this.tokenContract.methods.getTokenInfos(this.account).call();
        const tokens = [];
        
        for (const tokenInfo of tokenInfos) {
            const op = parseInt(tokenInfo.operation);
            const type = op > 0 ? "Op" : "Num";
           
            let value;
            if (type === "Num") {
                value = parseInt(tokenInfo.number);
            } else {
                const ops = ['', '+', '-', '*', '/'];
                value = ops[op];
            }

            let imageUri = await GetImageUriFromJson(tokenInfo.uri)

            tokens.push({id:tokenInfo.id, type:type, value:value, uri:tokenInfo.uri, image:imageUri});
            
        }
        
        return tokens
    }

    async mintNumberToken(number)
    {
        const uri = await CreateNumberOnIPFS(number);
        if (!uri) {
            // TODO: take care of this error
            console.log("ERROR: GENERATING METADATA FOR", number);
            return;
        }

        // TODO: error check
        this.tokenContract.methods.mintNumber(this.account, uri, number)
            .send({ from: this.account })
                .on('transactionHash', (hash) => { 
                    console.log("Minted: " + number)
                });
    }

    async mintOpToken(op)
    {
        const uri = await CreateOperationOnIPFS(op);
        if (!uri) {
            // TODO: take care of this error
            console.log("ERROR: GENERATING METADATA FOR", op);
            return;
        }

        let opId
        if (op === '+') { opId = 1; }
        else if (op === '-') { opId = 2; }
        else if (op === '*') { opId = 3; }
        else if (op === '/') { opId = 4; }
        else {
            // TODO
            console.log("ERROR: INVALID OP:", op);
            return;
        }

        // TODO: error check
        this.tokenContract.methods.mintOperation(this.account, uri, opId)
            .send({ from: this.account })
                .on('transactionHash', (hash) => { 
                    console.log("Minted: " + op)
                })
    }

    async mintWithExpression(expression)
    {
        const number = await this.exprContract.methods.calculate(expression).call();

        const uri = await CreateNumberOnIPFS(number);
        if (!uri) {
            // TODO: take care of this error
            console.log("ERROR: GENERATING METADATA FOR", number);
            return;
        }

        // TODO: error check
        this.exprContract.methods.mint(uri, expression)
            .send({ from: this.account })
                .on('transactionHash', (hash) => { 
                    console.log("Minted: " + number)
                });
    }

}

export default Contracts;