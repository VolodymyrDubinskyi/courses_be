import { makeQuery } from './db.js'

async function createTodo({ text, userId }) {
  const id = Math.floor(Math.random() * 1000000)

  const status = false
  const query = `INSERT INTO todos (id, text, status, user_id) VALUES (${id}, '${text}', ${status}, ${userId})`
  await makeQuery(query)

  return { status, id, text }
}

export default createTodo
