import * as fb from "firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

let config = {};
if (process.env.REACT_APP_ENV === "development") {
  config = {
    apiKey: process.env.REACT_APP_DEV_API_KEY,
    authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
    projectId: process.env.REACT_APP_DEV_PROJECT_ID,
    storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_DEV_ID,
  };
}

if (process.env.REACT_APP_ENV === "production") {
  config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };
}

// if (!firebase.apps.length) {
export const app = firebase.initializeApp(config);
// }

// const admin = require('firebase-admin');
export const auth = firebase.auth();
export const storage = firebase.storage();
export const firestore = fb.firestore();
// export const messaging = firebase.messaging();

if (
  process.env.REACT_APP_ENV === "local" ||
  location.hostname === "localhost"
) {
  app.functions().useFunctionsEmulator("http://localhost:5001");
  app.auth().useEmulator("http://localhost:9099");
  app.firestore().settings({
    host: "localhost:8080",
    ssl: false,
  });
}

export const initFirebaseUser = () => {
  /*
  client.writeData({
    data: {
      isAuthInitialized: true
    }
  });
  */
  auth.onAuthStateChanged((user) => {
    const isAuthenticated = user != null;

    if (isAuthenticated) {
      user.getIdToken().then((accessToken) => {
        user = user.toJSON();
        // There are 2 ways to get accessToken (Step 1)
        // 1. Get the token from firebase
        //  let accessToken = user.stsTokenManager.accessToken;

        // 2. Set token to sessionStorage
        setToken(accessToken);
        // history.push('/home');
        // 3. Check for the user in local database
        // return getAuthenticatedUser(client, user);
      });
    } else {
      setToken("");
      // client.resetStore();
    }
  });
};

/*
export const googleSignin = () => {
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/plus.login");
  return auth.signInWithPopup(provider).then(() => {
    window.location.reload();
  });
};
*/

/* Send verification email */
export const verifyEmail = () => {
  return auth.onAuthStateChanged(async (user) => {
    if (!user.emailVerified) {
      await user.sendEmailVerification();
    }
  });
};

/* Change password */
export const changePassword = (newPassword) => {
  const user = firebase.auth().currentUser;
  return user
    .updatePassword(newPassword)
    .then((res) => formatResult(200, "Updated Successfully", res))
    .catch((e) => formatResult(422, e.message));
};

/* Signup Code */
export const signup = ({ email, password, data }) => {
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (res) => {
      if (res.user && res.user.emailVerified === false) {
        res.user.sendEmailVerification().then(() => {
          console.log("Successfully email sent");
        });
      }
      formatResult(200, "Successfully user created");
    })
    .catch((e) => formatResult(422, e.message));
};

export const googleSignup = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => formatResult(200, "Successfully created"))
        .catch((e) => formatResult(422, e.message));
    });
};

/* Signin Code */
export const signin = ({ email, password }) => {
  return auth
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      if (res.user) {
        return formatResult(200, "Successfully loggedIn", res.user);
      }
    })
    .catch((e) => formatResult(422, e.message));
};

export const googleSignin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => formatResult(200, "Successfully created"))
        .catch((e) => formatResult(422, e.message));
    });
};

/* Signout Code */
export const signout = () => {
  return auth.signOut().then(() => {
    window.sessionStorage.setItem("token", "");
  });
};

export const setToken = (accessToken) => {
  window.sessionStorage.setItem("token", accessToken);
};

export const getToken = (accessToken) => {
  return window.sessionStorage.getItem("token");
};

export const updateProfile = (data) => {
  const currentUser = firebase.auth().currentUser;
  return currentUser
    .updateProfile(data)
    .then((suc) => formatResult(200, "Successfully updated"))
    .catch((err) => formatResult(400, err.message));
};

export const removeProfile = () => {
  const currentUser = firebase.auth().currentUser;
  return currentUser
    .delete()
    .then((suc) => formatResult(200, "Deleted successfully"))
    .catch((err) => formatResult(500, err.message));
};

export const uploadFile = (file, type, callback) => {
  const storageRef = storage.ref();
  const fileName = file.name + "_" + Date.now();
  let imageRef = storageRef.child("avatars/" + fileName);
  if (type === "audio") {
    imageRef = storageRef.child("audios/" + fileName);
  }
  const metadata = {
    contentType: file.type,
    contentSize: file.size,
  };
  const uploadTask = imageRef.put(file, metadata);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      // setBtnUpload(progress + "%");
      console.log(progress + "%");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
        default:
          break;
      }
    },
    (err) => {
      switch (err.code) {
        case "storage/unauthorized":
          err.message = "Unauthorized user";
          break;
        case "storage/cancelled":
          err.message = "Upload cancelled";
          break;
        case "storage/unknown":
          err.message = "Unknown error occured";
          console.log("unknown error occured, inspect err.serverResponse");
          break;
        default:
          break;
      }
      // callback('', new Error(err))
    },
    (res) => {
      uploadTask.snapshot.ref
        .getDownloadURL()
        .then((fileUrl) => callback(fileUrl));
    }
  );
};

