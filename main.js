import url from 'url'
import http from 'http'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import './db.js'
import getTodos from './getTodos.js'
import createTodo from './createTodo.js'
import deleteTodo from './deleteTodo.js'
import register from './register.js'
import getUser from './getUser.js'

const secretKey = 'key-123'
let refreshTokens = []

http
  .createServer((req, res) => {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', async chunk => {
      let user
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        user = await new Promise(res =>
          jwt.verify(token, secretKey, (err, decoded) => {
            res(decoded)
          }),
        )
      }

      const { pathname } = url.parse(req.url)
      if (body) {
        body = JSON.parse(body)
      }

      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        })

        res.end()
      } else {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json',
        })

        const [_, route, id] = pathname.split('/')
        console.log('route', route)

        switch (route) {
          case 'todos':
            if (!user) {
              res.writeHead(401, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json',
              })
              res.end()
            }

            switch (req.method) {
              case 'GET':
                const todos = await getTodos({ userId: user.id })

                res.end(JSON.stringify(todos))

                break
              case 'POST':
                const todo = await createTodo({ text: body.text, userId: user.id })

                res.end(JSON.stringify(todo))

                break
              case 'DELETE':
                await deleteTodo({ id, userId: user.id })

                res.end()

                break
            }
            break
          case 'users':
            break
          case 'register':
            bcrypt.genSalt(10, (err, salt) => {
              console.log('salt', salt)
              bcrypt.hash(body.password, salt, async (err, hash) => {
                const newObj = { password: hash, email: body.email }
                const id = await register(newObj)

                res.end(JSON.stringify({ id }))
              })
            })

            break
          case 'refresh':
            refreshTokens.find(body.refreshToken)
            const token = jwt.sign(user, secretKey, {
              expiresIn: '30 min',
            })
            const refreshToken = crypto.randomBytes(30).toString('hex')
            refreshTokens.push(refreshToken)
            res.end(JSON.stringify({ token, id: user.id, email: user.email, refreshToken }))

            break
          case 'login':
            const resUser = await getUser({ email: body.email })

            bcrypt.compare(body.password, resUser.password, (err, result) => {
              if (result) {
                const token = jwt.sign({ id: resUser.id, email: resUser.email }, secretKey, {
                  expiresIn: '30 min',
                })

                const refreshToken = crypto.randomBytes(30).toString('hex')
                refreshTokens.push(refreshToken)
                res.end(
                  JSON.stringify({ token, id: resUser.id, email: resUser.email, refreshToken }),
                )
              }
            })
            break
          default:
            res.end(null)
        }
      }
    })
  })
  .listen(3010)
