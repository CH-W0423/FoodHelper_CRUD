// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Restaurant model
const Restaurant = require('../../models/restaurant')

// add new routes setting
router.get('/new', (req, res) => {
  return res.render('new')
})

//在資料庫新增資料的路由
router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch((error) => console.log(error))
})

//前往編輯頁面路由
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.log(error))
})

//資料從表單回傳後，更新資料庫
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

//搜尋功能
router.get('/search', (req, res) => {
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
module.exports = router