import MathContract from '../abis/MathContract.json'
import Token from '../abis/Token.json'
import CreateIPFSImage from './IPFSImage'
import Web3 from 'web3'

class Contracts 
{
    constructor() 
    {
        this.tokenContract = {};
        this.mathContract  = {};
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

    async load(mintedEventHandler) {
        const web3 = window.web3;
        if (!web3) {
            //todo
            return;
        }
        
        const networkId = await web3.eth.net.getId();
        
        // Get the current account
        const accounts = await web3.eth.getAccounts()
        this.account = accounts[0]
    
        // Load the Token contract
        const tokenData = Token.networks[networkId]
        if(tokenData) {
            this.tokenContract = new web3.eth.Contract(Token.abi, tokenData.address)
        } else {
            window.alert('Token contract not deployed to detected network.')
        }
    
        // Load the Math contract
        const mathData = MathContract.networks[networkId]
        if(mathData) {
            this.mathContract = new web3.eth.Contract(MathContract.abi, mathData.address)
        } else {
            window.alert('MathContract contract not deployed to detected network.')
        }

        // Subscribe to events
        this.tokenContract.events.Minted(
            { fromBlock: 'latest', filter: {addr: this.account} }, // show only events for this addr
            mintedEventHandler)
    }

    async getTokenBalance()
    {
        return await this.tokenContract.methods.balanceOf(this.account).call()
    }

    async getTokens()
    {
        // todo
        var t0 = window.performance.now()
        
        // Get the tokens in the account
        const tokensInAccount = []
        let tokenIds = await this.tokenContract.methods.getTokensInAddress(this.account).call()
        
        // todo
        var t1 = window.performance.now()
    
        for (const tokenId of tokenIds) {
            const token = await this.getToken(tokenId)
            tokensInAccount.push(token)
        }
    
        // todo
        var t2 = window.performance.now()
        
        console.log(`TIME getTokensInAddress():  ${t1 - t0} ms`)
        console.log(`TIME getToken() [several]:  ${t2 - t1} ms`)
    
        return tokensInAccount
    }

    async getToken(tokenId)
    {
        let value
        let tokenType = parseInt(await this.tokenContract.methods.getType(tokenId).call())
    
        if (tokenType === 0) {
            tokenType = "Op"
            const op = parseInt(await this.tokenContract.methods.getOperation(tokenId).call())
            value = this.getOpText(op)
            
        } else {
            tokenType = "Num"
            value = await this.tokenContract.methods.getNumber(tokenId).call()
        }
    
        const uri = await this.tokenContract.methods.tokenURI(tokenId).call()
        
        const token = {
            id:    tokenId,
            type:  tokenType,
            value: value,
            uri:   uri 
        }
    
        return token
    }

    getOpText(op)
    {
        if (op === 0) { return "+"; }
        else if (op === 1) { return "-"; }
        else if (op === 2) { return "*"; }
        else if (op === 3) { return "/"; }

        return "";
    }

    async mintNumberToken(number)
    {
        const uri = await CreateIPFSImage(number);
        if (!uri) {
          // TODO: take care of this error
          console.log("ERROR: GENERATING IMAGE FOR", number);
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
        const opText = this.getOpText(op)
        const uri = await CreateIPFSImage(opText);
        if (!uri) {
          // TODO: take care of this error
          console.log("ERROR: GENERATING IMAGE FOR", op);
          return;
        }

        // TODO: error check
        this.tokenContract.methods.mintOperation(this.account, uri, op)
          .send({ from: this.account })
            .on('transactionHash', (hash) => { 
              console.log("Minted: " + op)
            })
    }


}

export default Contracts;