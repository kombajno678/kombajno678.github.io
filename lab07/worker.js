
function swapCase(letters) {
    let newLetters = "";
    for (var i = 0; i < letters.length; i++) {
        if (letters[i] === letters[i].toLowerCase()) {
            newLetters += letters[i].toUpperCase();
        } else {
            newLetters += letters[i].toLowerCase();
        }
    }
    console.log(newLetters);
    return newLetters;
}

onmessage = function (e) {
    console.log('Message received from main script', e);


    Object.keys(e.data).forEach(k => {
        e.data[k] = swapCase(e.data[k]);
    })
    console.log('Posting message back to main script', e.data);
    postMessage(e.data);
}


