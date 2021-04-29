require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

//--->MAILGUN CONFIG___\\\\\
const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const app = express();
app.use(formidable());
app.use(cors());

app.post("/form", (req, res) => {
  const form = {
    from: `${req.fields.firstName} ${req.fields.lastName} <${req.fields.email}> `,
    to: "idevandyou@gmail.com",
    subject: `Sujet ${req.fields.subject}`,
    text: `${req.fields.message}`,
  };
  console.log(form);
  mailgun.messages().send(form, (error, body) => {
    console.log(body);
    console.log(error);
    if (!error) {
      return res.status(200).json(body);
    }
    res.status(401).json(error);
    res.json(body);
    res.send("Document sent");
  });
});

app.get("/", (req, res) => {
  res.send("server is up");
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Cette route n'existe pas." });
});

app.listen(process.env.PORT, () => {
  console.log("Server launched");
});
