1.OrderNet_SRC

1) package.json
Replace "ordernet" in "homepage" with company name
2) .htaccess
Replace "ordernet" with company name
3) src/Constants/API.js
- Replace base url with company name
- Replace "ordernet" in serverUrl with company name

4) npm start in root entry of ordernet_src
5) clear all data in /xampp/htdocs/ordernet except backend
copy all files and subfolders in build to /xampp/htdocs/ordernet

Attention: keep all "/" around "ordernet"

2.Ordernet in /xampp/htdocs

1) /back/.env
2) /back/app/http/controlleres/ordercontroller.php
Line 141 you can see bcc