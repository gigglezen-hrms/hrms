// src/config/swagger.js
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const API_VERSION = '1.0.0';

const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'HRMS SaaS API',
        version: API_VERSION,
        description: 'Multi-tenant HRMS API with RLS, RBAC and tenant-aware modules'
    },
    servers: [
        {
            url: 'http://localhost:5000/api',
            description: 'Local dev server'
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT token. Format: **Bearer &lt;token&gt;**'
            }
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ]
};

const options = {
    definition: swaggerDefinition,
    // Scan your route files for JSDoc annotations
    apis: [
        path.join(__dirname, '../routes/*.js'),
        path.join(__dirname, '../modules/**/*.route.js'),
        path.join(__dirname, '../modules/**/*.routes.js')
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};
