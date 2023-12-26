const express = require('express');
const router = express.Router();
const zod = require('zod');
var jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require('uuid');



const {pool} = require('../config')

const createUserSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  dateofbirth: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string()
});


const signinUserSchema = zod.object({
  username: zod.string(),
  password: zod.string()
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
  const request = numberSchema.safeParse(req.params.userId)

  const token = req.header("x-auth-token");

    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: "No authentication token, authorization denied.",
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Token verification failed, authorization denied.",
          jwtExpired: true,
        });  
 
  const insertQuery = 'select * from users'

  pool.query(insertQuery, (error, result) => {
    if (error) {
      console.error('Error receieving user details:', error);
    } else {
       const allUsers = result.rows;
        const user = allUsers.find((u) => { 
         return u.id === request.data});

       if (!user) {
         return res.status(404).json({ message: 'User not found', success: false });
       }
     
       res.status(200).json({ user, message: 'User details', success: true });
    }
  })


});

/*  Post request for users */
router.post('/', async (req, res) => {
  const response = createUserSchema.safeParse(req.body);
  const {data} = response
  var ciphertext = CryptoJS.AES.encrypt(data.password, 'secret key 123').toString();

   if (!response.success) {
    return res.status(400).json({ message: 'Invalid request data', success: false, error });
  }

  const insertQuery = 'INSERT INTO users (id, username, password, dateofbirth, firstname, lastname, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const values = [uuidv4(),data.username, ciphertext, data.dateofbirth, data.firstName, data.lastName, data.email];


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

router.post('/signin', (req, res) => {
  const insertQuery = 'select * from users'

  const response = signinUserSchema.safeParse(req.body);

  pool.query(insertQuery, (error, result) => {
    if (error) {
      res.status(200).json({message:"Not able to get users detail."})
     } else {
       const allUsers = result.rows;
       const userExist = allUsers.some((user) => response.data.username.toLowerCase() === user.username.toLowerCase())

       const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          username: response.data.username,
        },
        process.env.JWT_SECRET
      );

       if(!userExist){
        res.status(200).json({message:"user is not exist in db."})
       } else {
        const user = allUsers.find((user) => response.data.username.toLowerCase() === user.username.toLowerCase())
        var bytes  = CryptoJS.AES.decrypt(user.password, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        if(originalText.toLowerCase() === response.data.password.toLowerCase()){
          res.status(200).json({
            success: true,
            result: {
              token,
              user: {
                name: user.name,
                isLoggedIn: true,
              },
            },
            message: "Successfully login",
          })
        } else {
          res.status(200).json({message:"password is not correct."})
        }
       }
    }
  })
})


module.exports = router;
