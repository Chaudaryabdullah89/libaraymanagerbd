const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const port = 500;
const app = express();
const connectDb = require('./Db/Db.connection');
const userAuth = require('./Routes/UserAuth');
const User = require('./Models/User');
const cors = require('cors');

connectDb();

app.use(cors({
  origin: ['http://localhost:5173', 'https://libaray-manager.vercel.app'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/Views');

app.get('/',(req,res)=>{
  res.send('Welcome to the Book Store API');
})

// app.get('/', async (req, res) => {
//     try {

//         res.render('Dashboard', { title: 'Home Page' });
//     } catch (error) {
//         res.render('Dashboard', { title: 'Home Page', error: error.message });
//     }
// });

// app.get('/register', (req, res) => {
//   res.render('Register', { title: 'Register Page' });
// });

// app.get('/login', (req, res) => {
//   res.render('Login', { title: 'Login Page' });
// });

function isAuthenticated(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}




app.use('/api', userAuth);
app.use('/api', require('./Routes/Book'));
app.use('/api', require('./Routes/DropboxUpload'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});