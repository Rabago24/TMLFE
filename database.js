// ==========================================================
// TMLFE DATABASE
// Trade Machine Liga Franquicia Extraditables
// Temporada 2026/27
// ==========================================================

const TMLFE = {
    version: "1.0",
    season: "2026/27",
    salaryCap: 155000000,
    teams: [],
    players: [],
    tradeHistory: []
};


// ==========================================================
// FUNCIONES PARA CREAR FRANQUICIAS Y JUGADORES
// ==========================================================

function addTeam(id, name, short, conference, division, manager) {
    TMLFE.teams.push({
        id,
        name,
        short,
        conference,
        division,
        manager
    });
}


function addPlayer(
    team,
    name,
    rating,
    position,
    age,
    bird,
    freeAgency,
    salary2627,
    salary2728,
    salary2829,
    salary2930,
    salary3031,
    salary3132,
    minimumSalary,
    maximumSalary,
    capHold
) {
    TMLFE.players.push({
        id: TMLFE.players.length + 1,
        team,
        name,
        rating,
        position,
        age,
        bird,
        freeAgency,

        salaries: {
            "2026/27": salary2627,
            "2027/28": salary2728,
            "2028/29": salary2829,
            "2029/30": salary2930,
            "2030/31": salary3031,
            "2031/32": salary3132
        },

        minimumSalary,
        maximumSalary,
        capHold
    });
}


// ==========================================================
// 1. BOSTON CELTICS
// ==========================================================

addTeam(
    1,
    "Boston Celtics",
    "BOS",
    "Este",
    "Atlantic",
    "olly34"
);


addPlayer(
    "Boston Celtics",
    "Jayson Tatum",
    93,
    "PF/SF",
    28,
    10,
    "",
    49194553,
    53130117,
    57380527,
    61970969,
    0,
    0,
    47355000,
    57750000,
    45550512
);


addPlayer(
    "Boston Celtics",
    "Jamal Murray",
    89,
    "PG/SG",
    29,
    11,
    "",
    43693558,
    47189043,
    0,
    0,
    0,
    0,
    38692500,
    46200000,
    40456998
);


addPlayer(
    "Boston Celtics",
    "Amen Thompson",
    87,
    "SG/SF",
    23,
    4,
    "RFA",
    7976582,
    0,
    0,
    0,
    0,
    0,
    34072500,
    39847500,
    19888750
);


addPlayer(
    "Boston Celtics",
    "Evan Mobley",
    87,
    "PF/C",
    25,
    6,
    "",
    56832773,
    59674411,
    62658132,
    0,
    0,
    0,
    35227500,
    41002500,
    54126450
);


addPlayer(
    "Boston Celtics",
    "VJ Edgecombe",
    83,
    "SG/PG",
    21,
    2,
    "RFA",
    9719900,
    "10183200 TO",
    "10183200 TO",
    0,
    0,
    0,
    17902500,
    24832500,
    18514800
);


addPlayer(
    "Boston Celtics",
    "Brice Sensabaugh",
    81,
    "SF/PF",
    23,
    4,
    "RFA",
    2229202,
    0,
    0,
    0,
    0,
    0,
    13282500,
    20212500,
    4422800
);


addPlayer(
    "Boston Celtics",
    "Kyle Kuzma",
    80,
    "SF/PF",
    31,
    2,
    "",
    7956587,
    0,
    0,
    0,
    0,
    0,
    14437500,
    20212500,
    0
);


addPlayer(
    "Boston Celtics",
    "Kasparas Jakucionis",
    77,
    "PG/SG",
    19,
    2,
    "RFA",
    3073600,
    "3220000 TO",
    "3220000 TO",
    0,
    0,
    0,
    7507500,
    12127500,
    4390650
);


addPlayer(
    "Boston Celtics",
    "Zaccharie Risacher",
    77,
    "SF/SG",
    21,
    2,
    "RFA",
    10339100,
    "13047944 TO",
    0,
    0,
    0,
    0,
    8662500,
    13282500,
    14803500
);


addPlayer(
    "Boston Celtics",
    "Khaman Maluach",
    75,
    "C",
    19,
    2,
    "RFA",
    6580200,
    "6893300 TO",
    "6893300 TO",
    0,
    0,
    0,
    4042500,
    8662500,
    9400050
);


addPlayer(
    "Boston Celtics",
    "Taylor Hendricks",
    75,
    "PF/SF",
    23,
    2,
    "RFA",
    6560736,
    0,
    0,
    0,
    0,
    0,
    4042500,
    8662500,
    9814800
);


addPlayer(
    "Boston Celtics",
    "Tidjane Salaun",
    75,
    "PF/SF",
    21,
    2,
    "RFA",
    4095700,
    "6065732 TO",
    0,
    0,
    0,
    0,
    4042500,
    8662500,
    5864250
);


addPlayer(
    "Boston Celtics",
    "Drake Powell",
    73,
    "SG/SF",
    19,
    2,
    "RFA",
    2950500,
    "3091100 TO",
    "3091100 TO",
    0,
    0,
    0,
    3500000,
    3500000,
    2810200
);


