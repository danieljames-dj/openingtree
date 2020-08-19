import request from 'request'
import * as Common from './Common'

export function fetchBookMoves(fen, variant, ratings, speeds, callback) {
    let url = `https://explorer.lichess.ovh/master?fen=${fen}&play=&variant=${Common.lichessPerf(variant)}${joinParams('ratings',ratings)}${joinParams('speeds',speeds)}`
    request.get(url, (error, response) =>{
        if(error) {
            callback("error")
            return 
        }
        try{
            callback(JSON.parse(response.body))
            return
        } catch (e) {
            console.log(e)
        }
        callback("error")
    })
    //https://explorer.lichess.ovh/lichess?fen=rnbqkbnr%2Fpppppppp%2F8%2F8%2F8%2F8%2FPPPPPPPP%2FRNBQKBNR%20w%20KQkq%20-%200%201&play=&variant=kingOfTheHill&speeds%5B%5D=bullet&speeds%5B%5D=blitz&speeds%5B%5D=rapid&speeds%5B%5D=classical&ratings%5B%5D=1600&ratings%5B%5D=1800&ratings%5B%5D=2000&ratings%5B%5D=2200&ratings%5B%5D=2500

}

function joinParams(paramName, ratings) {
    return ratings.map(r=>`&${paramName}[]=${r}`).join('')
}