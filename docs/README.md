# goshop

a perfect shop

# 数据库构建

## SHOPS

|键|值|类型|
|::|::|::|
|ID|序号|INTEGER PRIMARY KEY AUTOINCREMENT|
|NAME|商店名称|TEXT|
|TABLEID|商店对应表的ID|TEXT|
|OWNER|商店主人|TEXT|
|CREATE|创建时间|INTEGER|

## USERS

|键|值|类型|
|::|::|::|
|ID|序号|INTEGER PRIMARY KEY AUTOINCREMENT|
|NAME|玩家名称|TEXT|
|XUID|玩家XUID|TEXT|
|SHOP|玩家商店名称|TEXT|
|HISTORY|历史订单|TEXT|

## ITEMS

*此表名称不唯一，根据玩家商店ID创建*

|键|值|类型|
|::|::|::|
|ID|序号|INTEGER PRIMARY KEY AUTOINCREMENT|
|NAME|物品名称|TEXT|
|NUMBER|剩余数量|INTEGER|
|SNBT|物品SNBT|TEXT|
|PIC|物品图片|TEXT|

## ORDERS

|键|值|类型|
|::|::|::|
|ID|序号|INTEGER PRIMARY KEY AUTOINCREMENT|
|BUY|购买者|TEXT|
|SELL|出售者|TEXT|
|ITEM|出售商品|TEXT|
|SNBT|商品SNBT|TEXT|
|COUNT|出售数量|INTEGER|
|PRICE|价格|INTEGER|
|DATE|交易时间|INTEGER|