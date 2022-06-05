set -x
npx ejs templates/index.ejs -o index.html
npx ejs templates/list.ejs -o list.html
npx ejs templates/article.ejs -o article.html