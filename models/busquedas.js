const axios = require("axios");
const fs = require('fs');

class Busquedas {
    
    // Array con paises buscados 
    historial = []
    dbPath = './db/database.json';

    constructor() {
        // TODO: Leer db si existe
    }

    get paramsMapbox() {
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(" ");
            palabras = palabras.map( p => p[0].toUpperCase + p.substring(1) );

            return palabras.join(' ');

        } )
    }

    async ciudad( lugar = '' ) {
        try {
            // Peticion http 
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });
            
            const resp = await instance.get();
            // Regresamos objeto de forma implicita (Por eso ({}) )
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }
    }

    async clima( lat, lon ) {
        // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'lat': lat,
                    'lon': lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                }
            });
            
            const { data } = await instance.get();

            return {
                desc: data.weather[0].description,
                temp: data.main.temp,
                min: data.main.temp_min,
                max: data.main.temp_max,
            }
        } catch (error) {
            throw console.log("Algo salio mal");
        }
    }

    agregarHistorial( lugar = '' ) {

        if( this.historial.includes( lugar ) ) {
            return;
        }

        this.historial.unshift( lugar );

        this.guardarDB();
        
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB() {

        if ( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

        const data = JSON.parse( info );

        this.historial = data.historial;

    }

}

module.exports = Busquedas;