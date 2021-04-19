window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange


if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

function getClientHash(client) {
    return SHA1(client.name + client.email + '.' + client.tel + client.address + client.idnr)
}

const formIds = {
    name: 'client-name',
    email: 'client-email',
    tel: 'client-tel',
    address: 'client-address',
    idnr: 'client-idnr'
}

const filterIds = {
    name: 'filter-name',
    email: 'filter-email',
    tel: 'filter-tel',
    address: 'filter-address',
    idnr: 'filter-idnr'
}


var db;
var request = window.indexedDB.open("clientDb", 1);

request.onerror = (event) => {
    console.error('db error: ', event);
};

request.onsuccess = (event) => {
    db = request.result;
    console.log("request success: ", event);
    readAll(null, null);

};
clientData = [{
        id: 'a',
        name: 'client-name',
        email: 'client-email',
        tel: 'client-tel',
        address: 'client-address',
        idnr: 'client-idnr'
    },
    {
        id: 'b',
        name: 'client-name',
        email: 'client-email',
        tel: 'client-tel',
        address: 'client-address',
        idnr: 'client-idnr'
    }
]
request.onupgradeneeded = (event) => {
    var db = event.target.result;
    var objectStore = db.createObjectStore("client", {
        keyPath: "id"
    });
    objectStore.createIndex("name", "name", {
        unique: false
    });
    objectStore.createIndex("email", "email", {
        unique: true
    });

    objectStore.transaction.oncomplete = (event) => {
        var customerObjectStore = db.transaction("client", "readwrite").objectStore("client");
        clientData.forEach(customerObjectStore.add);
        console.log('added', clientData)
    };
}



function addClient() {

    if (!document.getElementById(formIds.name).checkValidity() ||
        !document.getElementById(formIds.email).checkValidity() ||
        !document.getElementById(formIds.tel).checkValidity() ||
        !document.getElementById(formIds.address).checkValidity() ||
        !document.getElementById(formIds.idnr).checkValidity()
    ) {
        alert("invalid form");
        return;
    }
    let client = {
        id: null,
        name: document.getElementById(formIds.name).value,
        email: document.getElementById(formIds.email).value,
        tel: document.getElementById(formIds.tel).value,
        address: document.getElementById(formIds.address).value,
        idnr: document.getElementById(formIds.idnr).value
    }
    client.id = getClientHash(client);

    let request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .add(client);

    request.onsuccess = (event) => {
        console.log('added new client', event);

        document.getElementById(formIds.name).value = '';
        document.getElementById(formIds.email).value = '';
        document.getElementById(formIds.tel).value = '';
        document.getElementById(formIds.address).value = '';
        document.getElementById(formIds.idnr).value = '';


        readAll(null, null);
    };

    request.onerror = (event) => {
        console.error('error while adding new client', event);
        alert("blad przy dodawaniu nowego klienta, adres email musi być unikalny");
    }
}


function readAll(filterfields, searchWords) {
    if (!db) {
        return;
    }
    console.log(filterfields);
    var objectStore = db.transaction("client").objectStore("client");

    let table = document.getElementById('table');
    table.innerHTML = '';

    objectStore.openCursor().onsuccess = (event) => {
        var cursor = event.target.result;

        if (cursor) {
            let row = document.createElement('div');
            row.setAttribute('class', 'row m-0 client-row');
            row.id = cursor.key;


            row.innerHTML = `
                <div class="col-2 overflow">${cursor.value.name}</div>
                <div class="col overflow">${  cursor.value.email}</div>
                <div class="col-2 overflow">${cursor.value.tel}</div>
                <div class="col-2 overflow">${cursor.value.idnr}</div>
                <div class="col-2 overflow">${cursor.value.address}</div>
                <div class="col del-col overflow"><button type="cutton" onclick="remove('${cursor.value.id}')">X</button></div>`;
            
            let addChild = false;
            if(filterfields){
                let filterCheck = true;
                let skipCheck = true;

                Object.keys(filterfields).forEach(k => {
                    if(filterfields[k] && filterfields[k].trim().length >= 1){
                        skipCheck = false;
                        
                        if(cursor.value[k].includes(filterfields[k].trim())){
                            filterCheck = filterCheck && true;
                        }else{
                            filterCheck = false;
                        }
                    }
                })

                if(filterCheck || skipCheck){
                    addChild = true;
                }

            }else{
                addChild = true;
            }


            if(searchWords){
                addChild = false;
                console.log(searchWords);


                if(searchWords.filter(w=> {
                    w = w.toLowerCase();
                    if(
                    cursor.value.name.toLowerCase().includes(w) || 
                    cursor.value.email.toLowerCase().includes(w) || 
                    cursor.value.tel.toLowerCase().includes(w) || 
                    cursor.value.idnr.toLowerCase().includes(w) || 
                    cursor.value.address.toLowerCase().includes(w)
                    ){
                        return true;
                    }
                    return false
                }).length == searchWords.length){
                    addChild = true;
                }


            }


            if(addChild){
                table.appendChild(row);
            }
           

            cursor.continue();
        } else {}
    };
}

function remove(id) {
    console.log("deletijng id ", id);

    if (confirm('are you sure?')) {
        let request = db.transaction(["client"], "readwrite")
            .objectStore("client")
            .delete(id);

        request.onsuccess = (event) => readAll(null, null);
    }

}

function applyFilter() {
    let filterfields = {};
    Object.keys(filterIds).forEach(k => {
        let field = document.getElementById(filterIds[k]);
        filterfields[k] = field.value
    });
    readAll(filterfields, null);
}


function Search(){
    let searchStr = document.getElementById('google-field').value.trim();
    if(searchStr && searchStr.length >= 1){
        let words = searchStr.split(' ');
        readAll(null, words);

    }
}



window.onload = () => {
    //readAll();
}



/**

*

*  Secure Hash Algorithm (SHA1)

*  http://www.webtoolkit.info/

*

**/


function SHA1(msg) {


    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };


    function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;


        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };


    function cvt_hex(val) {
        var str = "";
        var i;
        var v;


        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };


    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";


        for (var n = 0; n < string.length; n++) {


            var c = string.charCodeAt(n);


            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }


        }


        return utftext;
    };


    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;


    msg = Utf8Encode(msg);


    var msg_len = msg.length;


    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }


    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;


        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;


        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }


    word_array.push(i);


    while ((word_array.length % 16) != 14) word_array.push(0);


    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);


    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {


        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);


        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;


        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }


        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }


        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }


        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }


        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;


    }


    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);


    return temp.toLowerCase();

}