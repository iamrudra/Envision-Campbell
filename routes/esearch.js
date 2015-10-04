var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
var searchquery = "amplifier";
router.get('/esearch', function(req, res, next) {
	//searchquery = req.params.query;
	client.search({
		fields: "title",
		  body: {
		    query: {
		    	query_string: {
		    	      query : searchquery
		    	    }
		    },
		    highlight: {
		        fields : {
		          file : {}
		        }
		      }

		  }
		}).then(function (resp) {
		    var hits = resp.hits.hits;
		    var title = hits[0].fields;
		    
		    //var spliArr = hits[0].fields.toString().split(":");
		    //console.log(spliArr);
		    /*var PropertiesReader = require('properties-reader');
			var properties = PropertiesReader('./properties.file');
			if(properties.get("ISL99201_Datasheet").replaceALL("_"," ") == hits[0].fields.file.title){
				console.log("MAtch "+hits[0].fields.file.title);
			}else if(properties.get("None").replaceALL("_"," ") == hits[0].fields.file.title){
				console.log("MAtch "+hits[0].fields.file.title);
			}else if(properties.get("Microsoft_Word_-_GENERAL_Plan.doc").replaceALL("_"," ") == hits[0].fields.file.title){
				console.log("MAtch "+hits[0].fields.file.title);
			}else if(properties.get("General_Plan_Map_(November_2013)_201501091304499355.pdf").replaceALL("_"," ") == hits[0].fields.file.title){
				console.log("MAtch "+hits[0].fields.file.title);
			}*/
			
		}, function (err) {
		    console.trace(err.message);});
		});
module.exports = router;