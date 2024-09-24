import { nanoid } from 'nanoid';
import { books } from './books.js';

// create new book
const addBooks = (req, res) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const id = nanoid(16);
  const timeStamp = new Date().toISOString();

  if (!name) {

    // name is not exits
    return res.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
  } else if (readPage > pageCount) {

    // readPage greater than pageCount
    return res.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished : readPage === pageCount,
    insertedAt: timeStamp,
    updatedAt: timeStamp,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response  = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    response.code(201);
    return response;
  }
};

// read all books
const getAllBooks = (req, res) => {
  const { name, reading, finished } = req.query;

  // query parameter is not exist
  if (!name && !reading && !finished) {
    return res.response({
      status: 'success',
      data: {
        books: books.map((book) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        })
      }
    });
  }

  if (name) {
    const data = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

    // query parameter name is exist
    return res.response({
      status: 'success',
      data: {
        books: data.map((book) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        })
      }
    });
  } else if (reading) {
    const value = !!(parseInt(reading));
    const data = books.filter((book) => book.reading === value);

    // query parameter reading is exist
    return res.response({
      status: 'success',
      data: {
        books: data.map((book) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        })
      }
    });
  } else if (finished) {
    const value = !!(parseInt(finished));
    const data = books.filter((book) => book.finished === value);

    // query parameter finished is exist
    return res.response({
      status: 'success',
      data: {
        books: data.map((book) => {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        })
      }
    });
  }
};

// read book by id
const getBookById = (req, res) => {
  const { bookId } = req.params;

  const book = books.find((book) => book.id === bookId);

  // book is exist
  if (book !== undefined) {
    return res.response({
      status: 'success',
      data: {
        book: book,
      }
    }).code(200);
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// edit book
const updateBook = (req, res) => {
  const { bookId } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const timeStamp = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  // book is exist
  if (index !== -1) {

    if (!name) {

      // name is not exist
      return res.response({
        'status': 'fail',
        'message': 'Gagal memperbarui buku. Mohon isi nama buku'
      }).code(400);
    } else if (readPage > pageCount) {

      // readPage greaterthan pageCount
      return res.response({
        'status': 'fail',
        'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished : readPage === pageCount,
      insertedAt: timeStamp,
      updatedAt: timeStamp
    };

    return res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const removeBookById = (req, res) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);

  // book is exist
  if (index !== -1) {
    books.splice(index, 1);

    return res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

export {
  addBooks,
  getAllBooks,
  getBookById,
  updateBook,
  removeBookById,
};