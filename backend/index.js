
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://Sneha1:123@cluster0.thugit9.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Failed to connect"));

const credential = mongoose.model("credential", {}, "bulkmail");

const historySchema = new mongoose.Schema({
  msg: String,
  emaillist: [String],
  time: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);


app.post("/sendemail", async function (req, res) {
  const { msg, emaillist } = req.body;

  try {
    const data = await credential.find();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    for (let i = 0; i < emaillist.length; i++) {
      await transporter.sendMail({
        from: data[0].toJSON().user,
        to: emaillist[i],
        subject: "A message from BulkMail App",
        text: msg,
      });
      console.log("Email sent to: " + emaillist[i]);
    }

    await History.create({ msg, emaillist });

    res.send(true);
  } catch (error) {
    console.error("Sending failed", error);
    res.send(false);
  }
});


app.post("/login", (req, res) => {
  if (req.body.password === "123") {
    res.send(true);
  } else {
    res.send(false);
  }
});


app.get("/history", async (req, res) => {
  try {
    const records = await History.find();
    res.json(records);
  } catch (err) {
    res.status(500).send("Error fetching history");
  }
});

app.listen(5000, () => {
  console.log("Server Started...");
});
