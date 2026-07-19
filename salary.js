// =======================================
// TMLFE - Salary System
// Gestión salarial y reglas económicas
// =======================================



const SalarySystem = {


    limiteSalarial:155000000,


    impuestoLujo:false,


    equipos:{}


};





// =======================================
// REGISTRAR EQUIPO ECONÓMICAMENTE
// =======================================


function registrarSalarioEquipo(
    nombre,
    salario
){


    SalarySystem.equipos[nombre]={


        salarioTotal:salario,


        espacioDisponible:

        SalarySystem.limiteSalarial
        -
        salario,


    };



}





// =======================================
// ACTUALIZAR SALARIO EQUIPO
// =======================================


function actualizarSalario(
    equipo,
    cantidad
){


    if(
        SalarySystem.equipos[equipo]
    ){


        SalarySystem.equipos[equipo]
        .salarioTotal = cantidad;



        SalarySystem.equipos[equipo]
        .espacioDisponible =

        SalarySystem.limiteSalarial
        -
        cantidad;


    }


}





// =======================================
// COMPROBAR SITUACIÓN SALARIAL
// =======================================


function estadoSalarial(
    equipo
){


    const datos =
    SalarySystem.equipos[equipo];



    if(!datos){

        return null;

    }




    if(
        datos.salarioTotal
        <
        SalarySystem.limiteSalarial
    ){


        return {


            estado:
            "POR DEBAJO DEL LIMITE",


            margen:
            SalarySystem.limiteSalarial
            -
            datos.salarioTotal


        };


    }



    return {


        estado:
        "POR ENCIMA DEL LIMITE",


        margen:
        datos.salarioTotal
        -
        SalarySystem.limiteSalarial


    };



}





// =======================================
// VALIDACIÓN DE TRASPASO
// =======================================
// Reglas TMLFE:
// - No existe impuesto de lujo
// - Si el equipo queda bajo límite,
//   puede absorber salario libremente
// =======================================


function validarSalarioTrade(
    equipo,
    salarioSale,
    salarioEntra
){



    const actual =

    SalarySystem.equipos[equipo]
    .salarioTotal;



    const futuro =

    actual
    -
    salarioSale
    +
    salarioEntra;




    // Equipo termina bajo límite

    if(
        futuro <
        SalarySystem.limiteSalarial
    ){


        return {


            valido:true,


            motivo:
            "Equipo queda bajo el límite salarial"


        };


    }





    // Equipo sigue por encima

    if(
        futuro >=
        SalarySystem.limiteSalarial
    ){


        const diferencia =

        salarioEntra
        -
        salarioSale;



        if(diferencia <=0){


            return {


                valido:true,


                motivo:
                "Equipo no aumenta salario"


            };


        }


    }




    return {


        valido:false,


        motivo:
        "El movimiento salarial no cumple las reglas"


    };



}





// =======================================
// CALCULAR NÓMINA
// =======================================


function calcularNomina(
    jugadores
){


    let total=0;



    jugadores.forEach(

        jugador=>{


            total += jugador.salario;


        }

    );



    return total;


}





// =======================================
// FORMATEAR DINERO
// =======================================


function formatoDinero(
    cantidad
){


    return cantidad.toLocaleString(
        "es-ES",
        {
            style:"currency",
            currency:"USD"
        }
    );


}





// =======================================
// DATOS INICIALES DE PRUEBA
// =======================================


registrarSalarioEquipo(
    "Charlotte Hornets",
    120000000
);



registrarSalarioEquipo(
    "Dallas Mavericks",
    165000000
);





console.log(
"💰 Salary.js cargado correctamente"
);
