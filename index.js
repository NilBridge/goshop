const fs = require('./src/file');
const _fs = require("fs");
log("正在加载数据库...");


if(fs.exists('./plugins/goshop') == false){
    fs.mkdir("./plugins/goshop/");
    _fs.copyFileSync("./plugins/nodejs/goshop/src/example.json",'./plugins/goshop/config.json');
    _fs.copyFileSync("./plugins/nodejs/goshop/src/lang.ini",'./plugins/goshop/lang.ini');
}

require('./src/mc');
