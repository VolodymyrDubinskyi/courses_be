import { makeQuery } from './db.js'

async function createTodo({ text }) {
  const id = Math.floor(Math.random() * 1000000)

  const status = false
  const query = `INSERT INTO todos (id, text, status) VALUES (${id}, '${text}', ${status})`
  await makeQuery(query)

  return { status, id, text }
}

export default createTodo
