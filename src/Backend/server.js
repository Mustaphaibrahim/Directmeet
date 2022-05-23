require('dotenv').config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');



// ----------- variables ----------------------------

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000/",
      methods: ["GET", "POST"],
    },
});

const URL_DB = `mongodb+srv://direct:direct@cluster0.9veiu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const port = process.env.PORT || 3000;

// ----------- import files. -----------------------------

const User = require('./model/Usermodel');


// ----------- app.use(). -----------------------------

app.use(cors());
app.use( '/static' ,express.static(path.join(__dirname, '../../dist'), { index: false }));
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header
    (
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "*")
    
    next();
});

const upload = multer({
    
    limits:
    {
        fileSize: 90000000000
    }
});


// ----------- __________. -----------------------------

const SECRET_TOKEN = 'f638f4354ff089323d1a5f78fd8f63ca';
const signAccessToken = (data) => {
    return jwt.sign(data,SECRET_TOKEN);
}


const createHash = (password) =>
{
    const secret ='Ahmad';
    const hash = crypto.createHmac('sha256', secret).update(password).digest('hex');
    return hash;
}

// ----------- controllers. -----------------------------

app.post('/create/user', async  (req, res) => {
    const { username ,email , password } = req.body;
    console.log(req.body);
    try{
        mongoose.connect(URL_DB);
        const user = new User({
            username:username,
            email:email,
            password: createHash(password) ,
            token:signAccessToken(email)
        });
        const x = await user.save();
        res.status(200).json({
            success: true,
            message:'user created success',
        });

    }catch(err){
        res.status(400).json({
            message:'error in post,"/create/user" ',
            error:err
        });
    };
 
});


app.post('/login', async  (req, res) => {
    
    const { 
        email,
        password  
        } = req.body;

    try{
        mongoose.connect(URL_DB);
        const email1 = await User.findOne({email:email});
       if(email1.password === createHash(password) )
       {
           res.cookie( "cookie_Token",email1.token,
           {
               httpOnly: true 
           }).status(200).json({
               success: true,
               message:'success login', 
               token:email1.token,
               user:email1
           })
       }else{

            res.clearCookie("cookie_Token").status(200).json({
                success: true,
                message:'password or email is invalid',
                token:'null',
                user:'null'
            })
       }
        
        res.end();
    }catch (err) {
        res.clearCookie("cookie_Token").status(200).json({
            message:'error in post,"/login',
            message:'password or email is invalid',
            token:'null',
            user:'null',
            error:err
        })
    };
});

app.post('/user/update', async (req, res) =>
{
    const { username , email , password , confirmEmail} = req.body;

    if(password === '')
    {
        mongoose.connect(URL_DB);
        const email1 = await User.updateOne({email:confirmEmail},{$set: {username:username,email:email} });
        res.status(200).json({success:true});
        res.end();

    }else{
        mongoose.connect(URL_DB);
        const email1 = await User.updateOne({email:confirmEmail},{$set: {username:username, password:createHash(password),email:email} });
        res.status(200).json({success:true});
        res.end();
    }
    
});

app.post('/user/logout', (req, res) =>
{
    res.clearCookie("cookie_Token")
    .status(200)
    .json({
        success: true,
        message: 'user logged out'
    });
});

app.post('/img',async (req, res)=>{
    const { email } = req.body
    mongoose.connect(URL_DB);
    const img = await User.findOne({email:email});
    res.status(200).send({
            img:img.img
    })
});

app.post('/uploadphoto', upload.single("testImage"), async (req, res) =>
{
    const { buffer , confirmEmail} = req.body;
    mongoose.connect(URL_DB);
    const email1 = await User.updateOne({email:confirmEmail},{$set:{img:buffer} });
    res.status(200).json({success:true});
    res.end();
});


app.post('/DeleteProfilePhoto', async (req, res) => {
    const { Email} = req.body;
    mongoose.connect(URL_DB);
    const email1 = await User.updateOne({email:Email},{$set:{img:''} });
    res.status(200).json({success:true});
    res.end();
});

app.post('/DeleteAccount', async (req, res) => {
    const { Email} = req.body;
    mongoose.connect(URL_DB);
    const email1 = await User.deleteOne({email:Email});
    res.status(200)
    .clearCookie("cookie_Token")
    .json({
        success: true,
        message: 'user logged out'
    });
   
});


app.get('/',  (req, res) => {
    res.status(200).sendFile( path.join(__dirname,'../../dist' , 'index.html'));
});


app.get('/Meeting', (req, res) => {
    res.redirect(`/Meeting${uuidv4()}`);
    
});

app.get('/Meeting:room', (req, res) => {
    res.status(200).sendFile( path.join(__dirname,'../../dist' , 'Meeting.html'));
    
});

// ----------- socket. -----------------------------

let peers = []

const t = { t: true , f : false}

io.on('connection', socket => {
    
  socket.on('join-room', (roomId, userData) => {

        console.log('user-connected  '+roomId+'  :  '+ userData);
        socket.join(roomId)
       
        socket.on('peer', (peerId) => {
            const userInfo = JSON.parse(userData)
            const data = { userInfo, peerId , socket: socket.id ,cam:false , mic:false , ref:'' }
            peers.push(data)
            io.sockets.in(roomId).emit('peer',peers)
        });
        socket.on('screen', () => {
          
            io.sockets.in(roomId).emit('screenCall');
        });
        socket.on('screenStop', () => {
            io.sockets.in(roomId).emit('screenStop')
        });
     
        socket.on('camera', (peerId) => {
            peers =  peers.map((peer)=>{
                if(peer.peerId === peerId)
                {
                    peer.cam = true;
                }
                return peer
            });
            
            io.sockets.in(roomId).emit('camera',peers);
            io.sockets.in(roomId).emit('videoCall',t);
        });

        socket.on('cameraStop', (peerId) => {
            peers =  peers.map((peer)=>{
                if(peer.peerId === peerId)
                {
                    peer.cam = false;
                }
                return peer
            });
            io.sockets.in(roomId).emit('camera',peers)
        });

        socket.on('mic', (peerId) => {
            peers =  peers.map((peer)=>{
                if(peer.peerId === peerId)
                {
                    peer.mic = true;
                }
                return peer
            });
            io.sockets.in(roomId).emit('mic',peers)
        });

        socket.on('micStop', (peerId) => {
            peers =  peers.map((peer)=>{
                if(peer.peerId === peerId)
                {
                    peer.mic = false;
                }
                return peer
            });
            io.sockets.in(roomId).emit('micStop',peers,peerId)
        });
        socket.on('massage', (msg) => {
            io.sockets.in(roomId).emit('massage',msg)
        });

     
     
    socket.on('disconnect', () => {
        peers =  peers.filter((peer)=>{
            return peer.socket != socket.id
        });
        
        io.sockets.in(roomId).emit('user-disconnected',peers)
    })
  })
})

// ------------------------------




// ----------- server listening . -----------------------------

server.listen(port,()=>{
    console.log( ` server listening on :  ${port}` );
});