import mysql from 'mysql'

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'vlad',
  database: 'testdb',
  password: 'password',
})

conn.connect(err => {
  console.log('err', err)
})

export async function makeQuery(query) {
  return new Promise((res, rej) => {
    conn.query(query, (error, data) => {
      if (error) {
        rej(error)
      }

      res(data)
    })
  })
}

export default conn
