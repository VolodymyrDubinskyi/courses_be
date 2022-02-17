import { makeQuery } from './db.js'

async function getTodos({ userId }) {
  let GET_TODOS = `SELECT * FROM todos WHERE user_id = ${userId}`

  const res = await makeQuery(GET_TODOS)

  return res
}

export default getTodos
