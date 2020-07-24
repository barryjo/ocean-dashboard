import StandaloneSearchBox from 'react-google-maps/lib/components/places/StandaloneSearchBox'

let moment = require('moment')

let serverUrl = process.env.REACT_APP_SERVER_URL
let aquariusBaseUrl = "https://aquarius.pacific.dev-ocean.com/api/v1/aquarius/assets/ddo/query"
let myId = process.env.REACT_APP_MY_ID
let maxTxs = process.env.REACT_APP_MAX_TX_LIMIT

async function getAllApps() {
    let resp = await fetch(serverUrl)
    let data = await resp.json()
    console.log(data)
    return data
}

async function getAllTxs() {
    //get all tx data
    let resp = await fetch(aquariusBaseUrl + `?text=${myId}&offset=${maxTxs}`)
    let data = await resp.json()
    console.log(data)
    return data
}


export async function getAllStats() {
    let stats = {}
    let apps = await getAllApps()


    let results = await getAllTxs()

    //total txs
    stats.totalTxs = results['total_results']


    let users = await Promise.all(results['results'].map(res => {
        return res.publicKey[0].owner
    }))

    //total users
    stats.totalUsers = users.length

    let uniqueUsers = users.filter(onlyUnique)

    //unique users
    stats.uniqueUsers = uniqueUsers.length

    //get time based tx
    let chartData = await getTimebasedTxs(results['results'])
    stats.txChartData = chartData
    console.log(chartData)

    //app details
    stats.apps = await Promise.all(apps.apps.map(async app => {
        let txCount = await getTxsPerApp(app.appid, results['results'])
        return {
            id: app.appid,
            name: app.name,
            homepage: app.homepage,
            txs: txCount
        }
    }))

    //total apps
    stats.totalApps = apps.apps.length

    return stats
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

async function getTimebasedTxs(txs) {
    var txHistory = {
        labels: [
            "3:00AM",
            "6:00AM",
            "9:00AM",
            "12:00AM",
            "3:00PM",
            "6:00PM",
            "9:00PM",
            "12:00PM"
        ],
        series: []
    };

    var h3 = 0, h6 = 0, h9 = 0, h12 = 0, h15 = 0, h18 = 0, h21 = 0, h24 = 0
    let yesterday = moment.utc().subtract(24, "hours");
    await Promise.all(txs.map(tx => {
        let date = moment.utc(tx['created'])
        if (date.isAfter(yesterday)) {
            let hour = date.get('hour')
            if (hour >= 0 && hour < 3) {
                h3++
            } else if (hour >= 3 && hour < 6) {
                h6++
            } else if (hour >= 6 && hour < 9) {
                h9++
            } else if (hour >= 9 && hour < 12) {
                h12++
            } else if (hour >= 12 && hour < 15) {
                h15++
            } else if (hour >= 15 && hour < 18) {
                h18++
            } else if (hour >= 18 && hour < 21) {
                h21++
            } else if (hour >= 21 && hour <= 23) {
                h24++
            }
        }


    }))
    //push txs to time series
    txHistory['series'].push([h3, h6, h9, h12, h15, h18, h21, h24])

    return txHistory
}

async function getTxsPerApp(appId, txs) {
    let filteredTxs = txs.filter(tx => {
        console.log(tx['service'][0])
        return tx['service'][0]['attributes']['additionalInformation']['appId'] == appId
    })
    return filteredTxs.length
}