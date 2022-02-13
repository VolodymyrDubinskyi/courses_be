import { makeQuery } from './db.js'

async function deleteTodo(id) {
  const query = `DELETE FROM todos WHERE id=${id}`

  await makeQuery(query)

  return
}

export default deleteTodo
