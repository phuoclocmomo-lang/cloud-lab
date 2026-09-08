const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Chuỗi kết nối MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://loccubu:1234@cluster0.dxpydkn.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Định nghĩa Schema và Model cho Sinh viên
const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String
});
const Student = mongoose.model('Student', studentSchema);

// 1. Lấy danh sách sinh viên (GET)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Thêm sinh viên mới (POST)
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Cập nhật thông tin sinh viên - CÂU 77 (PUT)
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Xóa sinh viên (DELETE)
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sinh viên thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`)); 