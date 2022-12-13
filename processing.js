const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const httpSuccessStatus = 200;
const portNumber = 5000;

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
const publicPath = path.resolve(__dirname, "templates");
app.set("views", publicPath);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => {
    response.render("index");
});

app.get("/display", (request, response) => {

    //not known how to do yet
});

app.listen(portNumber);