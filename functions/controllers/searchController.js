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
exports.image_search = [

    //validate and sanitize user inputs
    body('site', 'Site name required').trim().isLength({min:1}).escape(),

    body('block', 'Block must be a number').trim().isInt().escape().optional({checkFalsy: true}),

    body('beforeDate', 'Before date must be a valid date').trim().isDate().optional({checkFalsy: true}),

    body('afterDate', 'After date must be a valid date').trim().isDate().optional({checkFalsy: true}),

    //process the request after validation and sanitation
    (req, res, next) => {
        //extract validation errors from a request
        const errors = validationResult(req);

        //extract data from the request
        var siteQuery = req.body.site;
        var blockQuery = req.body.block;
        var afterDate = req.body.afterDate;
        var beforeDate = req.body.beforeDate;

        //use query to construct csv filename
        let filename = `data_${siteQuery}_${blockQuery ? blockQuery : "xblock"}_${afterDate ? afterDate : "xafter"}_${beforeDate ? beforeDate : "xbefore"}`
        
        if (!errors.isEmpty()) {
            //there are errors. Render the form again with sanitized values/error messages
            res.render("search", {title: "Search",
        site: siteQuery, errors: errors.array()});
        return
        } else {
            //Data rom the form is valid
            //Pull data from firestore!
            console.log("Making request to firestore...")
            console.log(`site: ${req.body.site}`)
            var query = db.collection('images').where('siteId', '==', siteQuery)
            if(blockQuery) {
                query = query.where('blockId', '==', blockQuery)
            }

            if(afterDate) {
                let start = new Date(afterDate)
                query = query.where('sessionStart', '>', start)
            }

            if(beforeDate) {
                let end = new Date(beforeDate)
                query = query.where('sessionStart', '<', end)
            }

            query.get()
                .then(items => {
                    //no results.
                    if (!items.size || items.size < 1) {
                        res.render("search", {title: "Search",
                            site: siteQuery, errors: [{msg: "No Results Found"}]});
                            return
                    }
                    
                    
                    let dataArr = []
                    // convert dates to standard format and then convert to csv
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