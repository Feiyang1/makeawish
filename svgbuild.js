var svgstore = require('svgstore');
var fs = require('fs');

var sprites = svgstore()
    .add('tree1', fs.readFileSync('./resources/noun_441084_cc.svg', 'utf8'))
    .add('tree3', fs.readFileSync('./resources/noun_441096_cc.svg', 'utf8'))
    .add('tree2', fs.readFileSync('./resources/noun_441093_cc.svg', 'utf8'));

fs.writeFileSync('./resources/sprites.svg', sprites);