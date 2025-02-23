export const API_URL = import.meta.env.VITE_API_URL;

export const endpoints = {
  users: `${API_URL}/users`,
  books: `${API_URL}/books`,
  userDetail: (id: string) => `${API_URL}/users/${id}`,
  bookDetail: (id: string) => `${API_URL}/books/${id}`,
  borrowBook: (userId: string, bookId: string) => `${API_URL}/users/${userId}/borrow/${bookId}`,
  returnBook: (userId: string, bookId: string) => `${API_URL}/users/${userId}/return/${bookId}`,
}; 