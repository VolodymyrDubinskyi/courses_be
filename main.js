import url from 'url'
import http from 'http'
import './db.js'
import getTodos from './getTodos.js'
import createTodo from './createTodo.js'
import deleteTodo from './deleteTodo.js'

// conn.query(query, (err, res, field) => {
//   console.log('res', res)
//   console.log('field', field)
// })

http
  .createServer((req, res) => {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', async chunk => {
      const { pathname } = url.parse(req.url)
      if (body) {
        body = JSON.parse(body)
      }

      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': 'http://localhost:3003',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
          'Access-Control-Allow-Headers': 'Content-Type',
        })

        res.end()
      } else {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': 'http://localhost:3003',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
        })

        const [_, route, id] = pathname.split('/')

        switch (route) {
          case 'todos':
            switch (req.method) {
              case 'GET':
                const todos = await getTodos()

                res.end(JSON.stringify(todos))

                break
              case 'POST':
                const todo = await createTodo({ text: body.text })

                res.end(JSON.stringify(todo))

                break
              case 'DELETE':
                await deleteTodo(id)

                res.end()

                break
            }
            break
          case 'users':
            break
          default:
            res.end(null)
        }
      }
    })
  })
  .listen(3010)
