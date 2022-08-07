const axios = require("axios");

class PoringApi{

    constructor(options){
        this.apiUrl = options.apiurl || "https://poring.world/api/";
        this.apiPath = options.apipath || "pvprank";
    }

    async ObterPvpRank( server = "GL1", season = 11 ){
        const querystring = `?server=${server}&season=${season}`;
        const url = `${this.apiUrl}${this.apiPath}${querystring}`;
        console.log("url: ", url)

        let response = [];

        await axios({
            method: "GET",
            url
        })
        .then(function({data}){
            response = data.rankings
        })
        .catch(function(error){
            console.log("errror". error)
            console.log("Ocorreu um erro ao tentar buscar informações do servidor");
        })

        return response;
    }
}

module.exports = PoringApi