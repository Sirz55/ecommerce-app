const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swagger');

const swaggerMiddleware = (app) => {
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // Serve JSON documentation
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
  });
};

module.exports = swaggerMiddleware;
