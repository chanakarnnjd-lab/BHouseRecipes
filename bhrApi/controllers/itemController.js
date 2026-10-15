const pool = require('../config/db'); // ดึง Database Pool มาใช้งาน

// 1. ดึงข้อมูลสินค้าทั้งหมด (GET)
exports.getAllItems = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items');
    res.status(200).json({
      success: true,
      message: 'ดึงข้อมูลสินค้าสำเร็จ',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. ดึงข้อมูลสินค้าชิ้นเดียวตาม ID (GET)
exports.getItemById = async (req, res) => {
  const { id } = req.params; // รับค่า id จาก URL เช่น /api/items/5
  try {
    const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าชิ้นนี้' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. เพิ่มสินค้าใหม่ (POST)
exports.createItem = async (req, res) => {
  const { name, price, stock } = req.body; // รับค่าที่ส่งมาจาก Body (JSON)
  
  // Validation เบื้องต้น
  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อและราคาสินค้า' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO items (name, price, stock) VALUES (?, ?, ?)',
      [name, price, stock || 0]
    );
    
    res.status(201).json({
      success: true,
      message: 'เพิ่มสินค้าสำเร็จ',
      itemId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. อัปเดตข้อมูลสินค้าทั้งหมด (PUT - แทนที่ข้อมูลเดิมทั้งหมด)
exports.updateItemPut = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  // PUT มักจะบังคับให้ส่งข้อมูลมาครบทุกฟิลด์ที่จำเป็น
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน (name, price, stock)' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE items SET name = ?, price = ?, stock = ? WHERE id = ?',
      [name, price, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าที่ต้องการอัปเดต' });
    }

    res.status(200).json({ success: true, message: 'อัปเดตสินค้า (PUT) สำเร็จ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. อัปเดตข้อมูลบางส่วน (PATCH - เปลี่ยนแปลงเฉพาะฟิลด์ที่ส่งมา)
exports.updateItemPatch = async (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body; // รับ Object เช่น { price: 990 } หรือ { name: "ชื่อใหม่", stock: 5 }

  // ถ้าไม่ได้ส่งข้อมูลอะไรมาเลยใน Body
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ success: false, message: 'กรุณาส่งฟิลด์ที่ต้องการอัปเดตอย่างน้อย 1 ฟิลด์' });
  }

  try {
    // 💡 เทคนิคไดนามิกคิวรีสำหรับ PATCH: สร้าง SQL Statement จาก Object keys ที่ส่งมาจริง
    const queries = [];
    const values = [];

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      queries.push(`${key} = ?`);
      values.push(value);
    }

    // เอา id ใส่ไปเป็นค่าสุดท้ายในอาเรย์ของ values สำหรับ WHERE id = ?
    values.push(id);

    // ผลลัพธ์จะได้ SQL หน้าตาประมาณนี้: UPDATE items SET price = ?, stock = ? WHERE id = ?
    const sqlString = `UPDATE items SET ${queries.join(', ')} WHERE id = ?`;

    const [result] = await pool.query(sqlString, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าที่ต้องการอัปเดต' });
    }

    res.status(200).json({ success: true, message: 'อัปเดตสินค้าเฉพาะฟิลด์ (PATCH) สำเร็จ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. ลบข้อมูลสินค้า (DELETE)
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าที่ต้องการลบ' });
    }

    res.status(200).json({ success: true, message: 'ลบสินค้าสำเร็จ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
