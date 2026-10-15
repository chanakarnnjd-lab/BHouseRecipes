const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

/**
 * @openapi
 * /api/items:
 *   get:
 *     summary: ดึงข้อมูลวัตถุดิบทั้งหมด
 *     description: เรียกดูรายการวัตถุดิบทั้งหมดจากฐานข้อมูล MySQL
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', itemController.getAllItems);

/**
 * @openapi
 * /api/items:
 *   post:
 *     summary: เพิ่มวัตถุดิบใหม่
 *     description: ส่งข้อมูลเพื่อบันทึกวัตถุดิบใหม่ลงในฐานข้อมูล
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: คีย์บอร์ดกลไก
 *               price:
 *                 type: number
 *                 example: 2590
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: เพิ่มวัตถุดิบสำเร็จ
 */
router.post('/', itemController.createItem);

// เส้นทางอื่นๆ เช่น get/export/excel, put, patch, delete...

module.exports = router;
