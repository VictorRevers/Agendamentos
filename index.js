const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const appointmentService = require("./services/appointmentService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true});


app.get("/", (req,res) =>{
    res.send("Agendamento Concluído!");
});

app.get("/cadastro", (req,res)=>{
    res.render("create");
})

app.post("/cadastro", async(req,res)=>{

    var status = await appointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time
        );

        if(status){
            res.status(200);
            res.redirect("/");
        }else{
            res.status(500);
            res.send("Ocorreu uma falha!");
        }
});

app.listen(8080, ()=>{
    console.log("Servidor Rodando!");
});

