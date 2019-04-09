'use strict';

const express = require('express');

// Constants
const PORT = 1380;
const HOST = '0.0.0.0';

var mongo = require('mongodb');
var url = "mongodb://localhost:27018/";

function doFind(query, req, res, format='json') {
	var limit = parseInt(req.query.limit) || -1 
	if (limit === -1) {
		limit = 0
	}

	var days = parseInt(req.query.from) || Number.MAX_VALUE;
	var now = new Date()
	var from = new Date()
	from.setHours(0)
	from.setMinutes(0)
	from.setSeconds(0)
	from.setDate(from.getDate() - days);
	query.timestamp = {$gt: from, $lt: now}

	if (req.query.fields) {
		format = 'csv'
	}

	mongo.connect(url, { useNewUrlParser: true }).then((mcli) => {
		return mcli.db('ioc').collection('iocs').find(query).sort({timestamp: -1}).limit(limit).toArray()
	}).then((docs) => {
		if (format === 'json') {
			res.write(JSON.stringify(docs))
		} else if (format === 'text') {
			for(var idx in docs) {
				res.write(docs[idx].value);
				res.write("\n");
			}
		} else if (format === 'csv') {
			var fields = ['value']
			if (req.query.fields) {
				fields = req.query.fields.split(',')
			}
			for(var idx in docs) {
				for(var fidx in fields) {
					res.write(String(docs[idx][fields[fidx]]));
					if (fidx < fields.length - 1) {
						res.write(",");
					}
				}
				res.write("\n");
			}
		}
		res.end()
	});
}
function doAggregate(query, req, res, format='list') {
	mongo.connect(url, { useNewUrlParser: true }).then((mcli) => {
		return mcli.db('ioc').collection('iocs').aggregate(query).toArray()
	}).then((docs) => {
		if (format === 'json') {
			res.write(JSON.stringify(docs))
		} else if (format === 'list') {
                        for (var idx in docs) {
                                res.write(docs[idx]._id + ': ' + docs[idx].count)
                                res.write("\n");
                        }
		}
                res.end()
	});
}

// App
const app = express();
app.get('/ioc/get/:value', (req, res) => {
	var value = req.params.value
	doFind({value: value}, req, res)
});
app.get('/ioc/find/:value', (req, res) => {
	var value = req.params.value
	doFind({$text: {$search: '"' + value + '"'}}, req, res)
});
app.get('/ioc/search/:value', (req, res) => {
	var value = req.params.value
	doFind({value: {$regex: value}}, req, res)
});
app.get('/ioc/stats/search/:value', (req, res) => {
	var value = req.params.value
	doAggregate([{$match: {value: {$regex: value}}}, {$group: {_id: '$type', count: {$sum: 1}}}, {$sort: {count: -1}}], req, res)
});
app.get('/ioc/stats/:type', (req, res) => {
	var _type = req.params.type
	doAggregate([{$group: {_id: '$' + _type, count: {$sum: 1}}}, {$sort: {count: -1}}], req, res)
});
app.get('/ioc/:format/:type', (req, res) => {
	var query = { type: req.params.type };
	doFind(query, req, res, req.params.format)
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
