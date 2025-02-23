import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { endpoints } from '../config/api';

interface Book {
  id: number;
  name: string;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(endpoints.books)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch books');
        return response.json();
      })
      .then((data) => {
        // ID'ye göre sırala
        const sortedBooks = data.sort((a: Book, b: Book) => a.id - b.id);
        setBooks(sortedBooks);
      })
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Library Books
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow
                key={book.id}
                hover
                onClick={() => navigate(`/books/${book.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BookList; 