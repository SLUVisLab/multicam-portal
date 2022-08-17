const firebase = require('firebase-admin')
const db = firebase.firestore();
// const { body,validationResult } = require('express-validator');



// Search Firestore DB.
exports.get_sites = (req, res, next) => {
        
    console.log("Making request to firestore...")
    let data = []
    const configRef = db.collection('config').doc('config')
    configRef.collection("sites").get()
        .then(sites => {
            if(!sites.docs || sites.docs.length < 1) {
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

exports.get_sessions = (req, res, next) => {
        
    console.log("Making request to firestore...")
    let limit = 25
    let data = []
    const sessionsRef = db.collection('sessions')
    sessionsRef.orderBy('sessionStart', 'desc').limit(limit).get()
        .then(sessions => {
            if(!sessions.docs || sessions.docs.length < 1) {
                res.status(400)
                res.send("Error: No session documents found")
            } else {
                sessions.forEach((doc) => {
                    const d = doc.data()
                    data.push({
                        sessionId: d.sessionId,
                        sessionStart: d.sessionStart.toDate().toLocaleString(),
                        sessionStop: d.sessionStop.toDate().toLocaleString(),
                        imageCount: d.imageCount,
                        siteId: d.siteId,
                        blockId: d.blockId
                    });
                })
                res.send(data)
            }
        })
}