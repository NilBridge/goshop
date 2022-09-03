const db = new DBSession("sqlite", { path: "./plugins/goshop/data.sqlite" });

db.exec(`create table if not exists SHOPS(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT,
    OWNER TEXT,
    DESC TEXT,
    TABLEID TEXT,
    CREATED INTEGER,
    STARS INTEGER
);`);

db.exec(`create table if not exists USERS(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    XUID TEXT,
    NAME TEXT,
    SHOP TEXT,
    MONEY INTEGER
);`);
/*
db.exec(`create table if not exists ORDERS(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    BUY TEXT,
    SELL TEXT,
    ITEM TEXT,
    SNBT TEXT,
    COUNT INTEGER,
    PRICE INTEGER,
    DATE INTEGER
);`);
*/

function checkInput(oField) {

    re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;

    if (re.test(oField)) {

        return true;

    }
    return false;
}
function UserHasShop(xuid) {
    let stmt = db.prepare("SELECT * FROM USERS WHERE XUID = $xuid;");
    stmt.bind({ xuid });
    let sult = stmt.fetch();
    //console.log(sult);
    if (sult.SHOP !== undefined) {
        return true;
    }
    return false;
}

function addUser(pl) {
    let stmt1 = db.prepare("SELECT * FROM USERS WHERE XUID = $xuid;");
    stmt1.bind([pl.xuid]);
    let sult1 = stmt1.fetch();
    if (sult1.XUID) return false;
    let stmt = db.prepare("INSERT INTO USERS VALUES(NULL,$xuid,$name,NULL,0);");
    stmt.bind([pl.xuid, pl.name]);
    stmt.fetch();
    return true;
}

function createShop(xuid, name, desc) {
    if (UserHasShop(xuid)) {
        return;
    }
    let id = 'SHOP' + new Date().getTime().toString();
    db.exec(`CREATE TABLE '${id}'(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME TEXT,
            MONEY INTERGE,
            NUMBER INTEGER,
            SNBT TEXT,
            TYPE TEXT,
            PIC TEXT
    );`);
    db.prepare(`UPDATE USERS SET SHOP = $name WHERE XUID = $xuid;`).bind([name, xuid]).fetch();
    db.prepare(`INSERT INTO SHOPS VALUES (NULL,$name,$xuid,$desc,$id,$date,0);`).bind({ name, xuid, desc, id, date: new Date().getTime() }).fetch();
    log(`用户【${xuid}】创建商店成功，数据表：${id}`)
}

function queryItems(tableid) {
    let arr = []
    try {
        let stmt = db.prepare(`SELECT * FROM ${tableid};`);
        do { // 准备并执行后，默认在第一行
            let row = stmt.fetch();
            if (row) {
                arr.push({
                    id: row.ID,
                    name: row.NAME,
                    price: row.MONEY,
                    snbt: row.SNBT,
                    count: row.NUMBER,
                    pic: row.PIC
                });
            }
        } while (stmt.step()); // 第一次执行时步进到第二行，并成功获取到结果，返回true；最后一行时再步进则返回false
    } catch { return arr; }
}

function getAllShop(xuid = '') {
    let arr = [];
    let stmt = db.prepare(`SELECT * FROM SHOPS WHERE OWNER != @xuid ORDER BY STARS DESC;`).bind(xuid);
    do { // 准备并执行后，默认在第一行
        let row = stmt.fetch();
        if (row) {
            if (row.NAME) {
                arr.push({
                    id: row.ID,
                    name: row.NAME,
                    owner: row.OWNER,
                    tableid: row.TABLEID,
                    stars: row.STARS,
                    desc: row.DESC,
                    items: queryItems(row.TABLEID)
                })
            }
        }
    } while (stmt.step()); // 第一次执行时步进到第二行，并成功获取到结果，返回true；最后一行时再步进则返回false
    return arr;
}

function queryShop(tableid,xuid=''){
    return db.prepare(`SELECT * FROM SHOPS WHERE TABLEID = @id OR OWNER = @xuid;`).bind([tableid,xuid]).fetch();
}

function addItem(shopid, item, name, price, count, pic = null) {
    let stmt = db.prepare(`INSERT INTO ${shopid} VALUES (NULL,$name,$price,$count,$snbt,$type,$pic)`).bind([
        name,
        price,
        count,
        item.getNbt.toSNBT(),
        pic,
        item.type
    ]);
    stmt.fetch();
}

function remItem(shopid,id,count){
    if(count==0){
        db.prepare(`DELETE FROM ${shopid} WHERE ID = $id;`).bind(id).fetch();
    }else{
        db.prepare(`UPDATE ${shopid} SET NUMBER = NUMBER - ${count} WHERE ID = @id`).bind(id).fetch();
    }
}

function getUser(xuid){
    return db.prepare(`SELECT * FROM USERS WHERE XUID = $xuid`).bind(xuid).fetch();
}

function updateShopInfo(tableid,name,desc){
    db.prepare(`UPDATE SHOPS SET NAME = $name WHERE TABLEID = $id;`).bind([name,tableid]).fetch();
    db.prepare(`UPDATE SHOPS SET DESC = $desc WHERE TABLEID = $id;`).bind([desc,tableid]).fetch();
}

function addStar(shopid,num){
    db.prepare(`UPDATE SHOPS SET STARS = (STARS + @num)/2 WHERE TABLEID = @id`).bind([shopid,num]).fetch();
}

module.exports = {
    createShop,
    addUser,
    getAllShop,
    UserHasShop,
    addItem,
    checkInput,
    queryItems,
    queryShop,
    remItem,
    getUser,
    updateShopInfo
}