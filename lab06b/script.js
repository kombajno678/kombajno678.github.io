window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange


if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}


var editing = false;
var editingId = null;
var feashlyAddedClientId = null;

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
var request = window.indexedDB.open("clientDb");

request.onerror = (event) => {
    console.error('db error: ', event);
};

request.onsuccess = (event) => {
    db = request.result;
    console.log("request success: ", event);
    readAll(null, null);

};
// clientData = [{
//         id: 'a',
//         name: 'client-name',
//         email: 'client-email',
//         tel: 'client-tel',
//         address: 'client-address',
//         idnr: 'client-idnr'
//     },
//     {
//         id: 'b',
//         name: 'client-name',
//         email: 'client-email',
//         tel: 'client-tel',
//         address: 'client-address',
//         idnr: 'client-idnr'
//     }
// ]
request.onupgradeneeded = (event) => {
    db = event.target.result;
    var objectStore = db.createObjectStore("client", {
        keyPath: "id"
    });
    objectStore.createIndex("name", "name", {
        unique: false
    });
    objectStore.createIndex("email", "email", {
        unique: true
    });

    // objectStore.transaction.oncomplete = (event) => {
    //     var customerObjectStore = db.transaction("client", "readwrite").objectStore("client");
    //     clientData.forEach(customerObjectStore.add);
    //     console.log('added', clientData)
    // };
}



