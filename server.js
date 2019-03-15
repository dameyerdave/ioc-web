'use strict';

const express = require('express');

// Constants
const PORT = 1380;
const HOST = '0.0.0.0';

var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27018/";


// App
const app = express();
app.get('/:type', (req, res) => {
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var ioc = db.db('ioc')
		var query = { type: req.params.type };
		ioc.collection('iocs').find(query).limit(10).toArray( (err, results) => {
			if (err) throw err;
			for(var idx in results) {
				res.write(results[idx].value);
				res.write("\n");
			}
			res.end();
			db.close();
		});
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
