# SmallDemo
### Getting Started:
* Download the program from git
* Make a branch for your name
* Make sure you have some sort of terminal
* In the terminal route to where package.json is
* Type “npm build”, this will install all the dependencies from package.json
* Type “npm start”, this will run server.js - a node server
* Go to localhost:3000 in your web browser, and the application should be there
* If you wish to be in developer mode, run “node-dev server.js”. This will run the server, tell you of errors, and auto update every time you save.

* Adding new pages:
 * Open up server.js
 * Scroll down to “//pages”
 * Insert:
 ```app.get(‘/[yourpage]’, function(req,res){
		res.render(‘[yourpage]’;
});```
 * At the end of the //pages section
 * Go to views folder and create [yourpage].handlebars
 * In that, you can type any html that you need
