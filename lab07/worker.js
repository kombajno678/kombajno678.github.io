
function swapCase(letters) {
    let newLetters = "";
    for (var i = 0; i < letters.length; i++) {
        if (letters[i] === letters[i].toLowerCase()) {
            newLetters += letters[i].toUpperCase();
        } else {
            newLetters += letters[i].toLowerCase();
        }
    }
    return newLetters;
}

onmessage = function (e) {
    console.log('Worker > Message received from main script', e);
    let parsedObject = JSON.parse(e.data);
    Object.keys(parsedObject).forEach(k => {
        parsedObject[k] = swapCase(parsedObject[k]);
    })
    let ret = JSON.stringify(parsedObject);
    console.log('Worker > Posting message back to main script', ret);
    postMessage(ret);
}


