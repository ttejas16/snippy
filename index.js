require('dotenv').config();
const path = require("path");
const port = 3000;
const { v4:uuidv4 } = require('uuid');
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDatabase } = require('./database');
const { User, Snippet } = require('./models');
const { authRequired } = require('./middlewares');
const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({
    extended: true
}))
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.render("home", { err: req.query.err });
})

app.post("/login", async (req, res) => {
    const userName = req.body.userName;

    let user = await User.findOne({ userName: userName })
    if (!user) {
        user = new User({ userName: userName });
        await user.save();
    }

    res.cookie("userName", userName, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 65 * 60 * 1000)
    });
    res.redirect("/snippets");
})

app.get("/logout", (req,res) => {
    res.cookie("userName","",{ expires: new Date(Date.now()) });
    res.redirect("/");
});


app.get("/snippets", authRequired, async (req, res) => {
    const userName = req.cookies.userName;

    const snippets = await Snippet.find({ userName: userName })
    console.log(snippets);

    res.render("snippets", { snippets: snippets, userName: userName });
})

app.get("/snippets/add", authRequired, (req, res) => {
    res.render("add");
})

app.post("/snippets/add", authRequired, async (req, res) => {
    const userName = req.cookies.userName;
    const title = req.body.title;
    const code = req.body.code;
    const language = req.body.language;
    console.log(req.body);
    
    const snippet = new Snippet({
        userName,
        code,
        title,
        language: language == "AutoDetect" ? undefined : language.trim(),
        snippetId: uuidv4()
    })
    await snippet.save();
    
    res.redirect("/snippets/add");
})

app.get("/snippets/:id", authRequired, async (req,res) => {
    const id = req.params.id;

    const snippet = await Snippet.findOne({ snippetId:id });
    if (!snippet) {
        res.redirect("/snippets");
        return;
    }

    console.log(snippet);
    
    res.render("snippetView", { snippet:snippet });
})

app.listen(port, () => {
    console.log(`server listening on port ${3000}`);
    connectDatabase();
})