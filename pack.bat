chcp 65001

if exist tmp (
    rd tmp /s
)


md tmp
md "tmp/goshop"

xcopy src "tmp/goshop" /s /e /exclude:%cd%\pack.config
::xcopy package.json "tmp/goshop/" /F

cd 7z

7za.exe a ../tmp/goshop.zip ../tmp/goshop/*

cd ../tmp

REN goshop.zip goshop.llplugin