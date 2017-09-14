//Initialize Firebase
var config = {
    apiKey: "AIzaSyBmv6ZYbDR7CH_6UeKrb_gJwJ4DTOPW6PA",
    authDomain: "csi-membership.firebaseapp.com",
    databaseURL: "https://csi-membership.firebaseio.com",
    projectId: "csi-membership",
    storageBucket: "csi-membership.appspot.com",
    messagingSenderId: "540203855141"
};
firebase.initializeApp(config);

var database = firebase.database().ref('memberData');

database.on('value', gotData, err);

function gotData(data){
    console.log(data.val());
};

function err(err){
    console.log("Error: ");
    console.log(err);
};

