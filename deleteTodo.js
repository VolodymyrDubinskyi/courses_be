import { makeQuery } from './db.js'

async function deleteTodo({ id, userId }) {
  const query = `DELETE FROM todos WHERE id=${id} AND user_id=${userId}`

  await makeQuery(query)

  return
}

export default deleteTodo
