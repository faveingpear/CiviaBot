const Discord = require("discord.js");
const config = require("./config.json");
const Bilibili = require("bili-api");

const client = new Discord.Client();

const prefix = "!" // Bot prefix
const notificationChannel = "750563748221288500"; // Id of the channel you wan't the notifications to go to
const civiaBiliBiliId = "34646754"; // The id givin from her channel url

const livemessage = "@everone Civia is live"

client.login(config.BOT_TOKEN);

class Streamer {
    constructor(Name,Id,orgin,client){
        this.Name = Name;
        this.Id = Id; // Current just the bilibili id
        this.orgin = orgin // Bilibili / youtube if I fell like expanding this
        this.live = false
        this.prevStatus = false
        this.parentClient = client //Client which spawned the bot
    }

    updateLiveStatus(){
        (async () => {
            let status = await Bilibili({ mid: this.Id }, ['liveStatus']) // Gets live status from the bili-api
            if(status.liveStatus == 1 && this.prevStatus == false){ // If civia goes live
                this.notify()
                this.prevStatus = true;
            }else if(status.liveStatus == 0 && this.prevStatus == true){ // If civia goes offline
                this.prevStatus = false;
            }
            console.log("Civia live status " + status.liveStatus + " prev status " + this.prevStatus)
        })();
    }
    notify(){
        this.parentClient.channels.cache.get(notificationChannel).send(livemessage);
    }
}

client.on("ready", () => {

    Civia = new Streamer("Civia",civiaBiliBiliId,"",client);
    Civia.updateLiveStatus()

    setInterval(function(){
        Civia.updateLiveStatus()
    },10000); // Interval between check if civia is live in miliseconds
});

client.on("message",function(message){
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    console.log("received: " + command);

    if(command==="ping"){
        message.reply("pong");
    }
});