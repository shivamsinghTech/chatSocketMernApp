require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
// const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");


// const User=require('./models/userModel');
// const Chat = require("./models/chatModel");




const Port=process.env.PORT;
console.log(Port,"line 20")

connectDB();
const app = express();
app.use(express.json()); // to accept json data
app.get("/", (req, res) => {
  res.send("API Running!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// console.log(process.env.PORT,process.env.JWT_SECRET)

// todopractice1
    // ToDO::
// const express = require('express');

const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// var server = app.listen(4000)
// var io = require('socket.io').listen(server);

// var server = app.listen(8810);
// var io = require('socket.io').listen(server);


// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// server.listen(process.env.PORT || 4000);
// console.log('Server is running ');


// TODO: PRACTICE end
// todopracticeend
// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..",process.env.JWT_SECRET);
  });
}

// --------------------------deployment------------------------------

// !TODO

// app.get("/getAllUserExceptUS",async(req,res)=>{
//   const searchData=req.query.search;
//   const keyword=req.query.search?
//  { $or:[{name:{$regex:req.query.search}},
//         {email:{$regex:req.query.search}}
//   ]}:{};
//   try{

//   const data=await User.find(keyword).find();
//   res.send(data)
//   }
//   catch(e){res.send(e)}
// })


// app.get("/chatData/:id",async(req,res)=>{
//   try{
//   const data=await Chat.find({
//     isGroupChat:false,
//     $and:[
//       {users:{$elemMatch:{$eq:req.params.id}}},
//      /*  {users:{$elemMatch:{$eq:"39393"}}} */
//     ]
//   }).populate("users",-"password");
//   res.send(data)
// }
// catch(e){
//   res.send(e)
// }


// })

const server = http.createServer(app);
// server.listen(4000, () => {
//   console.log('listening on *:3000');
// });
// *!Todo end 


// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// const PORT = process.env.PORT;
// const PORT = 4000;
// console.log("PORT",process.env.PORT,process.env.JWT_SECRET)

// const server = app.listen(
//   process.env.PORT,
//   console.log(`Server running on PORT ${process.env.PORT}...`.yellow.bold)
// );
// !imp
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,
  },
});

// !imp-end

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
server.listen(4000, () => {
  console.log('listening on *:4000');
});