const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const AppointmentService = require("./services/appointmentService");
const appointmentService = require('./services/appointmentService');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.set('useFindAndModify', false);


app.get("/", (req,res) =>{
    res.render('index');
    console.log(req.connection.remoteAddress)
   
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
    var appointments =  await AppointmentService.GetAll(false);
    res.json(appointments);
});

app.get("/event/:id", async(req, res)=>{
    var appointment = await AppointmentService.GetById(req.params.id);
    res.render("event", {appo: appointment});
});

app.post("/finish", async(req,res)=>{
    var id = req.body.id;
    var result = await AppointmentService.Finish(id); 
    res.redirect("/");
});

app.get("/list", async(req,res)=>{
    //await AppointmentService.Search("002.020.202-02");
    var appos = await AppointmentService.GetAll(true);
    res.render("list", {appos});
});

app.get("/searchresult", async(req,res)=>{
    var appos = await AppointmentService.Search(req.query.search); //formulário get => request está na query e não no body
    res.render("list", {appos});
    //console.log(req.body.search);
    //res.json({});
});


var pollTime = 5000;//1000 * 60 * 5;

setInterval(async() => {
    await AppointmentService.SendNotification();
}, pollTime);

app.listen(8080, ()=>{
    console.log("Servidor Rodando!");
});

