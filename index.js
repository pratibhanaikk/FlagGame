import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "12@Arpush",
    port: 5433,
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs'); 
app.use(express.json());

let quiz = [];

db.connect();

db.query("SELECT * FROM flags", (err, res) => {
    if(err){
        console.error("Error executing query", err.stack);
    }
    else{
        quiz = res.rows;
    }
    db.end();
})

var score = 0;

app.get("/", (req, res) => {
    console.log(quiz);
    const capital = quiz[Math.floor(Math.random() * quiz.length)].capital;
    const data = {
        curcountry: capital,
        score: score
    };
    console.log(quiz);
    res.render("index.ejs", {data});
})

app.post("/capitaltype", (req, res) => {
    const datacountry = quiz[quiz.findIndex((q) => q.capital === req.body.country)];
    console.log(datacountry);
    if(datacountry.country.toLowerCase() == req.body.capital.toLowerCase()){
         score=parseInt(req.body.score)+1;
    }else{
        score = 0;
    }
    res.redirect("/");
})

app.listen(port, ()=>{
    console.log(`Port is running on port: ${port}`);
});