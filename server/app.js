var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var phantom = require('phantom');



var htmlStringArray = [];
var sitepage = null;
var phInstance = null;

// var serverStartingAt = new Date().getTime();
// console.log('Server code being read @ ', serverStartingAt);
console.log('server has started to run :)')

phantom.create()
    .then(instance => {
        // var returns = new Date().getTime();
        // console.log('creatingPage:', (serverStartingAt - returns) / 1000 * -1)
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        // var returns = new Date().getTime();
        // console.log('openingPage:',(serverStartingAt - returns) / 1000 * -1)  // roughly max 9 sec to open page

        sitepage = page;
        return page.open('https://es.oxforddictionaries.com/translate/english-spanish/water?locale=en');
    })
    .then(status => {
        // var returns = new Date().getTime();
        // console.log('grabbingContent:',(serverStartingAt - returns) / 1000 * -1)

        return sitepage.property('content');
    })
    .then(content => {
        // var returns = new Date().getTime();
        // console.log('searchingContent:', (serverStartingAt - returns) / 1000 * -1)


        var translationTag = content.search('hw head-translation') + 44
        var translationEnd = content.search('<em class="rs_skip">') - 2
        console.log(content.substring(translationTag, translationEnd)) //translation


        //CONNECT TO DB HERE -
        // pg.connect(connectionString, function(err, client, done) .... etc.


    })
    .then(content => {
        sitepage.close();
        // var returns = new Date().getTime();
        // console.log('closingPage:', (serverStartingAt - returns) / 1000 * -1)
        phInstance.exit();
    })
    .catch(error => {
        console.log(error);
        phInstance.exit()
    })



app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    // console.log('Clientside is now running on : ', app.get('port'));
});
