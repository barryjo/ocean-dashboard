let axios = require('axios')

let myId = "ocean-dashboard"

let appIds = [
    "9426f76049a3-11ea-85c4-ed8ed4870d2e",
    "689cd3f04ca3-11ea-bd5e-2dcfa713062e",
    "46b5bb704cb8-11ea-8f85-f1f994c3e844",
    "172de5504cca-11ea-a871-5ddecf215be6",
    "ce15a0504cca-11ea-bd68-ad59ee94b884",
    "92db0bd04cd7-11ea-bd68-ad59ee94b884",
    "0c3247504cd8-11ea-bd68-ad59ee94b884",
    "0a540a104cdb-11ea-bd68-ad59ee94b884",
    "6b748a904cdb-11ea-bd68-ad59ee94b884",
    "c84909804cdb-11ea-bd68-ad59ee94b884",
    "c610ec704cde-11ea-baa0-c9820a9bc768",
    "eb26ca204cde-11ea-baa0-c9820a9bc768",
    "4f813ff04cdf-11ea-baa0-c9820a9bc768",
    "32813ff04cdf-11ea-baa0-c982129bc768",
    "2dc7cf1054b3-11ea-bb5d-0ff3b0aa1ae8"]

function preparePublishData(i) {
    let data = {
        "publisher": "",
        "metadata": {
            "main": {
                "name": "Ocean Whitepaper",
                "dateCreated": `2020-07-23T12:58:58Z`,
                "author": "author",
                "license": "Apache 2.0",
                "price": "0",
                "files": [
                    {
                        "index": 0,
                        "contentType": "application/file",
                        "checksum": "2bf9d229d110d1976cdf85e9f3256c7f",
                        "checksumType": "MD5",
                        "contentLength": "15357507",
                        "compression": "pdf",
                        "encoding": "UTF-8",
                        "url": "https://oceanprotocol.com/tech-whitepaper.pdf"
                    }
                ],

                "type": "dataset"
            },
            "additionalInformation": {
                "platformId": "1234D3aD410E64e1456A5Bb91B6085D9720345",
                "appId": `${appIds[Math.floor(Math.random() * appIds.length)]}`,
                "checksum": "",
                "categories": [],
                "tags": [
                    "gitcoin-bounty"
                ],
                "description": "Ocean White Paper",
                "copyrightHolder": "None",
                "workExample": "image path, id, label",
                "links": [],
                "inLanguage": "en"
            }
        }
    }
    return data
}

async function publishToOcean(i) {
    try {

        let data = preparePublishData(i)
        let resp = await axios(
            {
                method: 'post',
                url: "https://agent.oceanprotocol.com/api/general/publishddo",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                data
            });

        if (resp.status != 200) {
            return null;
        }

        let did = resp.data;
        console.log(did);
        return did;
    } catch (err) {
        console.error(err.message);
        return null;
    }

}

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}


async function loopIt() {
    var i = 0
    while (i < 10) {
        let did = await publishToOcean(i)
        console.log(`${i} = ${did}`)
        await sleep(5)
        i++
    }
}

loopIt()