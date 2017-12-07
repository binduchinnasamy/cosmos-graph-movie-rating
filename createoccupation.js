var fs = require('fs');
var config = require("./config");
var Gremlin = require('gremlin');
module.exports = function () {
    return new Promise(function (resolve, reject) {
        const client = Gremlin.createClient(
            443,
            config.endpoint,
            {
                "session": false,
                "ssl": true,
                "user": `/dbs/${config.database}/colls/${config.collection}`,
                "password": config.primaryKey
            });
        fs.readFile('occupation.dat', function (err, data) {
            if (err) {
                console.log(err.errno);
            }
            var array = data.toString().split("\n");

            var promises = [];
            for (i in array) {
                //console.log(array[i]);
                var occupationdata = array[i].split("::");
                if (occupationdata.length === 2) {
                    var occupationid = occupationdata[0];
                    var occupation = occupationdata[1];
                    promises.push(createOccupationVertices(client, occupationid, occupation));
                }
            }
            Promise.all(promises).then(
                //console.log("Added Occupations")
                resolve()
            );
        });
    });
}
function createOccupationVertices(Client, occupationid, occupation) {
    return new Promise(function (resolve, reject) {
        console.log(`Creating Occupation Vertice ${occupation}`);
        Client.execute(`g.addV('occupation').property('id','${occupationid}').property('occupation','${occupation}')`, {}, function (err, results) {
            if (err) {
                console.log(err);
                //Do nothing, the occupation could be already avaialble
                //reject(err);
            }
            else {
                console.log(JSON.stringify(results));
                resolve(results);
            }
        });
    });
}
