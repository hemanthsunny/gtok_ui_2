# Lets Gtok
V2.0

For hosting, database, authentication, and other resources, this application makes use of the Firebase cloud tool. To run the application, you need to install Firebase Emulator Suite (FES). Follow this reference - https://firebase.google.com/docs/emulator-suite

You must also install `node` and `npm` on your device.

### Configuration of the Lets Gtok app on local device
You could install npm dependencies for the first time by running `npm install`

After successful installation of npm dependencies, do the following:
1. Start the application - `npm run start`
2. Start the emulator - `npm run api`

Note: Make sure the ports between `src/firebase config.js` and `firebase.json` are properly linked.


#### How does FES work?
Our application must communicate with a real-time firebase project environment (the project id in this case is 'lg-main'). However, the following services link to the emulator -
- Functions
- Database
- Authorization
- Firestore

#### Remove this styling from styles/common.css to see emulator warning
.firebase-emulator-warning {
    display: none;
}

Other useful references:
1. Page transition animations
Ref: https://www.youtube.com/watch?v=qJt-FtzJ5fo
2. Give permissions for a bash script file (-x/+x)
Ref: https://unix.stackexchange.com/questions/164501/echo-out-lines-of-script-before-running-them
3. How to kill a port?
Ref: https://stackoverflow.com/questions/57537355/firebase-serve-error-port-5000-is-not-open-could-not-start-functions-emulator
