var fs = require('fs');
var config = require("./config");
var Gremlin = require('gremlin');
var readline = require('readline');
var stream = require('stream');

module.exports = function() {
    return new Promise(function(resolve, reject){
    const client = Gremlin.createClient(
        443, 
        config.endpoint, 
        { 
            "session": false, 
            "ssl": true, 
            "user": `/dbs/${config.database}/colls/${config.collection}`,
            "password": config.primaryKey
        });
        
        var instream = fs.createReadStream('userssubset.dat');
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);
        
        rl.on('line', function(line) {
          // process line here
          //console.log(line);
          var userdata = line.split("::");
          if(userdata.length ===5){
            var useridvalue = parseInt(userdata[0]);  
            var userid = userdata[0];
            var gender = userdata[1];
            var age = parseInt(userdata[2]);
            var occupationid = userdata[3];
            crateUserVertices(client,userid,gender,age,occupationid)
            }
        });
        
        rl.on('close', function() {
          console.log("Finished creating users!");
        });
 });
}
function crateUserVertices(Client, userid,gender,age,occupationid){
   // return new Promise(function(resolve, reject){
        console.log(`Creating user Vertice ${userid}`);
        userid = 'u'+userid;
        occupationid = 'o'+occupationid;
        Client.execute(`g.addV('user').property('id','${userid}').property('gender','${gender}').property('age',${age}).addE('hasOccupation').to(g.V('${occupationid}'))`,{}, function(err,results){
            if (err){
                console.log(JSON.stringify(err));
                //Do nothing, the genere could be already avaialble
                //reject(err);
            }
            else {
                console.log(JSON.stringify(results));
               // resolve(results);
            }   
       // }); 
    });
}

