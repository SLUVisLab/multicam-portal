# multi_cam_portal
Data portal for multi-cam mobile application

## Usage
The data portal can be used to search for image recordings taken using the MultiCam App that are stored in a FireStore NoSQL database. Currently only the site name and block identifier are required as search parameters. Data is provided as a .csv file.

## Setup
MultiCam Portal is designed to be deployed using firebase functions, within the GCP workspace containing other related project elements (the firestore database, hosting, etc).

The repo can be deployed from the command line once it's set up by using the Firebase CLI. See the below documentation for instructions:

https://firebase.google.com/docs/functions/get-started

Once installed, you can run a local instance of the data portal by navigating to the root project folder and running:
`firebase emulators:start`

## Stack
Data portal is built using Express.js, Pug template engine, and the Firebase library for Node. The app uses the pug template engine to render the search form and also provides API endpoints for querying image data or getting recent recording session metadata. 


## Resources
The project structure is loosely based off of the MDN Local Library Express.js tutorial, here:

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website

Pug Documentation:

https://pugjs.org/api/getting-started.html




