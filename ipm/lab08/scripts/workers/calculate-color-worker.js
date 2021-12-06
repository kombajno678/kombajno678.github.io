function getLetterValue(letter) {
    if (letter >= 'a' && letter <= 'z') {
        return letter.charCodeAt(0) - 96;
    }

    if (letter >= 'A' && letter <= 'Z') {
        return (letter.charCodeAt(0) - 64) + 30;
    }

    return 0;
}

function getStringValue(string) {
    let sum = 0;
    for (let i = 0; i < string.length; i++) {
        sum += getLetterValue(string.charAt(i));
    }
    return sum;
}


function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


onmessage = function (e) {
    let client = e.data;
    console.log('calculate-color-worker > Message received from main script ', JSON.stringify(e.data));

    let suma_wszystkich_liter = 0;
    Object.keys(client).forEach(k => {
        suma_wszystkich_liter += getStringValue(client[k]);
    });

    let color = {
        r: suma_wszystkich_liter % 255,
        g: 255 - (suma_wszystkich_liter % 255),
        b: (0.5 * (suma_wszystkich_liter % 255) > 125) ? 99 : 199
    }

    color.hex = rgbToHex(color.r, color.g, color.b);

    let ret = color;
    console.log('calculate-color-worker > Posting message back to main script', JSON.stringify(ret));
    postMessage(ret);
}
