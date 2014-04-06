///<reference path="c:\DefinitelyTyped\mongodb\mongodb.d.ts"/>

import mongodb = require("mongodb")

var server = new mongodb.Server('localhost',27017, { auto_reconnect: true})
//var db: mongodb.Db = new mongodb.Db('test', server, { w: 1 });
var CONSTRING = "mongodb://localhost:27017/recipes"

export interface Test {
    _id: mongodb.ObjectID;
    a: number;
}

export interface Recipe {
    _id?: mongodb.ObjectID;
    title: string;
    desc: string;
    yield: string;
    ingredients: string[];
    directions: string[];
    contrib?: {
        name: string; // a User's name for querying simplicity
        _id: mongodb.ObjectID
    }
    notes?: string;
}

export interface User {
    _id?: mongodb.ObjectID
    email: string
    name: string
    urlname?: string
}

function connect(cname:string, cb: ( res: mongodb.Collection) => void) {
    mongodb.MongoClient.connect(CONSTRING, function (err: Error, db: mongodb.Db) {
        db.collection(cname, function (err, collection: mongodb.Collection) {
            cb(collection)
        })
    })
}

//export function getTest(callback: (test: any[]) => void): void {
//    connect(function (res) {
//        res.find().toArray(function (err, docs) {
//            callback(docs)
//        })
//    })
//}

export function insertRecipe(rec: Recipe, callback: (msg: any) => void) {
    connect('recipes',function (col) {
        col.insert(rec, function (err, res) {
            callback(res)
        })
    })
}

export function allRecipes(cb: (recs: Recipe[]) => void) {
    connect('recipes', function (col) {
        col.find({}, { title: true, yield: true, desc: true, contrib: true }).toArray(function (err, docs) {
            cb(docs)
        })
    })
}

export function recipes(query: Object, cb: (recs: Recipe[]) => void) {
    connect('recipes', function (col) {
        col.find(query).toArray(function (err, docs) {
            cb(docs)
        })
    })
}

export function addNotes(recipe: string, notes: string, cb: (res: any) => void) {
    connect('recipes', function (col) {
        var id = new mongodb.ObjectID(recipe)
        console.log('notes to add: ', notes)
        col.update({ _id: id }, {
            $set: { notes: notes }
        }, { w: 1 },
            function (err, res) {
                cb(res)
            }
        )
    })
}

// a method to change all recipe docs to include a whole user doc
export function scratch() {
    connect('users', function (col) {
        col.find({ email: 'christopher.usick@gmail.com' }).toArray(function (err, chris) {
            connect('recipes', function (col) {
                console.log(chris)
                //col.findAndModify(
                //    {
                //        query: { 'contrib.email': { $ne: chris[0].email } },
                //        update: { $set: { contrib: chris } }
                //    }, {}, {}, { w: 1 }, function (err, res) {
                //        console.log(res, 'from scratch')
                //    }
                
                //    )
                col.update({
                    'contrib.email': { $exists:false }
                }, {
                        $set: { contrib: chris[0] }
                    }, function (err, res) {
                        console.log(res, 'scratch')
                        col.find({}, { title: true, contrib: true }).toArray(function (err, docs) {
                            console.log(docs)
                        })
                    })

            })
        })
    })

}

// Method to remove exrainious whitespaces in recipes.  Now this is done before a recipe
// is added to the database
export function scratch2() {
    connect('recipes', function (col) {
        col.find().toArray(function (err, oldRecs) {
            var newRecs: Recipe[] = normalize(oldRecs)
            newRecs.forEach(function (val, i) {
                col.update({ _id: val._id }, val, { w: 1 }, function (err, res) {
                    console.log(res, 'updating recipes')
                })
            })
        })
    })
}

function normalize(oldRecs: Recipe[]): Recipe[] {
    var recs: Recipe[] = oldRecs
    recs.forEach(function (val, i) {
        recs[i].title = removeChars(val.title)
        recs[i].desc = removeChars(val.desc)
        recs[i].yield = removeChars(val.yield)
        recs[i].ingredients.map(function (v, i) {
            return removeChars(v)
        })
        recs[i].directions.map(function (v, i) {
            return removeChars(v)
        })
    })
    return recs
}
function removeChars(str: string): string {
    return str.replace(/\s+/g, ' ')
}

export module User {
    export function findOrCreate(info: User, cb: (user: User) => void) {
        connect('users', function (col) {
            col.findOne({ email: info.email }, function (err, muser) {
                // if user exists, pass it to `cb`
                if (muser) {
                    cb(muser)
                }
                else {
                    // create the user and return it
                    info.urlname = encodeName(info.name)
                    col.insert(info, { w: 1 }, function (err, user) {
                        cb(user)
                    })
                }

            })
        })
    }
    function encodeName(name: string): string{
        return name.replace(' ', '')
    }
}