async function _DownloadJSON(jsonUri)
{
    const response = await fetch(jsonUri);
    const jsonData = await response.json();
    return jsonData;
}

async function _UploadToIPFS(buffer) {
    try {
        const { create } = require('ipfs-http-client');
        const ipfs = create('https://ipfs.infura.io:5001');
        const { cid } = await ipfs.add(buffer);
        return `https://ipfs.io/ipfs/${cid}`;
    } catch(error) {
        console.log("IPFS ERROR:", error) // todo better error handling
    }
}

function _IsPrime(number)
{
    for(var i = 2; i < number; i++)
        if(number % i === 0) return false;
    return number > 1;
}

function _CreateNumberJSON(number, imageUri) 
{
    const jsonContent = {
        name:`ArithmeToken Number ${number}`,
        description:`This token represents the number ${number}.`,
        external_url:'http://www.arithmetoken.org',
        image:imageUri,
        attributes: [
            {
                trait_type: "Number", 
                value: number
            },
            {
                trait_type: "Odd or Even", 
                value: number % 2 === 1? "Odd" : "Even"
            },
            {
                trait_type: "Odd or Prime", 
                value: _IsPrime(number)
            }
        ]
    };

    return JSON.stringify(jsonContent);
}

function _CreateOperationJSON(op, imageUri) 
{
    const jsonContent = {
        name:`ArithmeToken Operation ${op}`,
        description:`This token represents the "${op}" arithmetic operation.`,
        external_url:'http://www.arithmetoken.org',
        image:imageUri,
        attributes: [
            {
                trait_type: "Operation", 
                value: op
            }
        ]
    };

    return JSON.stringify(jsonContent);
}

function _CreateNumberImage(number)
{
    //todo better image
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
    
    // Return an image buffer
    var dataUriToBuffer = require('data-uri-to-buffer');
    return dataUriToBuffer(canvas.toDataURL());
}

function _CreateOperationImage(op)
{
    //todo better image
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

    // Return an image buffer
    var dataUriToBuffer = require('data-uri-to-buffer');
    return dataUriToBuffer(canvas.toDataURL());
}

async function CreateNumberOnIPFS(number)
{
    console.log("Creating IPFS image for", number)
    
    // TODO detect errors / config 
    // Image
    const imageBuffer = _CreateNumberImage(number);
    let imageUri = await _UploadToIPFS(imageBuffer)

    // Json
    const jsonString = _CreateNumberJSON(number, imageUri);
    const jsonBuffer = Buffer.from(jsonString, 'utf8');
    return await _UploadToIPFS(jsonBuffer);
}

async function CreateOperationOnIPFS(op)
{
    console.log("Creating IPFS image for", op)
    
    // TODO detect errors / config 
    // Image
    const imageBuffer = _CreateOperationImage(op);
    const imageUri = await _UploadToIPFS(imageBuffer)
    console.log("Created image on IPFS:", imageUri)

    // Json
    const jsonString = _CreateOperationJSON(op, imageUri);
    const jsonBuffer = Buffer.from(jsonString, 'utf8');
    const jsonUri = await _UploadToIPFS(jsonBuffer);
    console.log("Created JSON on IPFS:", jsonUri)

    return jsonUri;
}

async function GetImageUriFromJson(jsonUri)
{
    const jsonData = await _DownloadJSON(jsonUri)
    return jsonData.image
}

export {CreateNumberOnIPFS, CreateOperationOnIPFS, GetImageUriFromJson}