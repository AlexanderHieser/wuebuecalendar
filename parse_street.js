var parser = require('node-html-parser');
var fs = require('fs');
console.log("Test")

let streets = new Array();
fs.readFile('streets.html', (done,data) => {
let parsedData = parser.parse(data);
    let options =parsedData.querySelectorAll('option');
    options.forEach((dataset) => {
        streets.push({
            name: dataset.rawText,
            id: dataset.getAttribute('id'),
            value: dataset.getAttribute('value')
        })
        console.log(dataset.rawText);
        console.log(dataset.getAttribute('id'));
        console.log(dataset.getAttribute('value'));
    });
    console.log(streets);
    fs.writeFile('streets.json',JSON.stringify(streets), (data) => {
        console.log(data);
    });
});
