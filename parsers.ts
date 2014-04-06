///<reference path=".\jsdom.d.ts"/>
///<reference path="c:\DefinitelyTyped\jquery\jquery.d.ts"/>
///<reference path=".\request.d.ts"/>
///<reference path="c:\DefinitelyTyped\mongodb\mongodb.d.ts"/>

import jsdom = require("jsdom")
import request = require("request")
import mongodb = require("mongodb")
import db = require('./db')

export function marthS(url: string, callback: (recipe: db.Recipe) => void) {

    request(url, function (err, res, body) {
        //console.log(body)
        jsdom.env(body, ['./public/javascripts/jquery.js'], function (err, window) {
            var $: JQueryStatic = window['jQuery']

            //console.log($('h1[itemprop="name"]').text())
            var ing: string[] = [];
            $('#ingredients ul li').each(function (i, e) {
                ing.push($(e).text())
            })
            var dirs: string[] = []
            $('#directions ol p').each(function (i, e) {
                dirs.push($(e).text())
            })
            var result:db.Recipe = {
                title: $('h1[itemprop="name"]').text(),
                desc: $('p[itemprop="description"]').text(),
                yield: $('li[itemprop="recipeYield"]').text(),
                ingredients: ing,
                directions: dirs,
            }
            callback(result)
        })
    })
}