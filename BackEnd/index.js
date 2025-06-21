import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { DB_Connect } from "./Util/DB_Connect.util.js";
import userrouter from "./Routes/user.routes.js"
import companyrouter from "./Routes/company.routes.js"
import jobrouter from "./Routes/job.routes.js"
import http from "http"
import applicationrouter from "./Routes/application.routes.js"
import { Server } from "socket.io"
import   jwt  from "jsonwebtoken"
import { Message } from "./models/Message.model.js";
import { company } from "./models/company.model.js";
import { job } from "./models/job.model.js";
import { User } from "./models/user.model.js";
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
// console.log("heyy->>>",process.env)
const app = express();
const PORT = process.env.PORT||7777;
// console.log(PORT)

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(cookieParser());

app.set("trust proxy", 1);

const CorsOption = {
  origin: ['http://localhost:1234'], // Allow only frontend origin
  methods: ['GET', 'POST','PUT'], // Allow these HTTP methods
  // allowedHeaders: ['Content-Type'],
  credentials: true,
              
};
const server = http.createServer(app)
const io=new Server(server,{
  cors:{origin:'http://localhost:1234',credentials:true,methods:['GET','PUT','POST']}
})
// io.use( async(socket, next) => {
//   console.log(socket.handshake.headers)
//   let token = socket.handshake.headers.cookie.split('refresh_token=');
//   console.log(token)

//   token=token?.[1]
//   const user = await jwt.verify(token,process.env.TOKENONE)
//   console.log("user->>",user)
//   if (!user) return next(new Error("Unauthorized"));
//   socket.user = user;
//   next();
// });
io.on('connection', (socket) => {
  // console.log('User connected:', socket?.user?.userid);

  // ✅ Handle send-message
 socket.on("join-room", async (roomId) => {
  socket.join(roomId);
  const messages = await Message.find({ room: roomId }).sort({ timestamp: 1 });
  socket.emit("previous-messages", messages); // Send messages to user
});

  
     socket.on("send-message", async ({ room, content, senderId, receiverId }) => {
      console.log( room, content, senderId, receiverId)
     let decode="";
   if(senderId==""){
    let refresh_token=socket?.handshake?.headers.cookie.split('ref_token=');
       
      console.log(refresh_token[1],process.env.TOKENONE)
      try {
         decode=jwt.verify(refresh_token[1],process.env.TOKENONE)
      } catch (error) {
        return res.status(401).ClearCookie("ref_token",{
         httpOnly: true,
      sameSite: 'Strict',
      secure: true,
        }).json({message:"Invalid cookie please login again"})
      }
      console.log(decode?.userid)
senderId= decode?.userid

   }
     const saved = await Message.create({
       room:room, content:content, senderId:senderId , receiverId: receiverId});
    console.log(`Message from ${senderId} to room ${room}:`, content);
    
    // Send to others in the room
    console.log(senderId,content,receiverId)
    socket.to(room).emit('receive-message', {
  content: content,
  senderId,
  receiverId
});
  });
 socket.on('user-typing', (room) => {
    socket.to(room).emit('user-typing', room);
  });

  // ✅ Handle disconnect
  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.user.userid);
  });
});








 
 


















app.use(cors(CorsOption));



// API SETUP
app.get('/', (req, res) => {
  res.send('Backend is running')
})
app.get("/welcome",(req,res)=>{
  return res.status(200).json({success:true,message:"welcome user"})
})
app.use("/api/v1/user",userrouter)
app.use("/api/v1/company",companyrouter)
app.use("/api/v1/job",jobrouter)
app.use("/api/v1/application",applicationrouter)



app.use((err,req,res,next)=>{
  if(err){
    res.status(401).json({success:false,message:err.message||"Something went wrong. Please try again",data:null})
  }
})

server.listen(PORT, () => {
   try {
     DB_Connect()
   console.log(`Server is running on port ${PORT}`);
   } catch (error) {
    // console.log(error)
   }
});











