require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const bcrypt = require("bcryptjs");


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* -------------------- MongoDB Connection -------------------- */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

const PORT = process.env.PORT || 3000;

/* -------------------- Schema -------------------- */

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", UserSchema);

/* -------------------- Signup Route -------------------- */

app.post("/app_user", async (req, res) => {
    try {

        const { name, password } = req.body;

        // check existing user
        const existingUser = await User.findOne({ name });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            password: hashedPassword
        });

        await user.save();

        res.send("Signup successfully completed");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

/* -------------------- Login Route -------------------- */

app.post("/app_find", async (req, res) => {
    try {

        const { name, password } = req.body;

        const user = await User.findOne({ name });

        if (!user) {
            return res.status(400).send("User not found");
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.status(200).send("Login Success");
        } else {
            res.status(400).send("Invalid Password");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

/* -------------------- Server -------------------- */

app.get("/", (req, res) => {
  res.send("API running");
});

module.exports = serverless(app);