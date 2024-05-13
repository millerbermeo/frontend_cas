import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import {pool} from "./src/database/conexion.js";
import validator from "./src/routers/validator.router.js"
import residuo  from "./src/routers/residuo.router.js"

//ruta para jose
import Actividad  from "./src/routers/actividad.router.js"

//ruta para sebas
import elemento  from "./src/routers/elemento.router.js"

//ruta para ander

 import usuarios  from "./src/routers/usuario.router.js"



const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


(async () => {
    try {
        await pool.query("SELECT 1");
        console.log("conexión establecida");
    } catch (error) {
        console.error("error de conexión: ", error);
    }
  })();

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});


app.use('/', validator);

app.use('/usuario', usuarios) // descomentar aqui va la ruta acceder al controlador de ander

app.use('/residuo', residuo) // descomentar aqui va la ruta acceder al controlador de miller

app.use('/elemento', elemento) // descomentar aqui va la ruta acceder al controlador de sebas

app.use('/actividades', Actividad) // descomentar aqui va la ruta acceder al controlador de jose

app.listen(3000, ()=>{
    console.log("escuchando en el puerto 3000")
})