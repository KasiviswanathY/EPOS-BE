import { version } from '../../package.json';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import { config } from '../config';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Inventory Management API',
      version: version,
      description: 'API documentation for the Inventory Management system',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    servers: [
      {
        url: `${config.serverUrl}/api/v1`,
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/schemas/*.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app: Express) {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log(`Swagger docs available at ${config.serverUrl}/api-docs`);
}

export default swaggerDocs;
