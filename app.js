const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const movies = require('./public/jsons/movies.json').results
const BASE_IMG_URL = 'https://movie-list.alphacamp.io/posters/'

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/movies')
})

app.get('/movies', (req, res) => {
  const keyword = req.query.search?.trim()
  const matchedMovies = keyword
    ? movies.filter((mv) => {
        //IDEA: 箭頭函式的用法：多於一行需有花括號`{}` ，且須加上 `return`，否則回傳值會是 undefined
        return Object.values(mv).some((properties) => {
          if (typeof properties === 'string') {
            return properties.toLowerCase().includes(keyword.toLowerCase())
          }
          return false
        })
      })
    : movies
  res.render('index', { movies: matchedMovies, BASE_IMG_URL }) //OPTIMIZE: 參數加入 `keyword`，並且在 index.hbs:8 加入 `value="{{keyword}}"`
})

app.get('/movies/:id', (req, res) => {
  const id = req.params.id
  const movie = movies.find((mv) => mv.id.toString() === id)
  res.render('detail', { movie, BASE_IMG_URL })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})

