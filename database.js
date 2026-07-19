// =======================================================
// TMLFE DATABASE
// Trade Machine Liga Franquicia Extraditables
// Base de datos principal
// =======================================================

const TMLFE = {

    version: "1.0",

    season: "2026/27",

    salaryCap: 155000000,

    tradeHistory: [],

    teams: [],

    players: []

};


// =======================================================
// FRANQUICIAS
// =======================================================

TMLFE.teams = [

    { id: 1, name: "Boston Celtics", short: "BOS", conference: "Este" },
    { id: 2, name: "Brooklyn Nets", short: "BKN", conference: "Este" },
    { id: 3, name: "New York Knicks", short: "NYK", conference: "Este" },
    { id: 4, name: "Philadelphia 76ers", short: "PHI", conference: "Este" },
    { id: 5, name: "Toronto Raptors", short: "TOR", conference: "Este" },

    { id: 6, name: "Chicago Bulls", short: "CHI", conference: "Este" },
    { id: 7, name: "Cleveland Cavaliers", short: "CLE", conference: "Este" },
    { id: 8, name: "Detroit Pistons", short: "DET", conference: "Este" },
    { id: 9, name: "Indiana Pacers", short: "IND", conference: "Este" },
    { id: 10, name: "Milwaukee Bucks", short: "MIL", conference: "Este" },

    { id: 11, name: "Atlanta Hawks", short: "ATL", conference: "Este" },
    { id: 12, name: "Charlotte Hornets", short: "CHA", conference: "Este" },
    { id: 13, name: "Miami Heat", short: "MIA", conference: "Este" },
    { id: 14, name: "Orlando Magic", short: "ORL", conference: "Este" },
    { id: 15, name: "Washington Wizards", short: "WAS", conference: "Este" },

    { id: 16, name: "Denver Nuggets", short: "DEN", conference: "Oeste" },
    { id: 17, name: "Minnesota Timberwolves", short: "MIN", conference: "Oeste" },
    { id: 18, name: "Oklahoma City Thunder", short: "OKC", conference: "Oeste" },
    { id: 19, name: "Portland Trail Blazers", short: "POR", conference: "Oeste" },
    { id: 20, name: "Utah Jazz", short: "UTA", conference: "Oeste" },

    { id: 21, name: "Golden State Warriors", short: "GSW", conference: "Oeste" },
    { id: 22, name: "LA Clippers", short: "LAC", conference: "Oeste" },
    { id: 23, name: "Los Angeles Lakers", short: "LAL", conference: "Oeste" },
    { id: 24, name: "Phoenix Suns", short: "PHX", conference: "Oeste" },
    { id: 25, name: "Sacramento Kings", short: "SAC", conference: "Oeste" },

    { id: 26, name: "Dallas Mavericks", short: "DAL", conference: "Oeste" },
    { id: 27, name: "Houston Rockets", short: "HOU", conference: "Oeste" },
    { id: 28, name: "Memphis Grizzlies", short: "MEM", conference: "Oeste" },
    { id: 29, name: "New Orleans Pelicans", short: "NOP", conference: "Oeste" },
    { id: 30, name: "San Antonio Spurs", short: "SAS", conference: "Oeste" }

];


// =======================================================
// JUGADORES
// Aquí iremos metiendo las plantillas oficiales
// =======================================================

TMLFE.players = [];


// =======================================================
// FUNCIONES AUXILIARES
// =======================================================

function getTeamById(id) {
    return TMLFE.teams.find(team => team.id === id);
}

function getTeamByName(name) {
    return TMLFE.teams.find(team => team.name === name);
}

function getPlayersByTeam(teamName) {
    return TMLFE.players.filter(player => player.team === teamName);
}
