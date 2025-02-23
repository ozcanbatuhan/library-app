import { Request, Response } from 'express';
import { prisma } from '../index';
import { UserWithBorrows, BorrowWithBook } from '../types';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        borrows: {
          include: {
            book: true,
          },
        },
      },
    }) as UserWithBorrows | null;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      id: user.id,
      name: user.name,
      books: {
        present: user.borrows
          .filter((borrow) => !borrow.returnDate)
          .map((borrow) => ({
            id: borrow.bookId,
            name: borrow.book.name,
          })),
        past: user.borrows
          .filter((borrow) => borrow.returnDate)
          .map((borrow) => ({
            id: borrow.bookId,
            name: borrow.book.name,
            userScore: borrow.rating,
          })),
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;

    // kitap var mı bak
    const book = await prisma.book.findUnique({
      where: { id: Number(bookId) },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // kitap ödünç alınmış mı
    const existingBorrow = await prisma.borrow.findFirst({
      where: {
        bookId: Number(bookId),
        returnDate: null,
      },
    });

    if (existingBorrow) {
      return res.status(400).json({ error: 'Book is already borrowed' });
    }

    // new borrow kaydı oluştur
    const borrow = await prisma.borrow.create({
      data: {
        userId: Number(userId),
        bookId: Number(bookId),
        borrowDate: new Date(),
      },
    });

    res.json({ message: 'Book borrowed successfully', borrow });
  } catch (error) {
    res.status(500).json({ error: 'Failed to borrow book' });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;
    const { rating } = req.body;

    // Önce mevcut ödünç alma kaydını bul
    const borrow = await prisma.borrow.findFirst({
      where: {
        userId: Number(userId),
        bookId: Number(bookId),
        returnDate: null,
      },
    });

    if (!borrow) {
      return res.status(404).json({ error: 'No active borrow found for this book' });
    }

    const updatedBorrow = await prisma.borrow.update({
      where: { id: borrow.id },
      data: {
        returnDate: new Date(),
        rating: rating ? Number(rating) : null,
      },
      include: {
        book: true,
        user: true,
      },
    });

    res.json({ 
      message: 'Book returned successfully',
      borrow: updatedBorrow
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
}; 