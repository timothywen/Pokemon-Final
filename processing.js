const http = import('http');
const fs = import('fs');
import express from 'express';
import path from 'path';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import Pokedex from 'pokedex-promise-v2';
import ejs from 'ejs';
import { render } from 'ejs';

const app = express();
const httpSuccessStatus = 200;
const portNumber = 5000;
app.listen(portNumber);

console.log(`Web server started and running at http://localhost:${portNumber}`);
/*=================================================*/
/*                For command line                 */
/*=================================================*/
const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.setEncoding("utf8");
process.stdin.on('readable', () => {
    if(process.argv[2] !== undefined){
        console.log("Usage processing.js");
        process.exit(0);
    }
    let dataInput = process.stdin.read();
    if(dataInput !== null){
        let command = dataInput.trim();

        if(command === "stop"){
            console.log("Shutting down the server");
            process.exit(0);
        }
        else{
            console.log(`Invalid command: ${command}`);
            process.stdout.write(prompt);
            process.stdin.resume();
        }
    }
});


/*=================================================*/
/*                 Path Processing                 */
/*=================================================*/
const __dirname = dirname("templates");
const publicPath = path.resolve(__dirname, "templates");
app.set("views", publicPath);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => {
    response.render("index");
});


app.get("/display", (request, response) => {
    const Dex = new Pokedex();
    let tableHTML = "";

    Dex.getPokemonByName("litwick")
        .then((result) => {
            let spriteURL = result.sprites.front_default;
            // TODO: for debugging, remove later 
            console.log(spriteURL);
            tableHTML += `hi`;
        })
        .catch((error) => {
            console.log("There was an ERROR: ", error);
        });
    
    response.render("displayBox", {table: tableHTML});
});


app.get("/add", (request, response) => {
    response.render("addPokemon");
});

app.post("/processAdd", (request, response) => {
    let {name, level} = request.body;
    let nickname = request.body.custom;
    let isShiny = request.body.shiny;
    let time = new Date(Date.now());
    
    let vars = {
        name: name.toLowerCase(),
        custom: nickname,
        shiny: isShiny ? "yes" : "no",
        level: level,
        time: time
    };

    add(vars);
    response.render("processingAdd", vars);
});
