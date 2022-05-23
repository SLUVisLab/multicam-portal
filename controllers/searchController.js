const fs = require('firebase-admin')
const db = fs.firestore();
const { body,validationResult } = require('express-validator');


// Search Firestore DB.
// express-validator accepts an array of functions
exports.image_search = [
    //function1: 
    //validate and sanitize user inputs
    body('site', 'Site name required').trim().isLength({
        min:1
    }).escape(),

    //function2:
    //process the request after validation and sanitation
    (req, res, next) => {
        //extract validation errors from a request
        const errors = validationResult(req);

        //extract data from the request
        var siteQuery = req.body.site;

        
        if (!errors.isEmpty()) {
            //there are errors. Render the form afain with sanitized values/error messages
            res.render("search", {title: "Search",
        site: siteQuery, errors: errors.array()});
        return
        } else {
            //Data rom teh form is valid
            //Pull data from firestore!
            console.log("Making request to firestore...")
            console.log(`site: ${req.body.site}`)
            var results = db.collection('images').where('siteId', '==', req.body.site).get()
                .then(items => {
                    items.forEach(item => {
                    console.log(item);
                    });
                });
            res.redirect("/search");
        }
    }
]