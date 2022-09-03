//LiteXLoader Dev Helper
/// <reference path="c:\Users\amsq\.vscode\extensions\moxicat.lxldevhelper-0.1.8/Library/JS/Api.js" /> 
const _fs = require('fs');
const fs = require("./file");
const path = require('path');
const JSON5 = require("json5");
const config = JSON5.parse(fs.readFrom("./plugins/goshop/config.json"));
var ini = require('node-ini');
const { addUser, UserHasShop, createShop, getAllShop,checkInput, queryItems, queryShop, remCount } = require("./sql");
const lang = ini.parseSync('./plugins/goshop/lang.ini');

mc.listen('onJoin', (pl) => {
    addUser(pl);
});

mc.regPlayerCmd(config.cmd, '玩家商店', (pl) => {
    pl.sendForm(user.mainForm(pl), user.mainFunc);
});



function format(text, obj) {
    if(obj){
        for (let i in obj) {
            text = text.replace(`{${i}}`, obj[i].toString());
        }
    }
    return text.replace('\\n','\n');
}

/**
 * 
 * @param {*} msg 
 * @param {Player} pl 
 * @param {*} cb 
 */
function warn(msg, pl, cb) {
    pl.sendModalForm(lang.warn.title, msg, lang.warn.bt1, lang.warn.bt2, (pl,id) => {
        console.log(id);
        if (id) {
            cb(pl);
        }
    })
}

class user {
    static mainForm(pl) {
        let fm = mc.newSimpleForm();
        fm.setTitle(lang.main.title);
        fm.setContent(lang.main.content);
        if (UserHasShop(pl.xuid)) {
            fm.addButton(lang.main.my);
        } else {
            fm.addButton(format(lang.main.build,{score:config.build,score_name:config.name}));
        }
        getAllShop(pl.xuid).forEach(it => {
            if(it.owner != pl.xuid);
            console.log(it);
            fm.addButton(format(lang.main.shop, { owner: data.xuid2name(it.owner), name: it.name }));
        });
        return fm;
    }
    static mainFunc = (pl, dt)=> {
        if (dt == null) return;
        if (dt == 0) {
            if (UserHasShop(pl.xuid)) {

            } else {
                pl.sendForm(this.buildForm(),this.buildFunc);
            }
        } else {
            let id = getAllShop()[dt].tableid;
            pl.sendForm(this.viewForm(id),null); 
        }
    }
    static buildForm(dt = []) {
        let fm = mc.newCustomForm();
        fm.setTitle(lang.build.title);
        fm.addInput(lang.build.name,'',dt[0] ?? '');
        fm.addInput(lang.build.desc,'',dt[1] ?? '');
        return fm;
    }
    static buildFunc = (pl, dt)=> {
        if (dt == null) return;
        if (checkInput(dt[0]) || checkInput(dt[1])) {
            warn(lang.warn.error_input, pl, (pl) => {
                pl.sendForm(this.buildForm(dt), this.buildFunc);
            });
        } else {
            createShop(pl.xuid, dt[0], dt[1]);
        }
    }
    static viewForm(tableid){
        let fm = mc.newSimpleForm();
        let shop = queryShop(tableid);
        fm.setTitle(shop.NAME);
        fm.setContent(shop.DESC);
        queryItems(tableid).forEach(it=>{
            fm.addButton(format(lang.shop.item,{name:it.name,type:it.type,score:it.price,less:it.count}))
        });
        return fm;
    }
    static viewFunc(tbid){
        return (pl,dt)=>{
            if(dt==null)return;
            let shop = queryItems(tbid);
            let select = shop[dt];
            pl.sendForm(this.buyForm(select),this.buyFunc(tbid,select));
        }
    }
    static buyForm(select){
        let fm = mc.newCustomForm();
        fm.setTitle(lang.buy.title);
        fm.addLabel(format(lang.buy.price,{score:select.price}));
        fm.addSlider(lang.buy.number,1,select.count);
        return fm;
    }
    static buyFunc(tableid,select){
        return (pl,dt) =>{
            if(dt==null)return;
            let num = dt[1];
            do{
                pl.giveItem(mc.newItem(NBT.parseSNBT(select.snbt)));
                num--;
            }while(num != 0)
            if(dt[1] == select.count){
                remCount(tableid,select.id,0);
            }else{
                remCount(tableid,select.id,dt[1]);
            }
        }
    }
    static myshopForm(){
        
    }
}

class admin {

}