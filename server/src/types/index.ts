import { Borrow, Book, User, Prisma } from '@prisma/client';

export interface BorrowWithBook extends Borrow {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: Date;
  returnDate: Date | null;
  rating: Prisma.Decimal | null;
  book: Book;
}

export interface BorrowWithUser extends Borrow {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: Date;
  returnDate: Date | null;
  rating: Prisma.Decimal | null;
  user: User;
}

export interface UserWithBorrows extends User {
  id: number;
  name: string;
  borrows: BorrowWithBook[];
}

export interface BookWithBorrows extends Book {
  id: number;
  name: string;
  author: string;
  year: number;
  borrows: BorrowWithUser[];
}

export interface BorrowWithRelations extends Borrow {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: Date;
  returnDate: Date | null;
  rating: Prisma.Decimal | null;
  user: User;
  book: Book;
} 