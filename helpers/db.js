const { Pool } = require('pg')
const { faker } = require('@faker-js/faker');

const pool = new Pool({
  host: 'silly.db.elephantsql.com',
  user: 'vddhkqgf',
  password: 'X7l3mW308J1VQlOaytfbOIC2Q5vE98Xm',
  database: 'vddhkqgf',
  port: 5432
})

const deleteAndCreateStudent = (req, res) => {

  const student = req.body

  const query = `
    WITH add AS (
      INSERT INTO students (name, email, age, weight, feet_tall)
      VALUES ($1, $2, $3, $4, $5)
    )
    DELETE FROM students WHERE email = $2;
  `

  const values = [
    student.name, student.email, student.age, student.weight, student.feet_tall
  ]

  pool.query(query, values, function (error, result) {
    if (error) {
      return res.status(500).json(error)
    }
    res.status(201).json(result)
  })
}

const deleteStudentByEmail = (req, res) => {

  const studentEmail = req.params.email

  const query = 'DELETE FROM students WHERE email = $1;'

  pool.query(query, [studentEmail], function (error, result) {
    if (error) {
      return res.status(500).json(error)
    }
    res.status(204).end()
  })

}

const selectStudentId = (req, res) => {

  const studentEmail = req.params.email

  const query = 'SELECT id FROM students WHERE email = $1;'

  pool.query(query, [studentEmail], function (error, result) {
    if (error) {
      return res.status(500).json(error)
    }
    res.status(200).json(result.rows[0])
  })
}

const insertEnroll = (req, res) => {
  const { credit_card, student_id, plan_id } = req.body

  const enrollment_code = faker.string.nanoid(6)

  const query = `
    INSERT INTO enrollments (enrollment_code, student_id, plan_id, credit_card, price)
    VALUES ( $1, $2, $3, $4, (SELECT p.price FROM plans p WHERE p.id = 1));
  `

  const values = [
    enrollment_code, student_id, plan_id, credit_card
  ]

  pool.query(query, values, function (error, result) {
    if (error) {
      console.log(error.stack)
      return res.status(500).json(error)
    }
    res.status(201).json(result)
  })
}

module.exports = {
  deleteAndCreateStudent,
  deleteStudentByEmail,
  selectStudentId,
  insertEnroll
}