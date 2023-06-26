const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
// const customers = require('./routes/customers');
// const genres = require('./routes/genres');
// const rentals = require('./routes/rentals');
// const movies = require('./routes/movies');
// const users = require('./routes/users');
// const auths = require('./routes/auths');
const app = express();

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [new winston.transports.Console()],
// });
// if (!config.get('jwtPrivateKey')) {
//   console.error('FATAL ERROR: jwtPrivateKey not defined');
//   process.exit(1);
// }

// console.log(`Environment info provided by Node: ${process.env.NODE_ENV}`);
// console.log(`Environment info provided by Express: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// if (app.get('env') == 'development') app.use(morgan('tiny'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hi');
});

// app.use('/api/customers', customers);
// app.use('/api/genres', genres);
// app.use('/api/movies', movies);
// app.use('/api/rentals', rentals);
// app.use('/api/users', users);
// app.use('/api/auths', auths);

app.listen(port, () =>
  console.log(`the server started listening at port: ${port}`)
);
