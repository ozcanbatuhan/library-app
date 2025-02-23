import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { endpoints } from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorSnackbar from '../components/ErrorSnackbar';

interface UserDetail {
  id: number;
  name: string;
  books: {
    present: { id: number; name: string }[];
    past: { id: number; name: string; userScore: number }[];
  };
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [rating, setRating] = useState<string>('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${endpoints.userDetail(id!)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReturn = async () => {
    try {
      if (!selectedBookId) {
        throw new Error('No book selected');
      }

      const response = await fetch(endpoints.returnBook(id!, selectedBookId.toString()), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: parseFloat(rating) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to return book');
      }

      await fetchData(); // Kullanıcı verilerini yenile
      setReturnDialogOpen(false);
      setRating('0.00');
      setSelectedBookId(null);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to return book');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {user?.name}
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Currently Borrowed Books
          </Typography>
          <List>
            {user?.books.present.map((book) => (
              <ListItem key={book.id}>
                <ListItemText primary={book.name} />
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setReturnDialogOpen(true);
                  }}
                >
                  Return
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Previously Borrowed Books
          </Typography>
          <List>
            {user?.books.past.map((book, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={book.name} 
                  secondary={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Rating 
                        value={Number(book.userScore)} 
                        readOnly 
                        max={10} 
                        precision={0.1}
                      />
                      <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                        ({Number(book.userScore).toFixed(2)})
                      </span>
                    </span>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>

      <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
        <DialogTitle>Return Book</DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ mb: 2 }}>Rate this book (1.00-10.00):</Typography>
          <TextField
            type="text"
            placeholder="0.00"
            value={rating}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setRating(value);
              }
            }}
            fullWidth
            error={parseFloat(rating) < 1 || parseFloat(rating) > 10}
            helperText={parseFloat(rating) < 1 || parseFloat(rating) > 10 ? "Rating must be between 1.00 and 10.00" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setReturnDialogOpen(false);
            setRating('0.00');
          }}>Cancel</Button>
          <Button 
            onClick={handleReturn} 
            variant="contained"
            disabled={parseFloat(rating) < 1 || parseFloat(rating) > 10}
          >
            Return Book
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorSnackbar
        open={!!error}
        message={error}
        onClose={() => setError('')}
      />
    </>
  );
};

export default UserDetail; 