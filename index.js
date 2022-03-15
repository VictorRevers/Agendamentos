const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const AppointmentService = require("./services/appointmentService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true});


app.get("/", (req,res) =>{
    res.render('index');
});

app.get("/cadastro", (req,res)=>{
    res.render("create");
})

app.post("/cadastro", async(req,res)=>{

    var status = await AppointmentService.Create(
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

app.get("/getcalendar", async(req, res)=>{
    var consultas =  await AppointmentService.GetAll(false);
    res.json(consultas);
});

app.listen(8080, ()=>{
    console.log("Servidor Rodando!");
});

