let store = require("nedb")
let fs = require('fs');
let musics = new store({ filename: "db/statues.db", autoload: true })

musics.find({}, function (err, docs) {
    if (docs.length == 0) {
        loadData();
    }
})

function loadData() {
    readCsv("./statues.csv", function (data) {
        console.log(data);
        data.forEach(function (rec, idx) {
            item = {}
            item.name = rec[0];
            item.price = parseFloat(rec[1]);
            item.description = rec[2];
            item.image = rec[3];
            musics.insert(item, function (err, doc) {
                console.log('Inserted into statues', doc.name, 'with ID', doc._id);
            })
        })
    })
}

function readCsv(file, callback) {
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) throw err;
        var lines = data.split('\r\n');
        var result = lines.map(function (line) {
            return line.split(',');
        });
        callback(result);
    });
}

module.exports = musics