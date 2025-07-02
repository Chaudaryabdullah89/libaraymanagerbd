const express = require('express');
const router = express.Router();
const Book = require('../Models/Books');
const User = require('../Models/User');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../utils/cloudinary.config');
const cloudinaryV2 = require('cloudinary').v2;
require('dotenv').config();

router.post('/add-book', async (req, res) => {
  console.log('Received request to add book. Request body:', req.body);
    try {
        console.log('Received request to add book. Request body:', req.body);

        const { title, author, year, description, genre, price, image ,user ,pdf} = req.body;

        // Log each field individually for clarity
        console.log('Book details:');
        console.log('  Title:', title);
        console.log('  Author:', author);
        console.log('  Year:', year);
        console.log('  Description:', description);
        console.log('  Genre:', genre);
        console.log('  Price:', price);
        console.log('  Image URL:', image);
        console.log('User Id' , user)

        const newBook = new Book({ title, author, year, description, genre, price, pdf, image,user });

        console.log('Saving new book to database...');
        await newBook.save();
        console.log('Book saved successfully:', newBook);

        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error('Error occurred while adding book:', error);
        res.status(500).json({ message: 'Failed to add book', error: error.message });
    }
});

router.get('/get-books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});
router.get('/get-book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error: error.message });
  }
});

// Dynamic route to get books for a specific user by userId
router.get('/get-my-books', async (req, res) => {
  try {
    const userId = req.params.userId || req.query.user || req.body.user || req.headers['x-user-id'];
    let books;
    if (userId) {
      books = await Book.find({ user: userId });
    } else {
      books = await Book.find();
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user books', error: error.message });
  }
});

router.post('/edit-my-book', async (req, res) => {
    try {
        // Log the entire request body
        console.log('Received request to edit book. Request body:', req.body);

        // Destructure the expected fields from the request body
        const { _id, title, author, year, description, genre, price, image, user } = req.body;

        // Log each field individually for debugging
        console.log('Book edit details:');
        console.log('  _id:', _id);
        console.log('  Title:', title);
        console.log('  Author:', author);
        console.log('  Year:', year);
        console.log('  Description:', description);
        console.log('  Genre:', genre);
        console.log('  Price:', price);
        console.log('  Image URL:', image);
        console.log('  User Id:', user);

        if (!_id) {
            return res.status(400).json({ message: 'Book _id is required for editing.' });
        }

        // Find the book by _id and update its fields
        const updatedBook = await Book.findByIdAndUpdate(
            _id,
            { title, author, year, description, genre, price, image, user },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        console.error('Error occurred while editing book:', error);
        res.status(500).json({ message: 'Failed to edit book', error: error.message });
    }
});



router.post('/cloudinary-signature', (req, res) => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const signature = cloudinaryV2.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );
  res.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY
  });
});
router.delete('/delete-book/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required.' });
        }

        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        res.status(200).json({ message: 'Book deleted successfully.', book: deletedBook });
    } catch (error) {
        console.error('Error occurred while deleting book:', error);
        res.status(500).json({ message: 'Failed to delete book', error: error.message });
    }
});
router.get('/get-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(`[get-user] Request received. Params:`, req.params);

  if (!userId) {
    console.log(`[get-user] No userId provided in params.`);
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const myuser = await User.findById(userId);
    if (!myuser) {
      console.log(`[get-user] User not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User not found.' });
    }
    console.log(`[get-user] User found:`, myuser);
    res.send({
      user: myuser
    });
  } catch (error) {
    console.error(`[get-user] Error fetching user for ID: ${userId}`, error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});


module.exports = router;