addPlayer(
    "Boston Celtics",
    "Vsevolod Ishchenko",
    60,
    "PG",
    21,
    1,
    "RFA",
    2200000,
    "2400000 TO",
    "2600000 TO",
    0,
    0,
    0,
    0,
    99999999,
    0
);


// ==========================================================
// 2. BROOKLYN NETS
// ==========================================================

addTeam(
    2,
    "Brooklyn Nets",
    "BKN",
    "Este",
    "Atlantic",
    "mantequilla04"
);


addPlayer(
    "Brooklyn Nets",
    "Nikola Jokic",
    98,
    "C",
    31,
    11,
    "",
    50469379,
    54506929,
    0,
    0,
    0,
    0,
    57750000,
    57750000,
    46730906
);


addPlayer(
    "Brooklyn Nets",
    "Cooper Flagg",
    88,
    "SF/PF",
    19,
    2,
    "RFA",
    12097900,
    "12673900 TO",
    "12673900 TO",
    0,
    0,
    0,
    35227500,
    42157500,
    28804000
);


addPlayer(
    "Brooklyn Nets",
    "Brandon Miller",
    87,
    "SF/PF",
    24,
    4,
    "RFA",
    8846894,
    0,
    0,
    0,
    0,
    0,
    35227500,
    41002500,
    22059000
);


addPlayer(
    "Brooklyn Nets",
    "Jrue Holiday",
    82,
    "PG/SG",
    36,
    1,
    "-",
    18100000,
    19005000,
    19955250,
    20953013,
    0,
    0,
    16170000,
    23100000,
    41674500
);


addPlayer(
    "Brooklyn Nets",
    "Peyton Watson",
    82,
    "PF/SF",
    24,
    5,
    "",
    14910000,
    15655500,
    "16438275 PO",
    0,
    0,
    0,
    16747499,
    23677500,
    14200000
);


addPlayer(
    "Brooklyn Nets",
    "Toumani Camara",
    81,
    "PF/SF",
    26,
    4,
    "-",
    17095000,
    18462600,
    19939608,
    21534777,
    23257559,
    0,
    14437500,
    21367500,
    3600000
);


addPlayer(
    "Brooklyn Nets",
    "Robert Williams",
    80,
    "C/PF",
    29,
    9,
    "",
    27209779,
    0,
    0,
    0,
    0,
    0,
    14437500,
    20212500,
    25194240
);


addPlayer(
    "Brooklyn Nets",
    "Moses Moody",
    79,
    "SF/SG",
    24,
    6,
    "",
    10628100,
    11159505,
    11717480,
    12303354,
    0,
    0,
    10972500,
    16747499,
    10122000
);


addPlayer(
    "Brooklyn Nets",
    "Ja’Kobe Walter",
    78,
    "SG/SF",
    22,
    3,
    "RFA",
    4538000,
    "6253364 TO",
    0,
    0,
    0,
    0,
    8662500,
    13282500,
    6497700
);


addPlayer(
    "Brooklyn Nets",
    "Bruce Brown Jr.",
    75,
    "PG/SG",
    30,
    1,
    "-",
    5145525,
    "5402801 TO",
    0,
    0,
    0,
    0,
    5145525,
    10972500,
    0
);


addPlayer(
    "Brooklyn Nets",
    "Kessler Edwards",
    72,
    "C/PF",
    26,
    1,
    "-",
    3500000,
    0,
    0,
    0,
    0,
    0,
    3500000,
    3500000,
    0
);


addPlayer(
    "Brooklyn Nets",
    "Lonnie Walker",
    72,
    "SG/SF",
    28,
    8,
    "",
    6415200,
    6928416,
    0,
    0,
    0,
    0,
    3500000,
    3500000,
    5940000
);


addPlayer(
    "Brooklyn Nets",
    "Ebuka Okorie",
    60,
    "PG",
    19,
    1,
    "RFA",
    3006900,
    3157100,
    "3307500 TO",
    "5440838 TO",
    0,
    0,
    0,
    99999999,
    0
);


addPlayer(
    "Brooklyn Nets",
    "Kingston Flemings",
    60,
    "PG",
    19,
    2,
    "RFA",
    6142900,
    6450100,
    "6757300 TO",
    "8595286 TO",
    0,
    0,
    0,
    99999999,
    0
);


addPlayer(
    "Brooklyn Nets",
    "Ugonna Onyenso",
    60,
    "PG",
    22,
    1,
    "RFA",
    2200000,
    "2400000 TO",
    "2600000 TO",
    0,
    0,
    0,
    0,
    99999999,
    0
);


// ==========================================================
// FUNCIONES DE CONSULTA
// ==========================================================

function getTeamById(id) {
    return TMLFE.teams.find(team => team.id === id);
}


function getTeamByName(name) {
    return TMLFE.teams.find(team => team.name === name);
}


function getPlayersByTeam(teamName) {
    return TMLFE.players.filter(player => player.team === teamName);
}


function getPlayerByName(playerName) {
    return TMLFE.players.find(player => player.name === playerName);
}


// Hace disponible la base de datos para el resto de archivos JS.
window.TMLFE = TMLFE;

console.log(
    `TMLFE cargada: ${TMLFE.teams.length} franquicias y ${TMLFE.players.length} jugadores.`
);
