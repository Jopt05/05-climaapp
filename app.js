const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config();

const main = async() => {

    let opt = '';

    const busquedas = new Busquedas();

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case "1":
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');

                // Buscar la ciudad 
                const lugares = await busquedas.ciudad( lugar );

                // Seleccionar el lugar 
                const id = await listarLugares( lugares );
                if( id === "0" ) {
                    continue;
                }
                const lugarSel = lugares.find( l => l.id === id );

                busquedas.agregarHistorial( lugarSel.nombre );

                // Datos del clima 
                const datosClima = await busquedas.clima( lugarSel.lat, lugarSel.lng );

                // Mostrar información o resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Clima:', datosClima.desc);
                console.log('Temperatura:', datosClima.temp);
                console.log('Max:', datosClima.max);
                console.log('Min:', datosClima.min);
                break;

            case "2":
                busquedas.historial.forEach( ( lugar, i) => {
                    const idx = `${ 1 + i }`.green;
                    console.log( `${ idx } ${ lugar }` );
                } )
                break;

            default:
                break;
        }

        await pausa();

    } while ( opt !== "0" )

};

main();