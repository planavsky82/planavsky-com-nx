/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import { User } from './app/user';
import * as cors from 'cors';

const app: express.Application = express();
const port = 3000;
const user = new User();

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://planavsky-com.firebaseio.com/'
});  //by adding your credentials, you get authorized to read and write from the database
// https://cloud.google.com/docs/authentication/production
// applicationDefault() will use the credentials on the firebase server,
// so with this setup, you need to deploy to firebase functions to test code
// there is a way to define credentials locally in this link as well. not sure
// yet if that makes things easier or not, consider the realtime database is still remote.
// Also look into this link for testing locally: https://firebase.google.com/docs/hosting/deploying

app.listen(port, () => {
  console.log('Listening to port: ' + port);
  user.connect(admin.database());
});

// authenticate
app.post('/authenticate', (req, res) => {
  user.authenticate(req, res);
});

// register user
app.post('/user', (req, res) => {
  user.postUser(req, res);
});

// run middleware
app.use((req, res, next) => {
  user.isLoggedIn(req, res, next)
});

// get user rankings
app.get('/rankings', (req, res) => {
  user.getRankings(req, res);
});

// post user rankings
app.post('/rankings', (req, res) => {
  console.log('process');
});

// edit user rankings
app.put('/rankings', (req, res) => {
  console.log('process');
});

exports.app = functions.https.onRequest(app);

// https://stackoverflow.com/questions/42755131/enabling-cors-in-cloud-functions-for-firebase

// https://medium.com/@sandun.isuru/how-to-deploy-nodejs-express-app-to-firebase-as-function-31515c304e70

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// turn on linting in firebase.json predeploy: "npm --prefix \"$RESOURCE_DIR\" run lint",
