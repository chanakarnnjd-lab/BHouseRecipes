
const express = require('express');
require('dotenv').config();

// 1. นำเข้าไฟล์ Routes ที่เราเพิ่งสร้าง
const itemRoutes = require('./routes/itemRoutes');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middleware สำหรับทำให้ Express อ่านข้อมูลแบบ JSON ที่ส่งมาใน HTTP Body ได้
app.use(express.json());


try {
  // 3. เรียกใช้งาน Route โดยกำหนด Path เริ่มต้น (Prefix)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // ทุกๆ เส้นทางใน itemRoutes จะเริ่มต้นด้วย /api/items
  app.use('/api/items', itemRoutes);

  // 4. หน้าแรกสำหรับเช็กสถานะเซิร์ฟเวอร์ทั่วไป
  app.get('/', (req, res) => {
    res.send('🚀 Express API กำลังทำงานปกติครับ!');
  });

  // 5. เปิดรัน Server บน Port ที่กำหนด
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`📄 API Documentation available at http://localhost:${PORT}/api-docs`);
  });

} catch (error) {
  console.error('เกิดข้อผิดพลาดในการเริ่มต้นแอปพลิเคชัน:', error);
}


//         // ทดสอบคิวรี่ข้อมูล
//         const [rows] = await pool.query('SELECT 1 AS currentTime');
//         console.log('เวลาปัจจุบันของเซิร์ฟเวอร์:', rows[0].currentTime);

//         res.json(rows);
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     });

//     // ดึงข้อมูลทั้งหมด (GET)
//     app.get('/users', async (req, res) => {
//       try {
//         const [rows] = await pool.query('SELECT * FROM users');
//         res.json(rows);
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     });

//     // เพิ่มข้อมูลใหม่ (POST) - ใช้ prepared statement ป้องกัน SQL Injection
//     app.post('/users', async (req, res) => {
//       try {
//         const { name, email } = req.body;
//         const [result] = await pool.execute(
//           'INSERT INTO users (name, email) VALUES (?, ?)',
//           [name, email]
//         );
//         res.status(201).json({ id: result.insertId, name, email });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     });

//     // ลบข้อมูล (DELETE)
//     app.delete('/users/:id', async (req, res) => {
//       try {
//         const { id } = req.params;
//         await pool.execute('DELETE FROM users WHERE id = ?', [id]);
//         res.json({ message: 'Deleted successfully' });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     });

//     const PORT = 3000;
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });


//   } catch (error) {
//     console.error('เกิดข้อผิดพลาดในการเริ่มต้นแอปพลิเคชัน:', error);
//   }
// })();


