// =======================================
// TMLFE - Trade Engine
// Sistema de traspasos
// =======================================


const TradesDB = {

    trades: []

};





// =======================================
// CREAR TRASPASO
// =======================================


function crearTrade(datos){


    const trade = {


        id: Date.now(),


        equipoOrigen: datos.equipoOrigen,


        equipoDestino: datos.equipoDestino,


        jugadoresEnviados:
        datos.jugadoresEnviados || [],


        jugadoresRecibidos:
        datos.jugadoresRecibidos || [],


        salarioEnviado:
        datos.salarioEnviado || 0,


        salarioRecibido:
        datos.salarioRecibido || 0,


        fecha:
        new Date(),


        estado:
        "pendiente"


    };



    TradesDB.trades.push(trade);



    console.log(
        "Trade creado:",
        trade
    );



    return trade;


}





// =======================================
// CALCULAR SALARIO DEL MOVIMIENTO
// =======================================


function calcularMovimientoSalarial(
    jugadores
){


    let total = 0;



    jugadores.forEach(

        jugador => {


            total += jugador.salario;


        }

    );



    return total;


}





// =======================================
// VALIDACIÓN SALARIAL
// =======================================


function validarSalarios(
    salarioActual,
    salarioSale,
    salarioEntra
){


    const nuevoSalario =

    salarioActual
    -
    salarioSale
    +
    salarioEntra;




    return {


        salarioFinal:
        nuevoSalario,


        valido:
        true,


        mensaje:
        "Movimiento salarial calculado"


    };


}





// =======================================
// VALIDACIÓN GENERAL DEL TRADE
// =======================================


function validarTrade(trade){



    let resultado = {


        valido:true,


        errores:[]


    };



    if(!trade.equipoOrigen){


        resultado.valido=false;


        resultado.errores.push(
            "Falta equipo origen"
        );


    }



    if(!trade.equipoDestino){


        resultado.valido=false;


        resultado.errores.push(
            "Falta equipo destino"
        );


    }




    if(
        trade.jugadoresEnviados.length===0
        &&
        trade.jugadoresRecibidos.length===0
    ){


        resultado.valido=false;


        resultado.errores.push(
            "El trade está vacío"
        );


    }




    return resultado;


}





// =======================================
// ACEPTAR TRADE
// =======================================


function aceptarTrade(id){



    const trade =

    TradesDB.trades.find(

        t=>t.id===id

    );



    if(trade){


        trade.estado="aprobado";


        console.log(
            "Trade aprobado",
            trade
        );


    }


}





// =======================================
// RECHAZAR TRADE
// =======================================


function rechazarTrade(id){



    const trade =

    TradesDB.trades.find(

        t=>t.id===id

    );



    if(trade){


        trade.estado="rechazado";


    }


}





// =======================================
// HISTORIAL
// =======================================


function historialTrades(){


    return TradesDB.trades;


}





// =======================================
// BORRAR TRADE
// =======================================


function eliminarTrade(id){



    TradesDB.trades =

    TradesDB.trades.filter(

        trade => trade.id !== id

    );


}





// =======================================
// EJEMPLO DE PRUEBA
// =======================================


crearTrade({

    equipoOrigen:
    "Charlotte Hornets",


    equipoDestino:
    "Dallas Mavericks",


    jugadoresEnviados:
    [
        "Jugador A"
    ],


    jugadoresRecibidos:
    [
        "Jugador B"
    ],


    salarioEnviado:
    10000000,


    salarioRecibido:
    8000000


});





console.log(
"🔄 Trades.js cargado correctamente"
);
