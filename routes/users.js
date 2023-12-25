const express = require('express');
const router = express.Router();
const zod = require('zod');

const {pool} = require('../config')

const createUserSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  dateofbirth: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string()
});

const numberSchema = zod.string();

const users = [];

// GET /users
router.get('/', (req, res) => {

  const insertQuery = 'select * from users'

  pool.query(insertQuery, (error, result) => {
    if (error) {
      console.error('Error receieving user details:', error);
    } else {
       const allUsers = result.rows;
       res.status(201).json({ allUsers, message: 'All Users get successfully', success: true });
    }
  })
 });


/* Get request to get the user detail */
router.get('/:userId', (req, res) => {
  const result = numberSchema.safeParse(req.params.userId)
  const user = users.find((u) => u.id === result.data);

  if (!user) {
    return res.status(404).json({ message: 'User not found', success: false });
  }

  res.status(200).json({ user, message: 'User details', success: true });
});

/*  Post request for users */
router.post('/', async (req, res) => {
  const response = createUserSchema.safeParse(req.body);

  const {data} = response
  if (!response.success) {
    return res.status(400).json({ message: 'Invalid request data', success: false, error });
  }

  const insertQuery = 'INSERT INTO users (username, password, dateofbirth, firstname, lastname, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [data.username, data.password, data.dateofbirth, data.firstName, data.lastName, data.email];


  pool.query(insertQuery, values, (error, result) => {
    if (error) {
      console.error('Error inserting user details:', error);
    } else {
      const insertedUser = result.rows[0];
      console.log('User inserted successfully:', insertedUser);
      res.status(201).json({ user: insertedUser, message: 'User created successfully', success: true });

    }
  })
});


module.exports = router;
