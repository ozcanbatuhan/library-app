import { Request, Response } from 'express';
import { prisma } from '../index';
import { BookWithBorrows } from '../types';

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: {
        borrows: {
          include: {
            user: true,
          },
        },
      },
    }) as BookWithBorrows | null;

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // ödünç alan birisi var mı kontrol et
    const currentBorrow = book.borrows.find(borrow => !borrow.returnDate);
    const currentOwner = currentBorrow?.user.name;

    // averaj kitap puanı
    const ratings = book.borrows
      .filter(borrow => borrow.rating !== null && borrow.returnDate !== null)  // Sadece iade edilmiş ve puanlanmış kitaplar
      .map(borrow => Number(borrow.rating));  // Rating'leri number'a çevir

    const score = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : -1;  // score yoksa -1 döndürüyor

    res.json({
      id: book.id,
      name: book.name,
      author: book.author,
      year: book.year,
      score: score === -1 ? -1 : Number(score),
      currentOwner: currentOwner || null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
}; 