const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

db.once('open', () => {
  //新增json檔內的資料
  const restaurantList = require('../../restaurant.json')
  restaurantList.results.forEach((restaurant) => {
    Restaurant.create({
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })
  console.log('done!')
})