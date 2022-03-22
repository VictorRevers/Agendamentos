var appointment = require("../models/Appointment");
var mongoose = require("mongoose");
var AppointmentFactory = require("../factories/AppointmentFactory");
var mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);

class AppointmentService{

    async Create(name, email, description, cpf, date, time){
        var newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });

        try{
            await newAppo.save();
            return true;
        }catch(err){
            console.log(err);
            return false;
        }     
    }

    async GetAll(showFinished){
        if(showFinished){
            return await Appo.find();
        }else{
            var appos =  await Appo.find({'finished': false});
            var appointments = [];

            appos.forEach(appointment=>{
                if(appointment.date != undefined){
                    appointments.push(AppointmentFactory.Build(appointment));
                }
            });

            return appointments;
        }
    }

    async GetById(id){
        try{
            var event = await Appo.findOne({'_id': id});
            return event;
        }catch(err){
            console.log(err);
        }        
    }

    async Finish(id){
        try{
            await Appo.findByIdAndUpdate(id,{finished: true});
            return true;
        }catch(err){
            console.log(err);
            return false;
        }       
    }

    async Search(query){
        try{
            var appos = await Appo.find().or([{email: query},{cpf: query}]);
            console.log(appos);
            return appos;
        }catch(err){
            console.log(err);
            return false;
        }       
    }

    async SendNotification(){
        var transporter = mailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "075b88020de513",
                pass: "4b1d99639743fa"
            }
        });
     
            var appos = await this.GetAll(false);
            appos.forEach( app =>{
                var date = app.start.getTime();
                var hour = 1000 * 60 * 60;
                var gap = date - Date.now();

                if(gap <= hour){
                    if(!app.notified){                      
                       transporter.sendMail({
                           from: "Agendamento Consultas <consultas@marcar.com.br>",
                           to: app.email,
                           subject: "Sua consulta ocorrerá em breve!",
                           text: "ATENÇÃO: " + app.title + " OCORRERÁ " + app.start
                       }).then(async()=>{
                            await Appo.findByIdAndUpdate(app.id, {notified: true});
                            console.log("Email enviado!");
                       }).catch(err=>{
                           console.log(err);
                       });
                    }                  
                }
            });            
    }

}

module.exports = new AppointmentService();