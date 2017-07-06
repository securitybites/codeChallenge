/**
 * Created by jessekinser on 8/21/15.
 */

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    controller = require('./controllers/mainControls'),
    middleware = require('./middleware/middleware');

var port = 1337,
    ip = '127.0.0.1';


http.createServer(function(req,res){

        //Parse the URL for routing
        var _get = url.parse(req.url);
        var query = url.parse(req.url).query;
        var path = _get.pathname;

        console.log(path);

        //API Routes
        switch(path){
            case '/':
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end("Hello Tenable");
                break;

            case '/login':
                middleware.login(req, res, function(err){
                   if(err){
                       //Wrong username or password
                       res.writeHead(401, {'Content-Type': 'text/plain'});
                       res.end(err);
                   }
                    else{
                       //Login successful
                       res.writeHead(200, {'Content-Type': 'text/plain'});
                       res.end("Looks like you own the keys to the kingdom.");
                   }
                });
                break;
            case '/logout':
                //Logout user by giving bad creds in basic auth. This is one
                //of the limitations of basic auth, because there isnt really a good way to logout.
                controller.logout(req,res);
                break;

            case '/getConfigs':
                //Authenticate user using basic auth first
                middleware.login(req, res, function (err) {
                    if (err) {
                        //Wrong username or password
                        res.writeHead(401, {'Content-Type': 'text/plain'});
                        res.end("Missing and/or wrong username or password");
                    }
                    else {
                        //Login successful, now show config data
                        controller.getConfig(req, res , query);

                    }
                });
                break;

            case '/createConfigs':
                //Authenticate user using basic auth first
                middleware.login(req, res, function (err) {
                    if (err) {
                        //Wrong username or password
                        res.writeHead(401, {'Content-Type': 'text/plain'});
                        res.end("Missing and/or wrong username or password");
                    }
                    else {
                        //Login successful
                        //If a post request, create configs
                        if (req.method === 'POST') {

                            req.on('data', function (chunk) {
                                console.log("Received body data:");
                                console.log(chunk.toString());
                                controller.createConfig(req, res, chunk);
                            });
                        }
                        else {
                            res.writeHead(401, {'Content-Type': 'text/plain'});
                            res.end("Retry using the POST method");
                        }
                    }
                });
                break;
            case '/deleteConfig':
                //Authenticate user using basic auth first
                middleware.login(req, res, function (err) {
                    if (err) {
                        //Wrong username or password
                        res.writeHead(401, {'Content-Type': 'text/plain'});
                        res.end("Missing and/or wrong username or password");
                    }
                    else {
                        //Login successful
                        //If a post request, create configs
                        if (req.method === 'POST') {

                            controller.deleteConfig(req,res,query);

                        }
                        else {
                            res.writeHead(401, {'Content-Type': 'text/plain'});
                            res.end("Retry using the POST method");
                        }
                    }
                });
                break;
            case '/editConfig':
                //Authenticate user using basic auth first
                middleware.login(req, res, function (err) {
                    if (err) {
                        //Wrong username or password
                        res.writeHead(401, {'Content-Type': 'text/plain'});
                        res.end("Missing and/or wrong username or password");
                    }
                    else {
                        //Login successful
                        //If a post request, modify config
                        if (req.method === 'POST') {

                            req.on('data', function (chunk) {
                                console.log("Received body data:");
                                console.log(chunk.toString());
                                controller.editConfig(req, res, query, chunk);
                            });

                        }
                        else {
                            res.writeHead(401, {'Content-Type': 'text/plain'});
                            res.end("Retry using the POST method");
                        }
                    }
                });
                break;

            default:
                controller.display_404(req,res);
                break;
        }







}).listen(port, ip);



console.log("Hello Tenable");
