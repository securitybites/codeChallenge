/**
 * Created by jessekinser on 8/21/15.
 */
var http = require('http'),
    fs = require('fs');




//Logout the user
exports.logout = function (req, res) {
    //Basic auth doesnt really play nice with logout so you have to
    //hack this a bit by passing in bad creds

    http.get("http://baduser:badpass@127.0.0.1:1337/login", function (res) {
        console.log("You have been logged out.");
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("You have been logged out of the system.");

};

//Create Configurations Controller
exports.createConfig = function (req, res, chunk) {

    //NEW: Open File, parse the json into a object, push new config onto object, then rewrite file
    fs.readFile('./serverConfig.json', function (err, data) {
        if (err) throw err;
        console.log(data);

        //Parse JSON as object
        var configData = JSON.parse(data);
        console.log(configData);

        configData.configurations.push(JSON.parse(chunk));
        console.log(configData);

        //Add configuration
        fs.writeFile('./serverConfig.json', JSON.stringify(configData), function (err, data) {
            if (err) throw err;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("POST successful \n" + JSON.stringify(configData));

        });
    });


};

//Get Configurations Controller
exports.getConfig = function (req, res, query) {
    fs.readFile('./serverConfig.json', function (err, data) {
        if (err) throw err;
        // If sorting or pagination is needed
        if(query){
            query = parseQuery(query);
            //Sort by query

            //If sort by is declared, then sort
            var sorted = JSON.parse(data);
            sorted = sorted.configurations;
            if(query.sortby){
              sortByKey(data, query.sortby, function (response, err) {
                    if (err) throw err;
                    sorted = response;

                });
            }
            if(query.page){
                //Paginate the array to 4 items per page
               var page_max = 5;
                var start = (query.page -1) * page_max + 1;
                var end = query.page * page_max;

                var sorted = sorted.slice(start,end);

                console.log(sorted);
            }

            //Send the sorted and/or paginated data
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(sorted));

        }
        //If no query string
        else{
            data = JSON.parse(data);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(data));
        }




    });

};

//Delete Configurations Controller
exports.deleteConfig = function (req, res, query) {
    // Parse query string
    var parsedQuery = parseQuery(query);

    fs.readFile('./serverConfig.json', function (err, data) {
        if (err) throw err;

        //Parse JSON as object
        var configData = JSON.parse(data);

        //Find configuartion by query name, then delete it
        deleteByName(configData.configurations, parsedQuery.configName, function(result,err){
            if(err) throw err;
            else{
                //Add configuration
                configData.configurations = result;

                fs.writeFile('./serverConfig.json', JSON.stringify(configData), function (err, data) {
                    if (err) throw err;

                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end("DELETE successful \n" + JSON.stringify(configData) );

                });
            }
        })

    });

};

//Edit Configurations Controller
exports.editConfig = function (req, res, query, changes) {
    // Parse query string
    var parsedQuery = parseQuery(query);

    fs.readFile('./serverConfig.json', function (err, data) {
        if (err) throw err;

        //Parse JSON as object
        var configData = JSON.parse(data);

        //Find configuartion by query name, then delete it
        modifyByName(configData.configurations, parsedQuery.configName, changes, function (result, err) {
            if (err) throw err;
            else {
                //Add configuration
                configData.configurations = result;

                fs.writeFile('./serverConfig.json', JSON.stringify(configData), function (err, data) {
                    if (err) throw err;

                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end("UPDATE successful \n" + JSON.stringify(configData));

                });
            }
        })

    });


};

//Hmm, looks like you have hit a dead end.
exports.display_404 = function (req,res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write("<h1> 404 Not Found </h1>");
    res.end("Sorry nothing here...");
};

//Parse some query strings, oh yeah.
function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(0).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

//Local helper to delete by name
function deleteByName(arr, name, callback) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
        if (arr[d].name === name) {
            var cleanArr = arr.splice(arr[d], 1);
            console.log(cleanArr);
            break;
        }
    }
    callback(arr);
}

//Local helper to modify by name
function modifyByName(arr, name, changes, callback) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
        if (arr[d].name === name) {
            //if matching query, then change

            arr[d] = JSON.parse(changes);
            break;
        }
    }
    callback(arr);
}

//Local helper to sort
function sortByKey(arr, name, callback) {

    arr = JSON.parse(arr);
    var configs = arr.configurations;

    if(name === 'port'){
        var configsSorted = configs.sort(sort_by(name, parseInt));
    }
    else{
        var configsSorted = configs.sort(sort_by(name, false, function (a) {
            return a.toUpperCase()
        }));
    }


    callback(configsSorted);
}

//Local helper to sort on A-Z and numbers
function sort_by(field, reverse, primer) {
    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}