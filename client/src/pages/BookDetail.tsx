import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorSnackbar from '../components/ErrorSnackbar';
import { bookService, userService } from '../services/api';
import axios from 'axios';

interface BookDetail {
  id: number;
  name: string;
  author: string;
  year: number;
  score: number | string;
  currentOwner: string | null;
}

interface User {
  id: number;
  name: string;
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookResponse, usersResponse] = await Promise.all([
        bookService.getById(id!),
        userService.getAll()
      ]);

      setBook(bookResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setBook(null);
      setUsers([]);
    };
  }, [id]);

  const handleBorrow = async () => {
    try {
      await userService.borrowBook(selectedUser, id!);
      const bookResponse = await bookService.getById(id!);
      setBook(bookResponse.data);
      setBorrowDialogOpen(false);
      setError('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to borrow book');
      } else {
        setError('Failed to borrow book');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return <Typography>Book not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/books')} sx={{ mb: 2 }}>
        Back to Books
      </Button>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {book.name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Author:</Typography>
            <Typography>{book.author}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Year:</Typography>
            <Typography>{book.year}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Average Rating:
            </Typography>
            {book.score === -1 ? (
              <Typography color="text.secondary">No ratings yet</Typography>
            ) : (
              <span style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography component="span">
                  {Number(book.score).toFixed(2)}
                </Typography>
                <Rating 
                  value={Number(book.score)} 
                  readOnly 
                  max={10} 
                  precision={0.1} 
                />
              </span>
            )}
          </Grid>

          <Grid item xs={12}>
            {book.currentOwner ? (
              <Typography color="text.secondary">
                Currently borrowed by: {book.currentOwner}
              </Typography>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setBorrowDialogOpen(true)}
              >
                Borrow Book
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={borrowDialogOpen} onClose={() => setBorrowDialogOpen(false)}>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="Select User"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBorrow}
            variant="contained"
            disabled={!selectedUser}
          >
            Borrow
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorSnackbar
        open={!!error}
        message={error}
        onClose={() => setError('')}
      />
    </Container>
  );
};

export default BookDetail; 