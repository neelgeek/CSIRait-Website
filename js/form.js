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

document.getElementById('memform').addEventListener('submit', submitForm);

database.on('value', gotData, err);

function gotData(data){
    var full = data.val();
    var keys = Object.keys(full);
    console.log(keys);
    keys.forEach(function(value, index){
        var j = keys[index];
        var retrieveName = full[j].name;
        var retrieveMail = full[j].email;
        var retrieveAdd = full[j].address;
        var retrieveContact = full[j].contact;
        var retrieveDiv = full[j].div;
        var retrieveBranch = full[j].branch;
        var retrieveDob = full[j].dob;
        var retrieveGender = full[j].gender;
        var retrieveMemstat = full[j].memstat;
        var retrieveTeams = full[j].teams;
        var retrieveYear = full[j].years;
        var userData = [retrieveName, retrieveMail, retrieveAdd, retrieveContact,
                        retrieveDiv, retrieveBranch, retrieveDob, retrieveGender,
                        retrieveMemstat, retrieveTeams, retrieveYear]
        console.log(userData);
    });

    
};

function err(err){
    console.log("Error: ");
    console.log(err);
};



//submit the form
function submitForm(e) {
    e.preventDefault();
    console.log("Submitted");

    var name = getData('name');
    var email = getData('email');
    var address = getData('station');
    var div = getData('class');
    var branch = getData('branch');
    var dob = getData('dob');
    var contact = getData('contact');
    var y = document.getElementById("yom");
    var yom = y.options[y.selectedIndex].text;
    var ph = document.getElementById("gender");
    var gender = ph.options[ph.selectedIndex].text;
    var sem = document.querySelector('input[name = "sem"]:checked').value;
    var memstat = document.querySelector('input[name = "status"]:checked').value;
    var teamChoices = document.querySelectorAll('input[name = "teams"]:checked');
    var teams = [];
    for (var i = 0; i < teamChoices.length; i++) {
        teams.push(teamChoices[i].value);
    }

    //send the data
    saveData(name, email, address, div, branch, dob, contact, yom, gender, memstat, teams);

    document.querySelector('.success').style.display = "block";

    setTimeout(function() {
        document.querySelector('.success').style.display = "none";
    }, 3000);
}

//gets form values
function getData(id) {
    return document.getElementById(id).value;
}

//push to firebase
function saveData(name, email, address, div, branch, dob, contact, yom, gender, memstat, teams) {
    var newMember = database.push();
    newMember.set({
        name: name,
        email: email,
        address: address,
        div: div,
        branch: branch,
        dob: dob,
        contact: contact,
        years: yom,
        gender: gender,
        memstat: memstat,
        teams: teams
    });
}