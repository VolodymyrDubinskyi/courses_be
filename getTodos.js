import { makeQuery, GET_TODOS } from './db.js'

async function getTodos() {
  const res = await makeQuery(GET_TODOS)

  return res
}

export default getTodos
