const http = import('http');
const fs = import('fs');
import express from 'express';
import path from 'path';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import Pokedex from 'pokedex-promise-v2';
import ejs from 'ejs';
import { render } from 'ejs';
import dotenv from 'dotenv';
import { config } from 'dotenv';

const app = express();

const httpSuccessStatus = 200;
const portNumber = 5000;
app.listen(portNumber);
//include css file
app.use(express.static(process.cwd() + '/templates/'));

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
/*               Mongo DB Processing               */
/*=================================================*/
dotenv.config({ path: path.resolve(process.cwd(), 'credentials/.env') });

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
import {MongoClient, ServerApiVersion} from "mongodb";
import { table } from 'console';
const uri = `mongodb+srv://${userName}:${password}@poke-man.0zopgjt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function add(variables) {
    try{
        await client.connect();
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(variables);
    }catch(e){
        console.log(e);
    } finally{
        await client.close();
    }
}


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


app.get("/display", async (request, response) => {
    const Dex = new Pokedex();
    let tableHTML = "<h1>";

    await Dex.getPokemonByName("litwick")
        .then(　async (result) => {
            let spriteURL = result.sprites.front_default;
            // console.log(`\n${spriteURL}`);
            tableHTML += `<img src="${spriteURL}" alt=sprite>`;
            console.log(tableHTML);
        })
        
        .catch((error) => {
            console.log("There was an ERROR: ", error);
        });

    console.log("rendering html");
    let vars = {table: tableHTML};
    response.render("displayBox", vars);
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
