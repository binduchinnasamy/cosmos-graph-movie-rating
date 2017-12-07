var fs = require('fs');
var config = require("./config");
var Gremlin = require('gremlin');
var readline = require('readline');
var stream = require('stream');


module.exports = function (moviefile) {
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

        var instream = fs.createReadStream(moviefile);
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);

        rl.on('line', function (line) {
            // process line here
            console.log(line);
            var movidedata = line.split("::");
            if (movidedata.length === 3) {
                var movieid = movidedata[0];
                var moviename = movidedata[1];
                var moviegenere = movidedata[2].split("|");
                crateGener(client, moviegenere).then(createMovieNodes(client, movieid, moviename, moviegenere));
            }
        });

        rl.on('close', function () {
            // do something on finish here
        });

    });
}

function createMovieNodes(Client, movieid, movietitle, moviegenere) {
    return new Promise(function (resolve, reject) {
        console.log(`Creating Movie Vertice ${movietitle}`);
        movietitle = movietitle.replace(/['%$;&�',]/g, "").substring(0, movietitle.length - 6);
        Client.execute(`g.addV('movie').property('id','${movieid}').property('title','${movietitle}')`, {}, function (err, results) {
            if (err) {
                console.error(err);
                //Do nothing, the genere could be already avaialble
                //reject(err);
            }
            else {
                console.log(results);
                for (var genere of moviegenere) {
                    createEdges(Client, movieid, genere);
                }
                resolve(results);
            }
        });
    });
}
function createEdges(Client, movieid, genere) {
    genere = genere.replace(/['%$;&]/g, "");
    var gremQuery = `g.V('${movieid}').addE('hasGenere').to(g.V('${genere}'))`;
    console.log(`Creating edge for movie ${movieid} to genere ${genere}`);
    Client.execute(gremQuery, {}, (err, results) => {
        if (err) {
            console.error(JSON.stringify(err));
        }
        else {
            //console.log(JSON.stringify(results));
        }
        //console.log(JSON.stringify(results));                                                                     
    });
}
function crateGener(Client, generes) {
    return new Promise(function (resolve, reject) {
        for (var genere of generes) {

            var generestring = genere.replace(/['%$;]/g, "")
            console.log(`Creating genere ${generestring}`);
            Client.execute(`g.addV('genere').property('id','${generestring}').property('name','${generestring}')`, {}, function (err, results) {
                if (err) {
                    //Do nothing, the genere could be already avaialble
                    //console.log(JSON.stringify(err));
                    console.error(JSON.stringify(err));
                    //reject(err);
                }
                else {
                    console.log(JSON.stringify(results));
                    resolve(results);
                }
            });
        }
    });
}