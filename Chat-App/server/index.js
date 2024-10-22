
const express = require("express");
const cookieParser = require("cookie-parser");


require("dotenv").config();

const connectDB = require("./config/connectDB");
const router = require("./routes/index");


const {app,server}=require("./socket/index")
//const app = express();


const cors = require('cors');
const corsOptions ={
    origin:process.env.FRONTEND_URL, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8080;

app.use("/api", router);
app.get("/", (req, res) => {res.json({ message: "Welcome to the API " + PORT, });});

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