function addClient() {
    if (editing) return;
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
    feashlyAddedClientId = client.id;

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


function saveClient() {
    if (!editing) return;



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
    client.id = editingId;

    console.log(client);

    let request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .put(client);
    request.onsuccess = (event) => {
        console.log('edited client', event);
        clearForm();
        readAll(null, null);
        switchToAddMode();
    };




}


function readAll(filterfields, searchWords) {
    if (!db) {
        return;
    }
    if (!filterfields) {
        filterfields = {};
        Object.keys(filterIds).forEach(k => {
            let field = document.getElementById(filterIds[k]);
            filterfields[k] = field.value
        });
    }
    if(!searchWords){
        let searchStr = document.getElementById('google-field').value.trim();
        if (searchStr && searchStr.length >= 1) {
            searchWords = searchStr.split(' ');
        }
    }
    //console.log(filterfields);
    let objectStore = db.transaction("client").objectStore("client");

    let table = document.getElementById('table');
    table.innerHTML = '';

    objectStore.openCursor().onsuccess = (event) => {
        var cursor = event.target.result;

        if (cursor) {

            let addChild = false;

            if (filterfields) {
                let filterCheck = true;
                let skipCheck = true;

                Object.keys(filterfields).forEach(k => {
                    if (filterfields[k] && filterfields[k].trim().length >= 1) {
                        skipCheck = false;

                        if (cursor.value[k].toLowerCase().includes(filterfields[k].trim().toLowerCase())) {
                            filterCheck = filterCheck && true;

                        } else {
                            filterCheck = false;
                        }
                    }
                })

                if (filterCheck || skipCheck) {
                    addChild = true;
                }

            } else {
                addChild = true;
            }


            if (searchWords) {
                addChild = false;
                if (searchWords.filter(w => {
                        w = w.toLowerCase();
                        if (
                            cursor.value.name.toLowerCase().includes(w) ||
                            cursor.value.email.toLowerCase().includes(w) ||
                            cursor.value.tel.toLowerCase().includes(w) ||
                            cursor.value.idnr.toLowerCase().includes(w) ||
                            cursor.value.address.toLowerCase().includes(w)
                        ) {
                            return true;
                        }
                        return false
                    }).length == searchWords.length) {
                    addChild = true;
                }
            }


            if (addChild) {
                let row = document.createElement('div');
                row.id = cursor.key;
                console.log(`${editingId} == ${row.id}`);
                if(feashlyAddedClientId == row.id){
                    row.setAttribute('class', 'row m-0 client-row freshly-added');
                    feashlyAddedClientId = null;
                }else if(editingId == row.id){
                    row.setAttribute('class', 'row m-0 client-row freshly-edited');
                    editingId = null;
                }else{
                    row.setAttribute('class', 'row m-0 client-row');
                }
                row.innerHTML = `
                <div class="col overflow">${cursor.value.name || ''}</div>
                <div class="col overflow">${cursor.value.email || ''}</div>
                <div class="col overflow">${cursor.value.tel || ''}</div>
                <div class="col overflow">${cursor.value.idnr || ''}</div>
                <div class="col overflow">${cursor.value.address || ''}</div>
                <div class="col action-col del-col overflow">
                    <button type="cutton" onclick="remove('${cursor.value.id}')">
                        ❌
                    </button>
                </div>
                <div class="col action-col edit-col overflow">
                    <button type="cutton" onclick="edit('${cursor.value.id}')">
                        ✏
                    </button>
                </div>`;
                table.appendChild(row);
            }

            cursor.continue();
        } else {}
    };
}

function remove(id) {
    if (editing) return;
    console.log("deletijng id ", id);

    if (confirm('are you sure?')) {
        let request = db.transaction(["client"], "readwrite")
            .objectStore("client")
            .delete(id);

        request.onsuccess = (event) => readAll(null, null);
    }

}

function edit(id) {
    if (editing) return;
    console.log("editing id ", id);
    let request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .get(id);
    request.onsuccess = (event) => {
        switchToEditMode(id)
        let client = JSON.parse(JSON.stringify(event.target.result));
        fillFormWithClientData(client);
    };
}

function applyFilter() {
    let filterfields = {};
    Object.keys(filterIds).forEach(k => {
        let field = document.getElementById(filterIds[k]);
        filterfields[k] = field.value
    });
    readAll(filterfields, null);
    client.id = getClientHash(client);
}


function Search() {


    let searchStr = document.getElementById('google-field').value.trim();
    if (searchStr && searchStr.length >= 1) {
        let words = searchStr.split(' ');
        readAll(null, words);

    }
}






function clearForm() {
    document.getElementById(formIds.name).value = '';
    document.getElementById(formIds.email).value = '';
    document.getElementById(formIds.tel).value = '';
    document.getElementById(formIds.address).value = '';
    document.getElementById(formIds.idnr).value = '';
}



function cancelEditing() {
    clearForm();
    switchToAddMode();
}

function switchToEditMode(id) {
    editing = true;
    editingId = id;
    console.log("switchToEditMode editingId = ", editingId);

    document.getElementById(id).setAttribute('class', 'row m-0 client-row highlighted')

    document.getElementById('button-add').setAttribute('class', 'btn btn-info hidden');
    document.getElementById('button-save').setAttribute('class', 'btn btn-success ');
    document.getElementById('button-cancel').setAttribute('class', 'btn btn-danger ');
}

function switchToAddMode() {
    editing = false;
    if (document.getElementById(editingId)) {
        document.getElementById(editingId).setAttribute('class', 'row m-0 client-row')
    }
    //editingId = null;
    document.getElementById('button-add').setAttribute('class', 'btn btn-info ');
    document.getElementById('button-save').setAttribute('class', 'btn btn-success hidden');
    document.getElementById('button-cancel').setAttribute('class', 'btn btn-danger hidden');

}

function fillFormWithClientData(client) {
    fields = ['name', 'email', 'tel', 'address', 'idnr'];
    fields.forEach(f => {
        if (f in client) document.getElementById(formIds[f]).value = client[f];
    })
}

function fillFormWithRandomData() {
    fillFormWithClientData(getRandomClient());
}

function getRandomClient() {
    let client = {
        id: null,
        name: names[Math.floor(Math.random() * names.length)],
        email: randomChar() + randomChar() + randomChar() + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + emails[Math.floor(Math.random() * emails.length)],
        tel: phones[Math.floor(Math.random() * phones.length)],
        address: addresses[Math.floor(Math.random() * addresses.length)],
        idnr: randomIdNumber()
    }

    client.id = getClientHash(client);
    return client;

}

function randomChar() {
    let characters = 'qwertyuiopasdfghjklzxcvbnm';
    return characters.charAt(Math.floor(Math.random() * characters.length));

}









const addresses = [
    `18105 Dark Star Way
Boyds, Maryland(MD)
`,
    `823 Madison
Huntsville, Arkansas(AR)
`,
    `217 E Crocker St
Bradner, Ohio(OH)
`,
    `267 Orchard Rd
Nashville, Arkansas(AR)
`,
    `440 Cherry Hill Rd
Nazareth, Pennsylvania(PA)
`
]

function randomIdNumber() {
    let result = [];
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let digits = '0123456789';
    for (let i = 0; i < 3; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }
    for (let i = 0; i < 6; i++) {
        result.push(digits.charAt(Math.floor(Math.random() * digits.length)));
    }
    return result.join('');

}
/*
130 Ludlam Pl
Greenport, New York(NY)

278 Beech St
Oxford, Wisconsin(WI)

505 Diggs Blvd
Warner Robins, Georgia(GA)

86 Tumbleweed Ct
San Ramon, California(CA)

2615 Lone Oak Way
Eugene, Oregon(OR)

452 Hereford Rd
Monroe, Louisiana(LA)

407 Us 59 Hwy S
Linden, Texas(TX)

802 E Mesa Dr
Rialto, California(CA)

56566 Nassau Oaks Dr
Callahan, Florida(FL)

1231 S Larriviere Rd
Youngsville, Louisiana(LA)

487 Whittemore Rd
Middlebury, Connecticut(CT)

1361 Thomasville Cir
Lakeland, Florida(FL)

435 Johnson St #407024
Shaw A F B, South Carolina(SC)

122 E Northampton St
Bath, Pennsylvania(PA)

7202 Still Haven Dr
Richmond, Texas(TX)

13 Woodstone Dr
Mandeville, Louisiana(LA)

5554 Castlebar Pl
Rancho Cucamonga, California(CA)

7025 Raymond Rd
Madison, Wisconsin(WI)

24853 SW 128th Ave
Homestead, Florida(FL)

24 Caldon Path
Newton Center, Massachusetts(MA)

111 Roy Clark Rd
Anacoco, Louisiana(LA)

666 Carterville Heights Rd
Wytheville, Virginia(VA)
*/
const phones = [
    '202-555-012',
    '202-555-017',
    '202-555-014',
    '202-555-019',
    '202-555-014',
    '202-555-016',
    '020916237',
    '020913199',
    '020913862',
    '020913046',
    '020910030',
    '020913296',
    '202-555-014',
    '202-555-016',
    '202-555-018',
    '202-555-017',
    '202-555-011',
    '202-555-010',
    '020973199',
    '020973862',
    '020973046',
    '020970030',
    '020973296',
    '272-555-014',
    '272-555-016',
    '272-555-018',
    '272-555-017',
    '272-555-011',
    '272-555-010'
]


const emails = [
    "goldberg@verizon.net",
    "wayward@yahoo.ca",
    "xtang@outlook.com",
    "richard@sbcglobal.net",
    "lahvak@me.com",
    "koudas@optonline.net",
    "pdbaby@yahoo.ca",
    "jorgb@att.net",
    "lbecchi@att.net",
    "sabren@icloud.com",
    "thaljef@live.com",
    "pierce@sbcglobal.net",
    "frode@icloud.com",
    "cgarcia@sbcglobal.net",
    "budinger@comcast.net",
    "pontipak@me.com",
    "howler@gmail.com",
    "valdez@live.com",
    "adillon@att.net",
    "delpino@icloud.com",
    "bruck@outlook.com",
    "imightb@optonline.net",
    "rddesign@icloud.com",
    "mddallara@mac.com",
    "warrior@icloud.com",
    "goldberg@optonline.net",
    "pierce@icloud.com",
    "symbolic@outlook.com",
    "formis@hotmail.com",
    "dburrows@optonline.net",
    "sacraver@outlook.com",
    "milton@gmail.com",
    "fraterk@mac.com",
    "citizenl@me.com",
    "amimojo@mac.com",
    "dartlife@optonline.net",
    "zyghom@optonline.net",
    "meinkej@mac.com",
    "gilmoure@yahoo.com",
    "marin@outlook.com",
    "rafasgj@verizon.net",
    "miyop@mac.com",
    "sopwith@yahoo.ca",
    "kempsonc@msn.com",
    "denism@verizon.net",
    "tfinniga@hotmail.com",
    "credmond@yahoo.ca",
    "jigsaw@hotmail.com",
    "druschel@msn.com",
    "cmdrgravy@att.net"
]

const names = [
    "Rosann Roose",
    "Donte Dyke",
    "Erma Everts",
    "Racheal Ricca",
    "Micaela Mulder",
    "Benedict Bolyard",
    "Tomika Tilghman",
    "Librada Leaks",
    "Jillian Jump",
    "Pete Pilson",
    "German Gravel",
    "Sherryl Soja",
    "Lashawna Leach",
    "Sandie Schwer",
    "Fay Feucht",
    "Diana Dery",
    "Sharron Smithey",
    "Carmel Creegan",
    "Marilou Mcnerney",
    "Maryalice Milera",
    "Mina Mccubbin",
    "Denny Dahle",
    "Claudette Caywood",
    "Marci Myers",
    "Rigoberto Rost",
    "Rosalind Rickenbacker",
    "Elizbeth Easler",
    "Harrison Harvin",
    "Regan Rimer",
    "Hanna Howell",
    "Shannon Styers",
    "Aubrey Abeita",
    "Carin Clogston",
    "Julie Jone",
    "Rubin Reay",
    "Catherin Cerniglia",
    "Sharika Shepherd",
    "Denisha Donoghue",
    "Jenine Johnston",
    "Keila Kimura",
    "Margy Macgregor",
    "Eugenia Eichhorn",
    "Kattie Kinsey",
    "Leonora Low",
    "Bobby Burkhardt",
    "Sharri Schott",
    "Jessika Jeon",
    "Bibi Brazzell",
    "Harvey Hecker",
    "Yuko Yingst"
]



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
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);


        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;


        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B);
            B = A;
            A = temp;
        }


        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B);
            B = A;
            A = temp;
        }


        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B);
            B = A;
            A = temp;
        }


        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B);
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