import api from './axios';

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  borrowBook: (userId: string, bookId: string) => 
    api.post(`/users/${userId}/borrow/${bookId}`),
  returnBook: (userId: string, bookId: string, rating: number) => 
    api.post(`/users/${userId}/return/${bookId}`, { rating }),
};

export const bookService = {
  getAll: () => api.get('/books'),
  getById: (id: string) => api.get(`/books/${id}`),
}; 