///<reference path="c:\DefinitelyTyped\node\node.d.ts"/>
///<reference path="c:\DefinitelyTyped\express\express.d.ts"/>
///<reference path=".\jsdom.d.ts"/>
///<reference path=".\passport.d.ts"/>
///<reference path=".\passport-google.d.ts"/>
///<reference path=".\express-flash.d.ts"/>

import http = require("http");
import routes = require("./routes/routes")
import path = require("path")
import express = require("express")
import fs = require("fs")
//import url = require("url")
import flash = require("express-flash")

import passport = require("passport")
import GoogleStrategy = require("passport-google")
var strategy = GoogleStrategy.Strategy;

var parseCookie = express.cookieParser()
//var MemStore = express.ses
import jsdom = require("jsdom")

import db = require("./db")
import parse = require("./parsers")


var app = express();

//Configuration
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('guess again'))
app.use(express.session({
    key: 'sid',
    secret:'guess again'
}))
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())
app.use(app.router);
app.use(passport.session())
app.use(flash())


// passport configuration
passport.use(
    new strategy({
	    returnURL: 'http://192.168.1.47:'+app.get('port') + '/auth/google/return',
	    realm: 'http://192.168.1.47:' + app.get('port')
    },
        function (id, prof, done) {
            db.User.findOrCreate({ email: prof.emails[0].value, name: prof.displayName }, function (user) {
                console.log(user, 'user authorized')
                done(null, user)
            })
            //done(null, { email: prof.emails[0].value, name: prof.displayName })
    })
)

passport.serializeUser = function (user, done) {
    done(null, user)
}
passport.deserializeUser = function (user, done) {
    done(null, user)
}
app.get('/', routes.index);

app.get('/auth/google', passport.authenticate('google'));
//app.post('/auth/google', passport.authenticate('google'))
app.get('/auth/google/return',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
    })
)

app.post('/url', routes.parseRecipe);
app.post('/addNote', routes.addNote)
app.get('/recipes', routes.recipes)
app.get('/home', routes.home)

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

