import { makeQuery } from './db.js'

async function getUser({ email }) {
  const GET_USER = `SELECT * FROM users WHERE email = '${email}'`

  const res = await makeQuery(GET_USER)

  return res[0]
}

export default getUser
