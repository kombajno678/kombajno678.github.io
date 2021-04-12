window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}



const employeeData = [{
        id: "01",
        name: "Gopal K Varma",
        age: 35,
        email: "contact@tutorialspoint.com"
    },
    {
        id: "02",
        name: "Prasad",
        age: 24,
        email: "prasad@tutorialspoint.com"
    }
];


request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {
        keyPath: "id"
    });

    for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }
}




function add() {
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: "01",
            name: "prasad",
            age: 24,
            email: "prasad@tutorialspoint.com"
        });

    request.onsuccess = function (event) {
        alert("Prasad has been added to your database.");
    };

    request.onerror = function (event) {
        alert("Unable to add data\r\nPrasad is already exist in your database! ");
    }
}





function read() {
    var transaction = db.transaction(["employee"]);
    var objectStore = transaction.objectStore("employee");
    var request = objectStore.get("00-03");

    request.onerror = function (event) {
        alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function (event) {

        if (request.result) {
            alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
        } else {
            alert("Kenny couldn't be found in your database!");
        }
    };
}



function readAll() {
    var objectStore = db.transaction("employee").objectStore("employee");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };
}



function remove() {
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete("02");

    request.onsuccess = function (event) {
        alert("prasad entry has been removed from your database.");
    };
}



window.onload = () => {
    console.log('xddd');
}