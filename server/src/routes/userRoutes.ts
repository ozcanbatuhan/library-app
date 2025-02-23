import express from 'express';
import { getUsers, getUserById, borrowBook, returnBook } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/:userId/borrow/:bookId', borrowBook);
router.post('/:userId/return/:bookId', returnBook);

export default router; 