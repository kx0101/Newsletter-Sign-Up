const express = require('express');
const { Http2ServerRequest } = require('http2');
const http = require('https');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };
    
    const jsonData = JSON.stringify(data);

    const url = 'https://us20.api.mailchimp.com/3.0/lists/8aab1fd4f3';

    const options = {
        method: "POST",
        auth: "Elijah:447c958a568acf7376ebb762b8cbd604-us20"
    }

    const request = http.request(url, options, function(response){

        if ( response.statusCode === 200 ) {
                res.sendFile(__dirname + "/success.html");
        } else {
                res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
})
