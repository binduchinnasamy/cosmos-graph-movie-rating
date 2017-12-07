var fs = require('fs');
var config = require("./config");
var Gremlin = require('gremlin');
var readline = require('readline');
var stream = require('stream');

module.exports = function(start, end) {
    //return new Promise(function(resolve, reject){
    const client = Gremlin.createClient(
        443, 
        config.endpoint, 
        { 
            "session": false, 
            "ssl": true, 
            "user": `/dbs/${config.database}/colls/${config.collection}`,
            "password": config.primaryKey
        }); 
        
        var instream = fs.createReadStream('ratingsubset.dat');
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);
        
        rl.on('line', function(line) {
          // process line here
         // console.log(line);
          var ratingdata = line.split("::");
          if(ratingdata.length ===4){
            var useridvalue = parseInt(ratingdata[0]);
            if(useridvalue>=start && useridvalue<end) {
            var userid = ratingdata[0];
            var movieid = ratingdata[1];
            var rating = parseInt(ratingdata[2]);
            //promises.push(crateRatingEdges(client,userid,movieid,rating));
           crateRatingEdges(client,userid,movieid,rating);}
        }
        });
        rl.on('close', function() {
          // do something on finish here
        });
}
function crateRatingEdges(Client,userid,movieid,rating){
   // return new Promise(function(resolve, reject){
        console.log(`Creating rating edges ${userid} with movieid ${movieid}`);
        userid = 'u'+userid;
        var gremQuery =  `g.V('${userid}').addE('rated').to(g.V('${movieid}')).property('stars',${rating})`;
        Client.execute(gremQuery,{}, function(err,results){
            if (err){
                console.log(JSON.stringify(err));
                //Do nothing, the genere could be already avaialble
                //reject(err);
            }
            else {
                console.log(JSON.stringify(results));
                //resolve(results);
            }   
        }); 
   // });
}

