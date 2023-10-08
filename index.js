const express = require("express");
const cors = require("cors");
const {
    yt5s,
    tikvideo,
    snapinsta,
    snapsave,
    snaptwitter,
    imglargerCartoonizer,
} = require("./scrapper");
const app = express();
const PORT = process.env.PORT || 2121;

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

const ytvid = async (req, res) => {
    const url = req.query.url || req.body.url || req.headers.url;
    const format = req.query.format || req.body.format || req.headers.format;
    res.json(await yt5s(url, format || "mp4"));
};

const ytaudio = async (req, res) => {
    const url = req.query.url || req.body.url || req.headers.url;
    const format = req.query.format || req.body.format || req.headers.format;
    res.json(await yt5s(url, format || "mp3"));
};

app.all("/", (req, res) => {
    res.json({ text: "Running.." });
});

app.all("/yt", ytvid);
app.all("/ytvid", ytvid);
app.all("/ytmp4", ytvid);

app.all("/ytmp3", ytaudio);
app.all("/ytaudio", ytaudio);

app.all("/tt", async (req, res) => {
    const url = req.query.url || req.body.url || req.headers.url;
    res.json(await tikvideo(url));
});

app.all("/ig", async (req, res) => {
    const url = req.query.url || req.body.url || req.headers.url;
    res.json(await snapinsta(url));
});

app.all("/fb", async (req, res) => {
    const url = req.query.url || req.body.url || req.headers.url;
    res.json(await snapsave(url));
});

app.all("/twt", async (req, res) => {
    const url = req.query.url || req.body.url || req.headers.url;
    res.json(await snaptwitter(url));
});

app.all("/cartoon", async (req, res) => {
    let { img } = req.query;
    res.json(await imglargerCartoonizer(img));
});

app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
});
