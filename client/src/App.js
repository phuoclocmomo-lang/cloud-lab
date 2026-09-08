import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://redesigned-couscous-jrqjqpxpjpgxhpj5x-5000.app.github.dev/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingMongoId, setEditingMongoId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.email) return;

    try {
      if (isEditing && editingMongoId) {
        // Cập nhật sinh viên (Câu 77)
        await fetch(`${API_URL}/${editingMongoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: form.id, name: form.name, email: form.email })
        });
        setIsEditing(false);
        setEditingMongoId(null);
      } else {
        // Thêm mới sinh viên
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: form.id, name: form.name, email: form.email })
        });
      }
      setForm({ id: '', name: '', email: '' });
      await fetchStudents();
    } catch (err) {
      console.error("Lỗi lưu dữ liệu:", err);
    }
  };

  const handleEdit = (student) => {
    // Ưu tiên lấy _id chuẩn từ MongoDB Atlas
    const mongoId = student._id || student.id;
    
    setForm({
      id: student.studentId || student.id || '',
      name: student.name || '',
      email: student.email || ''
    });
    setEditingMongoId(mongoId);
    setIsEditing(true);
  };

  const handleDelete = async (mongoId) => {
    if (!mongoId) return;
    try {
      await fetch(`${API_URL}/${mongoId}`, { method: 'DELETE' });
      fetchStudents();
    } catch (err) {
      console.error("Lỗi xóa dữ liệu:", err);
    }
  };

  return (
    <div className="container">
      <h1>Quản lý sinh viên</h1>
      
      <h3>{isEditing ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}</h3>
      <form onSubmit={handleSubmit} className="student-form">
        <label>MSSV:</label>
        <input
          type="text"
          name="id"
          value={form.id}
          onChange={handleChange}
          disabled={isEditing}
          required
        />

        <label>Họ tên:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm sinh viên'}</button>
      </form>

      <h3>Danh sách sinh viên</h3>
      <table className="student-table">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id || s.studentId}>
              <td>{s.studentId || s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button className="btn-action" onClick={() => handleEdit(s)}>Sửa</button>
                <button className="btn-action" onClick={() => handleDelete(s._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;