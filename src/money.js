//LiteXLoader Dev Helper
/// <reference path="c:\Users\amsq\.vscode\extensions\moxicat.lxldevhelper-0.1.8/Library/JS/Api.js" /> 

const fs = require("./file");
const JSON5 = require("json5");
const config =JSON5.parse(fs.readFrom("./plugins/goshop/config.json"));

function rem(pl,score){
    switch(config.type){
        case 1:
            money.reduce(pl.xuid,score);
            break;
        case 2:
            pl.reduceScore(config.board,score);
            break;
    }
}
function add(pl,score){
    switch(config.type){
        case 1:
            money.add(pl.xuid,score);
            break;
        case 2:
            pl.addScore(config.board,score);
            break;
    }
}

function get(pl){
    switch(config.type){
        case 1:
            return money.get(pl.xuid);
            break;
        case 2:
            return pl.getScore(config.board);
            break;
    }
}

module.exports = {
    get,
    add,
    rem
}