async function CreateIPFSImage(value)
{
    console.log("Creating IPFS image for", value)

    //todo better image
    //todo separate image creation from ipfs upload
    var canvas = document.createElement('canvas');
    canvas.width  = 30;
    canvas.height = 30;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // even: blue  odd: green
    if (value === "+" || value === "-" || value === "*" || value === "/") {
        ctx.fillStyle = "blue";
    } else if (value % 2 === 0) {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = "green";
    }        
    ctx.font = '20px Arial';
    ctx.textAlign = "center";
    ctx.fillText(value, 15, 20);
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

export default CreateIPFSImage;