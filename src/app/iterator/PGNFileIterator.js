import { parse }  from '../PGNParser'
import * as Constants from '../Constants'
import {trackEvent} from '../Analytics'
import {normalizePGN} from './IteratorUtils'
import {trimString} from '../Common'

export default class PGNFileIterator {

    constructor(playerName, files, playerColor, advancedFilters, ready, showError) {
        files.forEach((file)=>{
            let reader = this.setupReader(playerName, playerColor, advancedFilters, ready, showError)
            reader.readAsText(file)
        })
    }

    setupReader(playerName, playerColor, advancedFilters, ready, showError) {
        const isDanielJames = (name) =>
            name === "danieljames-dj" || name === "Daniel James";
        let reader = new FileReader()
        let playerColorHeaderName = playerColor === Constants.PLAYER_COLOR_WHITE? 'White': 'Black'
        let lowerCasePlayerName = playerName? playerName.toLowerCase() : null
        reader.onload = function(evt) {
            let fileData = normalizePGN(evt.target.result);
            let pgnsArray = fileData.split("\n\n\n")

            let parsedPGNs = pgnsArray.map((pgnString)=> {
                try {
                    // This line is to remove comments from PGN because some PGN are having double comments and it's throwing error
                    let parsedPGN =  parse(trimString(pgnString).replace(/ *\{[^}]*\} */g, " "))[0]
                    
                    let playerColorHeaderValue = parsedPGN.headers[playerColorHeaderName]
                    if(playerName && playerColorHeaderValue && !isDanielJames(playerColorHeaderValue)) {
                        // filter out games not from selected player
                        return null
                    }
                    return parsedPGN
                } catch (e) {
                    console.log("failed to parse pgn", pgnString)
                    console.log(e)
                    trackEvent(Constants.EVENT_CATEGORY_ERROR, "parseFailedPGNFile", playerName)
                    return null
                }
            })
            ready(parsedPGNs.filter(pgn=>!!pgn), true)
        };
        reader.onerror = function(e) {
            showError("Failed to load pgn file", null, e.target.error.name+":"+e.target.error.message)
            ready([], false)
        }
        reader.onloadend = function() {
            ready([], false)
        }
        return reader
    }
}
