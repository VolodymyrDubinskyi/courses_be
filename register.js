import { makeQuery } from './db.js'

async function createTodo({ email, password }) {
  const id = Math.floor(Math.random() * 1000000)

  const query = `INSERT INTO users (id, email, password) VALUES (${id}, '${email}', '${password}')`
  await makeQuery(query)

  return { id }
}

export default createTodo
