var fs = require('fs');

var collated = [];

const collate = () => {
    let files = fs.readdirSync('./output/');
    files.forEach(file => {
        let data = fs.readFileSync('./output/' + file, 'utf-8');
        collated = collated.concat(JSON.parse(data));
    });
}

collate();
console.log(collated.length);
fs.writeFileSync('./apis_collated/apis.json', JSON.stringify(collated));

// collate().then(async () => {
//     await console.log('length', collated.length);
// });

// const start = async () => {
//     await collate();
//     console.log('length', collated.length);
//     fs.writeFileSync('./apis_collated/apis.json', JSON.stringify(collated));
// }

// start();