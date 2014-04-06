///<reference path="c:\DefinitelyTyped\express\express.d.ts"/>

import express = require("express")
import parse = require("../parsers")
import db = require("../db")

export function index(req: express.Request, res: express.Response) {
    // send user data
    var user = req.session.passport.user
    if (user) {
        //console.log(user)
        res.redirect('/home')
    }
    else {
        console.log("no user in session")

        // get all recipes
		db.allRecipes(function (docs) {
			res.render('index', {
				title: 'Recipe Site',
				user: user,
				recipes: docs
			})
        })
    }
};

export function recipes(req, res) {
    res.render('recipe')
}

export function parseRecipe(req, res) {
    //if (!req.session.user) {
    //    req.flash('url-form-error', 'need to be logged in')
    //    res.redirect('/')
    //}
    parse.marthS(req.body.url, function (recipe) {
        //console.log(recipe)
        //res.render('recipe', recipe)
        recipe.contrib = req.session.passport.user,
        db.insertRecipe(recipe, function (msg) {
            //console.log(msg)
        })
        res.redirect('/')
    })

}

export function home(req: express.Request, res: express.Response) {
    var user = req.session.passport.user
    db.recipes({ 'contrib.email': user.email }, function (recipes) {
        res.render('home', {
            user: user,
            recipes: recipes
        })
    })
}

export function addNote(req: express.Request, res: express.Response) {
    console.log(req.body.id, req.body.notes, 'add note')

    db.addNotes(req.body.id, req.body.notes[0], function (result) {
        console.log(result, 'note added')
        //res.redirect('/home')
        res.send({ success: result })
    })

}