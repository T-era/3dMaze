set DEST_DIR=../dest
set LIB_DIR=lib

call tsc -d --out %LIB_DIR%/common.d.ts ts/common/main.ts
call tsc -d --out %LIB_DIR%/uiparts.d.ts ts/uiparts/main.ts
call tsc -d --out %LIB_DIR%/mz.d.ts ts/mz/main.ts
call tsc -d --out %LIB_DIR%/mzinit.d.ts ts/mzinit/main.ts
call tsc -d --out %LIB_DIR%/mzedit.d.ts ts/mzedit/main.ts

call tsc --out %DEST_DIR%\common.js ts/common/main.ts
call tsc --out %DEST_DIR%\uiparts.js ts/uiparts/main.ts
call tsc --out %DEST_DIR%\mz.js ts/mz/main.ts
call tsc --out %DEST_DIR%\mzinit.js ts/mzinit/main.ts
call tsc --out %DEST_DIR%\mzedit.js ts/mzedit/main.ts
call tsc --out %DEST_DIR%\mz_main.js ts/main.ts

C:\Ruby22-x64\bin\slimrb slim/Main.slim %DEST_DIR%\Main.html
