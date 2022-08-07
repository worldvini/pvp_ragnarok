const home = {
    init: () => {
        fetch("../data/pvprank.json")
        .then( async response => response.json())
        .then( data => {
            home.ordenar(data);
            home.events();
        })
    },
    events: () => {
        $(".botao_historico").click(function(){
            const idClicado = $(this).attr("data-id");
            $(`#${idClicado}`).toggle();
        })
    },
    ordenar: (rank) => {
        const itens = Object.keys(rank)

        const rankArray = itens.map( item => {
            return rank[ item ];
        });

        const rankOrder = rankArray.sort(function(a, b){
            return a.rank - b.rank;
        });
        
        home.show(rankOrder);
    },
    show: (rank) => {
        const rankClone = Object.assign([], rank);
        while(rankClone.length){
            const rankItem = rankClone.shift();
            const htmlResponse = home.htmlPerson(rankItem);
            $("#tabela_rank").append( htmlResponse );
        }
    },
    htmlPerson: ( rankItem ) =>{
        const person = `
            <div class="tabela_rank__person ${rankItem.situation == 'up' ? 'background_green' : rankItem.situation == 'down' ? 'background_red' : 'background_blue'}">
                <div>
                    <table class="tabela_rank__person__table">
                        <tr>
                        <th>Rank</th>
                        <th>Nome</th>
                        <th>Pontuacao</th>
                        <th>Situacao</th>
                        <th>Classe</th>
                        <th>Clan</th>
                        </tr>
                        <tr>
                        <td>${rankItem.rank}</td>                        
                        <td>${rankItem.name}</td>
                        <td>${rankItem.score}</td>
                        <td>${rankItem.situation}</td>
                        <td>${rankItem.profession}</td>
                        <td>${rankItem.guildname}</td>
                        </tr>
                    </table>
                    <div class="tabela_rank__person_history">
                        <p class="botao_historico" id="botao_historico" data-id="${rankItem.charid}">Histórico</p>
                        <div class="tabela_rank__person_history__diario" id="${rankItem.charid}">
                            ${home.htmlHistory(rankItem.history)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return person;
    },
    htmlHistory: ( rankHistory ) => {
        let template = "";
        while ( rankHistory.length ){
            const history = rankHistory.pop();
            
            template = `
                ${template}
                <div class="info">
                    <div>Rank: ${history.rank}</div>
                    <div>Pontuacao: ${history.score}</div>
                    <div>Horario: ${new Date(history.timestamp)}</div>
                </div>
            `;
        }

        return template;
    }
}

function refreshPage(){
    location.reload()
}

home.init();
setInterval(refreshPage, 300000)