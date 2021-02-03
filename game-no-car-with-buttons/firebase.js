// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDPaQB-ZdFwKKff2bWksrxd2brB3YqOKY8",
    authDomain: "game-data-7f1a1.firebaseapp.com",
    projectId: "game-data-7f1a1",
    storageBucket: "game-data-7f1a1.appspot.com",
    messagingSenderId: "1086072480075",
    appId: "1:1086072480075:web:ba142d5b76663e3d1908ce",
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//---------------------------------

function readDB(db) {
    var leadsRef = database.ref(db);
    leadsRef.on("value", function (snapshot) {
        var childData = snapshot.val();
        console.log(childData);
    });
}

function writeUserData(db, data1, data2) {
    if (db == "with-car") {
        var v1 = "ip";
        var v2 = "delta";
    } else if (db == "no-car-no-buttons") {
        var v1 = "date-time";
        var v2 = "patterns";
    }
    firebase
        .database()
        .ref(db)
        .push({
            [v1]: data1,
            [v2]: data2,
        });
}

function writeUserData2(result) {
    // var temp = firebase.database().ref("no-car-with-buttons");
    // for (i = 0; i < timer.length; i++) {
    //     // console.log(i, timer[i]);
    //     var x = timer[i];
    //     temp.push({
    //         [x[0]]: x[1],
    //     });
    // }

    firebase.database().ref("no-car-with-buttons").push({
        result,
    });
}
