const express = require('express');
const router = express.Router();
const zod = require('zod');
var jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require('uuid');



const {pool} = require('../config');
const { catchErrors } = require('../handlers/errorHandler');
const {userRegister, login, getAllUser, getUserDetail} = require('../controller/userController')
 

/*   route to get all the user details */
router.route('/').get(catchErrors(getAllUser));


/* Get request to get the user detail */
router.route('/:userId').get(catchErrors(getUserDetail));

/*  Post request for users */
router.route('/').post(catchErrors(userRegister));

/*  request to logIn user*/
router.route('/signin').post(catchErrors(login))

module.exports = router;
