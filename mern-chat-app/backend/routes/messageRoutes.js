const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);








// !TODO

router.get("/getAllUserExceptUS",async(req,res)=>{
    const searchData=req.query.search;
    const keyword=req.query.search?
   { $or:[{name:{$regex:req.query.search}},
          {email:{$regex:req.query.search}}



    ]}:{};

    const data=await User.find(keyword).find({_id});
    res.send(data)



})


module.exports = router;
