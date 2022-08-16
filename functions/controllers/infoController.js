const firebase = require('firebase-admin')
const db = firebase.firestore();
// const { body,validationResult } = require('express-validator');



// Search Firestore DB.
exports.get_info = (req, res, next) => {
        
    console.log("Making request to firestore...")
    let data = []
    const configRef = db.collection('config').doc('config')
    configRef.collection("sites").get()
        .then(sites => {
            if(!sites.docs.length || sites.docs.length < 1) {
                res.status(400)
                res.send("Error: No site documents found")
            } else {
                sites.forEach((doc) => {
                    data.push({name: doc.id, blocks: doc.data().blocks})
                    });
                res.send(data)
            }
        })


}