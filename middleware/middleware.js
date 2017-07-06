/**
 * Created by jessekinser on 8/21/15.
 */

//Login user credentials
exports.login = function (req, res, callback) {

    var header = req.headers['authorization'] || '',        // get the header
        token = header.split(/\s+/).pop() || '',            // and the encoded auth token
        auth = new Buffer(token, 'base64').toString(),    // convert from base64
        parts = auth.split(/:/),                          // split on colon
        username = parts[0],
        password = parts[1];

    //If using correct creds then let them through. This is where you could look
    //against a Active Directory instance or some other cred bank.
    if(username === 'user1' & password === 'secret'){
        callback();
    }
    //Faking the reauth to help with the logout fuction. This is why we should never use basic auth in prod.
    else if(username === 'baduser' & password === 'badpass'){
        callback("You have been successfully logged out.")
    }
    else{
        callback("Error: User not valid");
    }


};