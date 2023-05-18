require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const {
  HTTP_PORT = 3000
} = process.env;

const file = fs.readFileSync('./docs.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use(express.json());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

// 404 handler
app.use((req, res, next) => {
  return res.status(404).json({ message: `can't find ${req.url}` });
});

// 500 handler
app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}!`))