export const removeFile = (imageUrl) => {
  const imageRef = storage.refFromURL(imageUrl);
  return imageRef
    .delete()
    .then((suc) => formatResult(200, "Deleted successfully"))
    .catch((err) => err && formatResult(422, "Delete failed"));
};

export const addToFirestore = (collection, data) => {
  data.createdAt = new Date().getTime();
  data.updatedAt = new Date().getTime();
  return firestore.collection(collection).add(data);
};

export const add = (collection, data) => {
  data.createdAt = new Date().getTime();
  data.updatedAt = new Date().getTime();
  return firestore
    .collection(collection)
    .add(data)
    .then((res) => {
      return formatResult(200, "Successfully created", {
        id: res.id,
        path: res.path,
      });
    })
    .catch((e) => formatResult(500, "Something went wrong"));
};

export const update = (collection, id, data) => {
  data.updatedAt = new Date().getTime();
  return firestore
    .collection(collection)
    .doc(id)
    .update(data)
    .then((res) => formatResult(200, "Successfully updated", res))
    .catch((e) => formatResult(422, e.message));
};

export const get = (collection, id = "all") => {
  const snapshot = firestore.collection(collection).get();

  return snapshot
    .then((results) => {
      const object = [];
      results.forEach((doc) => {
        object.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return object.sort((a, b) => b.createdAt - a.createdAt);
    })
    .catch((err) => {
      console.error(err);
      return { error: err.code };
    });
};

export const getQuery = (customQuery = null) => {
  return customQuery
    .then((results) => {
      const object = [];
      results.forEach((doc) => {
        object.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return object.sort((a, b) => a.createdAt - b.createdAt);
    })
    .catch((err) => {
      console.error(err);
      return { error: err.code };
    });
};

export const getId = (collection, id) => {
  return firestore
    .collection(collection)
    .doc(id)
    .get()
    .then((doc) =>
      doc.exists ? doc.data() : formatResult(404, "No data found")
    )
    .catch((err) => formatResult(err.code, err.message));
};

export const remove = (collection, id) => {
  return firestore
    .collection(collection)
    .doc(id)
    .delete()
    .then((suc) => formatResult(200, "Deleted successfully"))
    .catch((er) => formatResult(500, er.message));
};

export const arrayAdd = firebase.firestore.FieldValue.arrayUnion;

export const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

export const timestamp = firebase.firestore.FieldValue.serverTimestamp();

// export const timestamp = firebase.firestore.Timestamp.fromDate(new Date());

export const getGeoLocation = () => {
  /*
  let stringFor = "";
  stringFor += position.coords.latitude.toString()
  stringFor += ","
  stringFor += position.coords.longitude.toString()
  $.ajax({
    url: "http://api.positionstack.com/v1/forward",
    data: {
      access_key: "931e043728e67eab25337ce8deea033d",
      query: '51.507822,-0.076702',
      output: "json",
      limit: 10
    }
  }).done((data) => {
    console.log("DDD", data)
  })
  */
  // Ref: https://positionstack.com/dashboard
};

export const sendForgotPassword = (email) => {
  return auth
    .sendPasswordResetEmail(email)
    .then((res) => formatResult(200, "Email sent"))
    .catch((e) => formatResult(404, e.message));
};

/* Batch writes */
// Use bulk writes to perform this operation
// Use bulk_writes API from lib folder
// Ref: https://firebase.google.com/docs/firestore/manage-data/transactions
export const batchWrite = async (collection, ids, data = {}) => {
  const batch = firestore.batch();
  if (!ids || !ids[0]) {
    return null;
  }
  // To generate automated Id: use .doc()
  // To generate custom Id: use .doc('<ID_NUMBER>')
  data.createdAt = new Date().getTime();
  data.updatedAt = new Date().getTime();
  ids.map(async (id) => {
    data.receiverId = id;
    const ref = firestore.collection(collection).doc();
    await batch.set(ref, data);
  });
  await batch.commit();
  return { status: 200 };
};

export const batchUpdate = async (collection, ids, data = {}) => {
  const batch = firestore.batch();
  data.updatedAt = new Date().getTime();
  ids.map(async (id) => {
    const ref = firestore.collection(collection).doc(id);
    await batch.update(ref, data);
  });
  await batch.commit();
  return { status: 200 };
};

/* Common code */
function formatResult(status, message, data = {}) {
  return { status, message, data };
}

export default firebase;
