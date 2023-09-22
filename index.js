const express = require("express");
const cors = require("cors");
const {
    yt5s,
    tikvideo,
    snapinsta,
    snapsave,
    snaptwitter,
    imglargerCartoonizer,
    y2mate,
    yt5sq,
    savefrom,
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

app.get("/", (req, res) => {
    res.send("running..");
});

app.get("/yt", async (req, res) => {
    const { url } = req.query;
    res.json(await savefrom(url));
});

app.get("/yt4", async (req, res) => {
    const { url, format } = req.query;
    res.json(await yt5sq(url, format || "mp4"));
});

app.get("/yt3", async (req, res) => {
    const { url, format } = req.query;
    res.json(await y2mate(url || "mp4"));
});

app.get("/yt2", async (req, res) => {
    const { url, format } = req.query;
    res.json(await yt5s(url, format || "mp4"));
});

app.get("/tt", async (req, res) => {
    const { url } = req.query;
    res.json(await tikvideo(url || "mp4"));
});

app.get("/tt", async (req, res) => {
    const { url } = req.query;
    res.json(await tikvideo(url || "mp4"));
});

app.get("/ig", async (req, res) => {
    const { url } = req.query;
    res.json(await snapinsta(url || "mp4"));
});

app.get("/fb", async (req, res) => {
    const { url } = req.query;
    res.json(await snapsave(url || "mp4"));
});

app.get("/twt", async (req, res) => {
    const { url } = req.query;
    res.json(await snaptwitter(url || "mp4"));
});

app.get("/cartoon", async (req, res) => {
    let { img } = req.query;
    res.json(await imglargerCartoonizer(img || "mp4"));
});

app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
});
