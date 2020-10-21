const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override') 
const Restaurant = require('./models/restaurant')
const app = express()
const port = 3000

// 連線資料庫(mongoDB)
mongoose.connect('mongodb://localhost/restaurant-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 設定引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
//使用靜態檔
app.use(express.static('public'))
//每筆請求都要透過body-parser前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});

// 設定首頁路由，查看全部資料
app.get("/", (req, res) => {
  Restaurant.find() 
    .lean() 
    .then((restaurants) => res.render('index', { restaurants })) 
    .catch((error) => console.log(error))
})

// add new routes setting
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//在資料庫新增資料的路由
app.post('/restaurants', (req, res) => {
  console.log(req.body)
  if(!req.body.image.length){
    req.body.image='https://static.vecteezy.com/system/resources/previews/000/091/119/large_2x/free-restaurant-logo-on-paper-plate-vector.jpg'
  }
    const restaurant = req.body
    return Restaurant.create(restaurant)
      .then(() => res.redirect('/'))
      .catch((error) => console.log(error))
})

//設定動態路由，查看特定餐廳詳情
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch((error) => console.log(error))
})

//前往編輯頁面路由
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.log(error))
})

//資料從表單回傳後，更新資料庫
app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const nameEn = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const googleMap = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.findById(id)
      //如果查詢成功，儲存資料
      .then((restaurant) => {
        restaurant.name = name
        restaurant.nameEn = nameEn
        restaurant.category = category
        restaurant.image = image
        restaurant.location = location
        restaurant.phone = phone
        restaurant.googleMap = googleMap
        restaurant.rating = rating
        restaurant.description = description
        return restaurant.save()
      })
      //如果儲存成功，重新導向該筆的詳細頁面
      .then(() => res.redirect(`/restaurants/${id}`))
      .catch((error) => console.log(error))
})


//去資料庫刪除資料
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

//搜尋功能
app.get('/search', (req, res) => {
  console.log(req.query)
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurants => {
      return restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keyword)
        || restaurant.name_en.toLowerCase().includes(keyword)
        || restaurant.category.toLowerCase().includes(keyword)
      )
    })
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})