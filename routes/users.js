const express = require('express');
const router = express.Router();
const zod = require('zod');

const createUserSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  dob: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const numberSchema = zod.string();

const users = [];

// GET /users
router.get('/', (req, res) => {
  res.status(200).json({ users, message: 'List of users', success: true });
});

// GET /users/:id
router.get('/:userId', (req, res) => {
  const result = numberSchema.safeParse(req.params.userId)
  const user = users.find((u) => u.id === result.data);

  if (!user) {
    return res.status(404).json({ message: 'User not found', success: false });
  }

  res.status(200).json({ user, message: 'User details', success: true });
});

// POST /users
router.post('/', (req, res) => {
  const { value, error } = createUserSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({ message: 'Invalid request data', success: false, error });
  }

  const newUser = { id: Date.now().toString(), ...value };
  users.push(newUser);

  res.status(201).json({ user: newUser, message: 'User created successfully', success: true });
});

module.exports = router;
