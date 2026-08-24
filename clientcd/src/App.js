import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const API_URL = 'https://redesigned-couscous-jrqjqpxpjpghxpj5x-5000.app.github.dev/api/students';

  // Lấy danh sách sinh viên (Câu 47)
  const fetchStudents = () => {
    axios.get(API_URL)
      .then(res => setStudents(res.data))
      .catch(err => console.log('Lỗi lấy danh sách:', err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Hàm xử lý gửi dữ liệu POST (Câu 49)
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(API_URL, formData)
      .then(res => {
        alert('Thêm sinh viên thành công!');
        fetchStudents(); // Tải lại danh sách ngay lập tức
        setFormData({ studentId: '', name: '', email: '' }); // Xóa trắng form
      })
      .catch(err => console.log('Lỗi gửi dữ liệu POST:', err));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Quản Lý Sinh Viên</h1>

      {/* Form thêm sinh viên (Câu 48 & 49) */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Thêm Sinh Viên Mới</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'inline-block', width: '80px' }}>MSSV:</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Nhập MSSV"
              required
              style={{ padding: '8px', width: '70%' }}
            />
          </div>
          <div>
            <label style={{ display: 'inline-block', width: '80px' }}>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập Họ và tên"
              required
              style={{ padding: '8px', width: '70%' }}
            />
          </div>
          <div>
            <label style={{ display: 'inline-block', width: '80px' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập Email"
              required
              style={{ padding: '8px', width: '70%' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', width: '150px', marginTop: '10px' }}>
            Thêm Sinh Viên
          </button>
        </form>
      </div>

      {/* Danh sách sinh viên (Câu 47) */}
      <h3>Danh Sách Sinh Viên</h3>
      {students.length === 0 ? (
        <p>Chưa có sinh viên nào...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id || s.studentId}>
                <td>{s.studentId}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;