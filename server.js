var http = require('http');
var express = require('express') //handles client requests
var mysql = require('mysql'); //enables working with mySQL database
var bodyParser = require('body-parser');

var app = express()
app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var covid_location;
var covid_date;

//------------------------- Database connection -------------------------------
//create connection
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', //ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
    database: 'covid'
});

db.connect(function (err) {
    if (!err) {
        console.log("Database is connected...")
    }
    else {
        console.log("Error while connecting with database");
    }
});



//-----------------------Adding new location ----------------------------------

app.get('/addListPage', function (req, res) {
    console.log("Rending add list page...")
    var tabl_html = '<h2>its working</h2>'

    var table_html = `
          <button class="button button4" onclick="addRestaurant();">Add Restaurant</button>`

    res.send(table_html);
});


app.post('/addLocation', function (req, res) {
    console.log("Processing add...")

    var user = "Tutu";
    var location = db.escape(req.body.Location);
    var date = db.escape(req.body.Date);
    console.log('Username:' + user + ' Location: ' + location + ' Date: ' + date);


    sql_cmd = `INSERT INTO
                locations(name, location, date)
              VALUES
                ("` + user + `",` + location + `,` + date + `); `

    //insert into locations(name, location, date) values("Dila", "Upenn", "2020-08-02");

    //update lacation table with data
    db.query(sql_cmd, function (err, rows, fields) {
        if (err) throw err;
        //res.send("New Location Added!");
    });
});

//----------------- Load Location ---------------------------------------------
//set the values that will be used in select statement later
app.post('/testLocation', function (req, res) {
    var user = "Tutu";
    covid_location = req.body.Location;
    covid_date = req.body.Date;
    console.log('Username:' + user + ' Location: ' + covid_location + ' Date: ' + covid_date);
    //res_html = '<button onClick = "loadLocation();">load data</button>'
    res.send("cool");

});

//generate the user's list from database
app.get('/loadLocation', function (req, res) {
    var user = "Tutu";
    //var location = db.escape(req.body.Location);
    //var date = db.escape(req.body.Date);
    //console.log('-----Username:' + user + ' Location: ' + covid_location + ' Date: ' + covid_date);
    var location = covid_location;
    var date = covid_date;
    console.log('Username:' + user + ' Location: ' + location + ' Date: ' + date);

    db_cmd = `SELECT name, location, date FROM locations WHERE location = "` + covid_location + `" AND date = "` + covid_date + `";`

    //select name, location, date from locations where location = "Upenn";
  
    db.query(db_cmd, function(err, rows, fields){
      if (err) throw err;
      console.log("Generating user's table");
  
      var table_html = `<body><div><a class="exit" href="loadlocation.html">Exit</a><div style = "width: 100%; margin-top: 4rem;"><table border= "1" rules="rows" id="list"><tr>`
      var headers = [];
  
      for( i = 0; i < fields.length; i++){
        headers.push(fields[i].name);
        table_html += '<th>' + fields[i].name + '</th>';
      }
      table_html += '</tr>';
  
      for( i = 0; i < rows.length; i++){
        table_html += '<tr>'
        for( j = 0; j < headers.length; j++){
          table_html += '<td>' + rows[i][headers[j]] + '</td>';
        }
        table_html += '</tr>';
      }
      table_html += '</table></div></div></body>';
      table_html += '<div class="navbar"><a href="addlocation.html"><i class="fa fa-home"></i></a><a href="#"><i class="fa fa-list"></i></a><a href="#"><i class="fa fa-thermometer-quarter"></i></a><a href="#"><i class="fa fa-users"></i></a><a href="#"><i class="fa fa-user-circle"></i></a></div>';
  
  
      res.send(table_html);
    });
});

app.get('/myLocations', function (req, res) {
    var user = "Tutu";
    db_cmd = `SELECT name, location, date FROM locations WHERE name = "` + user + `";`

    db.query(db_cmd, function(err, rows, fields){
        if (err) throw err;
        console.log("Generating tutu's table");
    
        var table_html = `<body><div><a class="exit" href="addlocation.html">Exit</a><div style = "width: 100%; margin-top: 4rem;"><table border= "1" rules="rows" id="list"><tr>`
        var headers = [];
    
        for( i = 0; i < fields.length; i++){
          headers.push(fields[i].name);
          table_html += '<th>' + fields[i].name + '</th>';
        }
        table_html += '</tr>';
    
        for( i = 0; i < rows.length; i++){
          table_html += '<tr>'
          for( j = 0; j < headers.length; j++){
            table_html += '<td>' + rows[i][headers[j]] + '</td>';
          }
          table_html += '</tr>';
        }
        table_html += '</table></div></div></body>';
        table_html += '<div class="navbar"><a href="addlocation.html"><i class="fa fa-home"></i></a><a href="#"><i class="fa fa-list"></i></a><a href="#"><i class="fa fa-thermometer-quarter"></i></a><a href="#"><i class="fa fa-users"></i></a><a href="#"><i class="fa fa-user-circle"></i></a></div>';

    
        res.send(table_html);
      });


});

app.listen(8080, function () {
    console.log('Server Running');
});