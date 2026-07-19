// =======================================
// TMLFE - Liga Franquicia Extraditables
// Base de franquicias
// =======================================


const LFE_FRANQUICIAS = [

    {
        nombre:"Atlanta Hawks",
        ciudad:"Atlanta",
        conferencia:"Este",
        division:"Southeast"
    },

    {
        nombre:"Boston Celtics",
        ciudad:"Boston",
        conferencia:"Este",
        division:"Atlantic"
    },

    {
        nombre:"Brooklyn Nets",
        ciudad:"Brooklyn",
        conferencia:"Este",
        division:"Atlantic"
    },

    {
        nombre:"Charlotte Hornets",
        ciudad:"Charlotte",
        conferencia:"Este",
        division:"Southeast"
    },

    {
        nombre:"Chicago Bulls",
        ciudad:"Chicago",
        conferencia:"Este",
        division:"Central"
    },

    {
        nombre:"Cleveland Cavaliers",
        ciudad:"Cleveland",
        conferencia:"Este",
        division:"Central"
    },

    {
        nombre:"Dallas Mavericks",
        ciudad:"Dallas",
        conferencia:"Oeste",
        division:"Southwest"
    },

    {
        nombre:"Denver Nuggets",
        ciudad:"Denver",
        conferencia:"Oeste",
        division:"Northwest"
    },

    {
        nombre:"Detroit Pistons",
        ciudad:"Detroit",
        conferencia:"Este",
        division:"Central"
    },

    {
        nombre:"Golden State Warriors",
        ciudad:"Golden State",
        conferencia:"Oeste",
        division:"Pacific"
    },

    {
        nombre:"Houston Rockets",
        ciudad:"Houston",
        conferencia:"Oeste",
        division:"Southwest"
    },

    {
        nombre:"Indiana Pacers",
        ciudad:"Indiana",
        conferencia:"Este",
        division:"Central"
    },

    {
        nombre:"Los Angeles Clippers",
        ciudad:"Los Angeles",
        conferencia:"Oeste",
        division:"Pacific"
    },

    {
        nombre:"Los Angeles Lakers",
        ciudad:"Los Angeles",
        conferencia:"Oeste",
        division:"Pacific"
    },

    {
        nombre:"Memphis Grizzlies",
        ciudad:"Memphis",
        conferencia:"Oeste",
        division:"Southwest"
    },

    {
        nombre:"Miami Heat",
        ciudad:"Miami",
        conferencia:"Este",
        division:"Southeast"
    },

    {
        nombre:"Milwaukee Bucks",
        ciudad:"Milwaukee",
        conferencia:"Este",
        division:"Central"
    },

    {
        nombre:"Minnesota Timberwolves",
        ciudad:"Minnesota",
        conferencia:"Oeste",
        division:"Northwest"
    },

    {
        nombre:"New Orleans Pelicans",
        ciudad:"New Orleans",
        conferencia:"Oeste",
        division:"Southwest"
    },

    {
        nombre:"New York Knicks",
        ciudad:"New York",
        conferencia:"Este",
        division:"Atlantic"
    },

    {
        nombre:"Oklahoma City Thunder",
        ciudad:"Oklahoma City",
        conferencia:"Oeste",
        division:"Northwest"
    },

    {
        nombre:"Orlando Magic",
        ciudad:"Orlando",
        conferencia:"Este",
        division:"Southeast"
    },

    {
        nombre:"Philadelphia 76ers",
        ciudad:"Philadelphia",
        conferencia:"Este",
        division:"Atlantic"
    },

    {
        nombre:"Phoenix Suns",
        ciudad:"Phoenix",
        conferencia:"Oeste",
        division:"Pacific"
    },

    {
        nombre:"Portland Trail Blazers",
        ciudad:"Portland",
        conferencia:"Oeste",
        division:"Northwest"
    },

    {
        nombre:"Sacramento Kings",
        ciudad:"Sacramento",
        conferencia:"Oeste",
        division:"Pacific"
    },

    {
        nombre:"San Antonio Spurs",
        ciudad:"San Antonio",
        conferencia:"Oeste",
        division:"Southwest"
    },

    {
        nombre:"Toronto Raptors",
        ciudad:"Toronto",
        conferencia:"Este",
        division:"Atlantic"
    },

    {
        nombre:"Utah Jazz",
        ciudad:"Utah",
        conferencia:"Oeste",
        division:"Northwest"
    },

    {
        nombre:"Washington Wizards",
        ciudad:"Washington",
        conferencia:"Este",
        division:"Southeast"
    }

];





// =======================================
// CARGAR FRANQUICIAS EN DATABASE
// =======================================


function cargarFranquiciasLFE(){


    LFE_FRANQUICIAS.forEach(

        franquicia => {


            databaseCrearEquipo({

                nombre:
                franquicia.nombre,


                ciudad:
                franquicia.ciudad,


                conferencia:
                franquicia.conferencia,


                division:
                franquicia.division

            });


        }

    );


    console.log(
        "🏀 30 franquicias LFE cargadas"
    );

}
