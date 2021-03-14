var parser = require('node-html-parser');
var fs = require('fs');
const jsdom = require('jsdom');
const JSDOM = jsdom;
console.log("Test")

let streets = new Array();
fs.readFile('streets.html', (done,data) => {
let parsedData = parser.parse(data);
    let options =parsedData.querySelectorAll('option');
    options.forEach((dataset) => {
        streets.push({
            name: fixUmlauts(dataset.rawText),
            id: dataset.getAttribute('id'),
            value: dataset.getAttribute('value')
        })
        console.log(fixUmlauts(dataset.rawText));
        console.log(dataset.getAttribute('id'));
        console.log(dataset.getAttribute('value'));
    });
    console.log(streets);
    fs.writeFile('streets.json',JSON.stringify(streets), (data) => {
        console.log(data);
    });
});

function fixUmlauts(value) {
    var rsp = "";
    value.split(' ').forEach(element => {
        debugger;
        element = element.replace('&auml;','ä' );
        element = element.replace( '&ouml;','ö');
        element = element.replace('&uuml;', 'ü' );
        element = element.replace('&szlig;', 'ß' );
        element = element.replace('&Auml;', 'Ä' );
        element = element.replace( '&Ouml;','Ö');
        element = element.replace('&Uuml;','Ü' );
        element = element.replace('\n','' );
        rsp = rsp + ' ' + element;
    });
    return rsp;
}

