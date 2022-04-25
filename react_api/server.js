const express = require("express")
const cors = require('cors')
const statueStore = require("./js/figuredb.js")
const purchaseStore = require("./js/purchasedb.js")
const app = express()

app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 8000

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload")

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(connectLiveReload())

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

app.get("/api/statues", (req, res, next) => {
    statueStore.find({}, function (err, docs) {
        res.json(docs);
    });
});

app.get("/api/statue/:id", (req, res, next) => {
    const id = req.params.id;
    statueStore.findOne({ _id: id }, function (err, docs) {
        res.json(docs);
    })
});

app.get("/api/purchases", (req, res, next) => {
    purchaseStore.find({}, function (err, docs) {
        res.json(docs);
    });
});

app.get("/api/purchase/:uid", (req, res, next) => {
    const uid = req.params.uid;

    purchaseStore.find({ user_id: uid }, function (err, docs) {
        res.json(docs);
    })
});

app.post("/api/purchase/", (req, res, next) => {
    const errors = []
    if (!req.body.item) {
        errors.push("No item specified");
    }

    const data = {
        statue_id: req.body.statue_id,
        quantity: req.body.quantity,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        city: req.body.city,
        postcode: req.body.postcode,
        state: req.body.state,
        email: req.body.email,
        date_added: new Date(Date.now()),
    }
    purchaseStore.insert(data, function (err, docs) {
        console.log('inserting new data with id' + docs._id)

        return res.json(docs);
    });
})

app.put("/api/purchase/:id", (req, res, next) => {
    const id = req.params.id;
    const errors = []
    if (!req.body.item) {
        errors.push("No item specified");
    }

    const data = {
        $set: {
            quantity: req.body.quantity,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            city: req.body.city,
            postcode: req.body.postcode,
            state: req.body.state,
            email: req.body.email,
            date_updated: new Date(Date.now)
        }
    }
console.log(id);
    purchaseStore.update({ _id: id }, data, function (err, docs) {
        console.log('updating data ' + docs)

        return res.json(data);
    });
})

app.delete("/api/purchase/:id", (req, res, next) => {
    const id = req.params.id;
    purchaseStore.remove({ _id: id }, function (err, numDeleted) {
        res.json({ "message": "deleted" })
    });
})

app.use(function (req, res) {
    res.sendStatus(404);
});