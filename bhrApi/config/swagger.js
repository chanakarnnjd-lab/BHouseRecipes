const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// การตั้งค่าทั่วไปของ OpenAPI
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express MySQL API',
      version: '1.0.0',
      description: 'ระบบ API สำหรับจัดการสินค้าและเชื่อมต่อ Aiven MySQL',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
  },
  // ชี้ไปยังไฟล์ที่มีการเขียนคำอธิบาย API (ในที่นี้คือไฟล์ทั้งหมดในโฟลเดอร์ routes)
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
