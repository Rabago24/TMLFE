// ==========================================================
// TMLFE - DEAD MONEY
// Contratos de jugadores cortados
// Temporada base: 2026/27
// ==========================================================

"use strict";

window.TMLFE_DEAD_MONEY = {

    NYK: [
        {
            name: "Evan Fournier",
            salaries: {
                "2026/27": 955500,
                "2027/28": 955500,
                "2028/29": 0
            }
        },
        {
            name: "Shake Milton",
            salaries: {
                "2026/27": 2260000,
                "2027/28": 0,
                "2028/29": 0
            }
        },
        {
            name: "Vasilije Micic",
            salaries: {
                "2026/27": 1653750,
                "2027/28": 1653750,
                "2028/29": 0
            }
        }
    ],

    CHI: [
        {
            name: "Jared Butler",
            salaries: {
                "2026/27": 1068079,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    CLE: [
        {
            name: "Keaton Wallace",
            salaries: {
                "2026/27": 2625000,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    DET: [
        {
            name: "Markelle Fultz",
            salaries: {
                "2026/27": 3627971,
                "2027/28": 3627971,
                "2028/29": 0
            }
        }
    ],

    IND: [
        {
            name: "Keon Johnson",
            salaries: {
                "2026/27": 1565071,
                "2027/28": 0,
                "2028/29": 0
            }
        },
        {
            name: "Mouhamed Gueye",
            salaries: {
                "2026/27": 600000,
                "2027/28": 600000,
                "2028/29": 0
            }
        },
        {
            name: "Patrick Baldwin Jr.",
            salaries: {
                "2026/27": 675333,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    MIL: [
        {
            name: "Dwight Powell",
            salaries: {
                "2026/27": 833333,
                "2027/28": 833333,
                "2028/29": 0
            }
        },
        {
            name: "Jake LaRavia",
            salaries: {
                "2026/27": 1126690,
                "2027/28": 1126690,
                "2028/29": 0
            }
        },
        {
            name: "P.J. Tucker",
            salaries: {
                "2026/27": 2317087,
                "2027/28": 1317087,
                "2028/29": 1317087
            }
        }
    ],

    ATL: [
        {
            name: "Jugador pendiente",
            salaries: {
                "2026/27": 6941812,
                "2027/28": 6941812,
                "2028/29": 6941812
            }
        },
        {
            name: "Kenny Lofton Jr.",
            salaries: {
                "2026/27": 833333,
                "2027/28": 0,
                "2028/29": 0
            }
        },
        {
            name: "Simone Fontecchio",
            salaries: {
                "2026/27": 1050000,
                "2027/28": 1050000,
                "2028/29": 0
            }
        },
        {
            name: "Terance Mann",
            salaries: {
                "2026/27": 1386000,
                "2027/28": 1386000,
                "2028/29": 1386000
            }
        }
    ],

    MIA: [
        {
            name: "Aaron Holiday",
            salaries: {
                "2026/27": 833333,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    ORL: [
        {
            name: "Brooks Barnhizer",
            salaries: {
                "2026/27": 1800000,
                "2027/28": 0,
                "2028/29": 0
            }
        },
        {
            name: "Bryn Forbes",
            salaries: {
                "2026/27": 2140696,
                "2027/28": 2140696,
                "2028/29": 0
            }
        }
    ],

    DEN: [
        {
            name: "Al-Farouq Aminu",
            salaries: {
                "2026/27": 1891500,
                "2027/28": 1891500,
                "2028/29": 0
            }
        },
        {
            name: "Isaiah Todd",
            salaries: {
                "2026/27": 698960,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    MIN: [
        {
            name: "Kyle Lowry",
            salaries: {
                "2026/27": 2625000,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    PHX: [
        {
            name: "Andre Drummond",
            salaries: {
                "2026/27": 12721191,
                "2027/28": 12721191,
                "2028/29": 0
            }
        }
    ],

    DAL: [
        {
            name: "Meyers Leonard",
            salaries: {
                "2026/27": 1025000,
                "2027/28": 1025000,
                "2028/29": 0
            }
        }
    ],

    HOU: [
        {
            name: "Gabe Vincent",
            salaries: {
                "2026/27": 1120875,
                "2027/28": 0,
                "2028/29": 0
            }
        },
        {
            name: "Ryan Nembhard",
            salaries: {
                "2026/27": 2625000,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    MEM: [
        {
            name: "Jae Crowder",
            salaries: {
                "2026/27": 2625000,
                "2027/28": 0,
                "2028/29": 0
            }
        }
    ],

    NOP: [
        {
            name: "Antonio Reeves",
            salaries: {
                "2026/27": 600000,
                "2027/28": 600000,
                "2028/29": 0
            }
        },
        {
            name: "Jericho Sims",
            salaries: {
                "2026/27": 1385291,
                "2027/28": 1385291,
                "2028/29": 0
            }
        }
    ]
};


// Devuelve todos los contratos cortados de un equipo
window.getDeadMoneyPlayers = function (teamShort) {

    return window.TMLFE_DEAD_MONEY[teamShort] || [];

};


// Devuelve el Dead Money total de un equipo en una temporada
window.getDeadMoneyTotal = function (
    teamShort,
    season = "2026/27"
) {

    const players =
        window.getDeadMoneyPlayers(teamShort);

    return players.reduce(
        (total, player) => {

            const salary =
                player.salaries?.[season] || 0;

            return total + Number(salary);

        },
        0
    );

};
