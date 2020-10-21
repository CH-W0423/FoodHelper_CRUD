const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override') 
// 引用路由器
const routes = require('./routes')
const app = express()
const port = 3000
//用 require 引用 mongoose 檔案
require('./config/mongoose')
// 設定引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
//使用靜態檔
app.use(express.static('public'))
//每筆請求都要透過body-parser前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 將 request 導入路由器
app.use (routes)
// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});