var createmovies = require("./createmovies.js");
var createoccupations = require("./createoccupation.js");
var createusers = require("./createusers.js");
var addrating = require("./addratings.js");
const args = require('yargs').argv;
var mode = args.mode;
switch(mode) {
    case 'movieset1':
        createmovies('movies.dat');
         break;
    case 'movieset2':
        createmovies('movies1.dat');
    break;
    case 'movieset3':
        createmovies('movies2.dat');
    break;
    case 'movieset4':
        createmovies('movies3.dat');
    break;
    case 'occupation':
        createoccupations()
    break;
    case 'users':
        createusers()
    break;
    case 'rating1':
        addrating(0,500);
    break;
    case 'rating2':
        addrating(500,1000);
    break;
    case 'rating3':
        addrating(1000,1500);
    break;
    case 'rating4':
        addrating(1500,2000);
    break;
}

//You can also use the following Promis chain model when dealing with small dataset
//createmovies().then(()=>createoccupations()).then(()=>createusers());
