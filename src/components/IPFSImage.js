async function CreateIPFSNumber(number)
{
    console.log("Creating IPFS image for", number)

    //todo better image
    //todo separate image creation from ipfs upload
    var canvas = document.createElement('canvas');
    canvas.width  = 30;
    canvas.height = 30;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // even: green  odd: red
    if (number % 2 === 0) {
        ctx.fillStyle = "green";
    } else {
        ctx.fillStyle = "red";
    }        

    ctx.font = '20px Arial';
    ctx.textAlign = "center";
    ctx.fillText(number, 15, 20);
    const dataUrl = canvas.toDataURL()

    // TODO create json metadata and also add to ipfs
    // TODO detect errors / config 
    try {
        var dataUriToBuffer = require('data-uri-to-buffer');
        const buffer = dataUriToBuffer(dataUrl)
        const { create } = require('ipfs-http-client')
        const ipfs = create('https://ipfs.infura.io:5001')
        const { cid } = await ipfs.add(buffer)
        return `https://ipfs.infura.io/ipfs/${cid}`
    } catch(error) {
        console.log("IPFS ERROR:", error) // todo better error handling
    }
}

async function CreateIPFSOperation(op)
{
    console.log("Creating IPFS image for", op)

    //todo better image
    //todo separate image creation from ipfs upload
    var canvas = document.createElement('canvas');
    canvas.width  = 30;
    canvas.height = 30;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.font = '20px Arial';
    ctx.textAlign = "center";
    ctx.fillText(op, 15, 20);
    const dataUrl = canvas.toDataURL()

    // TODO create json metadata and also add to ipfs
    // TODO detect errors / config 
    try {
        var dataUriToBuffer = require('data-uri-to-buffer');
        const buffer = dataUriToBuffer(dataUrl)
        const { create } = require('ipfs-http-client')
        const ipfs = create('https://ipfs.infura.io:5001')
        const { cid } = await ipfs.add(buffer)
        return `https://ipfs.infura.io/ipfs/${cid}`
    } catch(error) {
        console.log("IPFS ERROR:", error) // todo better error handling
    }
}

export {CreateIPFSNumber, CreateIPFSOperation}