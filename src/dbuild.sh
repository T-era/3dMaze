LIB_DIR=lib
TARGETS=("common" "uiparts" "mz" "mzinit" "mzedit")

# Compile TypeScript code.
for fld in ${TARGETS[@]}; do
  tsc -d --out $LIB_DIR/$fld.d.ts ts/$fld/main.ts
done
