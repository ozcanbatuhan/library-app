import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.borrow.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  
  users[0] = await prisma.user.create({ 
    data: { name: 'Eray Aslan' },
  });
  
  users[1] = await prisma.user.create({ 
    data: { name: 'Enes Faruk Meniz' },
  });
  
  users[2] = await prisma.user.create({ 
    data: { name: 'Sefa Eren Şahin' },
  });
  
  users[3] = await prisma.user.create({ 
    data: { name: 'Kadir Mutlu' },
  });

  const books = [];

  books[0] = await prisma.book.create({ 
    data: { 
      name: 'The Hitchhiker\'s Guide to the Galaxy',
      author: 'Douglas Adams',
      year: 1979
    } 
  });
  
  books[1] = await prisma.book.create({ 
    data: { 
      name: 'I, Robot',
      author: 'Isaac Asimov',
      year: 1950
    } 
  });
  
  books[2] = await prisma.book.create({ 
    data: { 
      name: 'Dune',
      author: 'Frank Herbert',
      year: 1965
    } 
  });
  
  books[3] = await prisma.book.create({ 
    data: { 
      name: '1984',
      author: 'George Orwell',
      year: 1949
    } 
  });
  
  books[4] = await prisma.book.create({ 
    data: { 
      name: 'Brave New World',
      author: 'Aldous Huxley',
      year: 1932
    } 
  });

  await prisma.borrow.create({
    data: {
      userId: users[1].id,
      bookId: books[1].id,
      borrowDate: new Date('2024-01-01'),
      returnDate: new Date('2024-01-15'),
      rating: new Prisma.Decimal('8.75')
    }
  });

  await prisma.borrow.create({
    data: {
      userId: users[1].id,
      bookId: books[0].id,
      borrowDate: new Date('2024-02-01'),
      returnDate: new Date('2024-02-15'),
      rating: new Prisma.Decimal('9.50')
    }
  });

  await prisma.borrow.create({
    data: {
      userId: users[1].id,
      bookId: books[4].id,
      borrowDate: new Date('2024-03-01'),
      returnDate: null
    }
  });

}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 