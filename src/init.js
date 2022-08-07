const fs = require("fs");

const PoringApi = require("./poring_api");

async function buscandoEternamente (){    
    const poringApi = new PoringApi( {} );

    console.log("iniciando processo de rank pvp");
    const resultado = await poringApi.ObterPvpRank();

    const date = new Date();
    const timeNow = date.getTime();
    const dia = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
    const mes = ( date.getMonth() + 1 ) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const ano = date.getFullYear();
    const fulldate = `${ano}-${mes}-${dia}`;

    console.log("recuperando dados de rank local");
    let pvprank = {}
    fs.readFile('./data/pvprank.json', (err, data) => {
        if (err) throw err;
        
        pvprank = JSON.parse(data);
        
        console.log("atualizando dados de rank com dados da api poring world");

        while( resultado.length ){
            const rankPerson = resultado.shift();
    
            if( !pvprank[rankPerson.charid] ){
                const padrao = {            
                    name: rankPerson.name,
                    rank: rankPerson.rank,
                    score: rankPerson.score,
                    erank: rankPerson.erank,
                    profession: rankPerson.profession,
                    professionIcon: rankPerson.professionIcon,
                    charid: rankPerson.charid,
                    level: rankPerson.level,
                    guildname: rankPerson.guildname,
                    situation: "same",
                    history: [{rank: rankPerson.rank, score: rankPerson.score, timestamp: timeNow}]
                }
    
                pvprank[rankPerson.charid] = padrao;
            }
            
            if( pvprank[ rankPerson.charid ].rank != rankPerson.rank || pvprank[ rankPerson.charid ].score != rankPerson.score ){
                pvprank[ rankPerson.charid ]['situation'] =  pvprank[ rankPerson.charid ]['rank'] > rankPerson.rank ? "down" : pvprank[ rankPerson.charid ]['rank'] < rankPerson.rank ? "up" : "same";
                pvprank[ rankPerson.charid ]['rank'] = rankPerson.rank;
                pvprank[ rankPerson.charid ]['score'] = rankPerson.score;
                pvprank[ rankPerson.charid ]['history'].push( {rank: rankPerson.rank, score: rankPerson.score, timestamp: timeNow } );
            }
        }
    
        console.log("Atualizando rank local - reescrevendo arquivo");
        const newRank = JSON.stringify(pvprank);
        fs.writeFileSync('./data/pvprank.json', newRank);
        console.log("processo finalizado com sucesso");
    });
}

buscandoEternamente()
setInterval(buscandoEternamente, 30000)

