var svgstore = require('svgstore');
var fs = require('fs');

var sprites = svgstore()
    .add('truck', fs.readFileSync('./resources/noun_441084_cc.svg', 'utf8'))
    .add('leaf', fs.readFileSync('./resources/bitcoin-coin.svg', 'utf8'))

fs.writeFileSync('./resources/sprites.svg', sprites);