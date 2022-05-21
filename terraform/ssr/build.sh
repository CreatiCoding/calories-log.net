echo "[build] start"

cd $(git rev-parse --show-toplevel)

# CLEAN UP CACHE
rm -rf .next

yarn

NODE_ENV=production yarn build

base=$(basename $PWD)

tar -czf ../$base.tar.gz --exclude='.git' --exclude='terraform' --exclude=".envrc" .

mv ../$base.tar.gz .

echo "[build] done"
