const firebase = require('firebase-admin')
const db = firebase.firestore();
const { body,validationResult } = require('express-validator');
const fs = require('fs');
const { Parser } = require('json2csv');

function json_to_csv(data){
    try {
        const parser = new Parser();
        const csv = parser.parse(data)
        return csv
    } catch (err) {
        console.error(err)
    }

}

// Search Firestore DB.
// express-validator accepts an array of functions
// TODO: HANDLE EMPTY SEARCH RESULTS!!
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
        var blockQuery = req.body.block;
        var dateAfter = req.body.dateAfter;
        var dateBefore = req.body.dateBefore;
        
        if (!errors.isEmpty()) {
            //there are errors. Render the form afain with sanitized values/error messages
            res.render("search", {title: "Search",
        site: siteQuery, errors: errors.array()});
        return
        } else {
            //Data rom the form is valid
            //Pull data from firestore!
            console.log("Making request to firestore...")
            console.log(`site: ${req.body.site}`)
            var results = db.collection('images').where('siteId', '==', req.body.site).get()
                .then(items => {
                    let dataArr = []
                    let filename = "multi_cam_data"
                    items.forEach(documentSnapshot => {
                        let doc = documentSnapshot.data()
                        doc['creationDate'] = doc.creationDate.toDate()
                        doc['sessionStart'] = doc.sessionStart.toDate()
                        doc['sessionStop'] = doc.sessionStop.toDate()
                        dataArr.push(doc)
                    });
                    let csv = json_to_csv(dataArr)
                    res.attachment(filename + ".csv").send(csv)
                });
            // res.redirect("/search");
        }
    }
]