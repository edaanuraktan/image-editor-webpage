import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [params, setParams] = useState({
    width: 0,
    height: 0,
    rotate: 0,
    flip_horizontal: false,
    flip_vertical: false,
    crop_x: 0,
    crop_y: 0,
    crop_width: 0,
    crop_height: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParams({ ...params, [name]: type === 'checkbox' ? checked : Number(value) });
  };

  // 📸 Anında ön izleme burada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageURL = URL.createObjectURL(file);
      setOriginalPreview(imageURL);
      setPreview(null); // önceki sonucu temizle
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    Object.entries(params).forEach(([key, value]) => formData.append(key, value));

    try {
      const response = await axios.post("http://127.0.0.1:8000/process-image/", formData, {
        responseType: 'blob'
      });
      const imgUrl = URL.createObjectURL(response.data);
      setPreview(imgUrl);
    } catch (error) {
      alert("Bir hata oluştu! Sunucuya bağlanılamıyor.");
    }
  };

  const handleOpenNewTab = () => {
    if (preview) {
      window.open(preview, "_blank");
    }
  };

  const handleDownload = () => {
    if (preview) {
      const link = document.createElement('a');
      link.href = preview;
      link.download = 'duzenlenmis_resim.png';
      link.click();
    }
  };

  return (
    <div className="container">
      <h1>✨Resim Düzenleme Uygulaması✨</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Resim Yükle:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>
        <label>
          Genişlik (px):
          <input name="width" type="number" value={params.width} onChange={handleChange} />
        </label>
        <label>
          Yükseklik (px):
          <input name="height" type="number" value={params.height} onChange={handleChange} />
        </label>
        <label>
          Döndür (°):
          <input name="rotate" type="number" value={params.rotate} onChange={handleChange} />
        </label>
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="flip_horizontal"
            checked={params.flip_horizontal}
            onChange={handleChange}
          />
          <label htmlFor="flip_horizontal">Yatay Çevir</label>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="flip_vertical"
            checked={params.flip_vertical}
            onChange={handleChange}
          />
          <label htmlFor="flip_vertical">Dikey Çevir</label>
        </div>
        <label>
          Kırpma X:
          <input name="crop_x" type="number" value={params.crop_x} onChange={handleChange} />
        </label>
        <label>
          Kırpma Y:
          <input name="crop_y" type="number" value={params.crop_y} onChange={handleChange} />
        </label>
        <label>
          Kırpma Genişliği:
          <input name="crop_width" type="number" value={params.crop_width} onChange={handleChange} />
        </label>
        <label>
          Kırpma Yüksekliği:
          <input name="crop_height" type="number" value={params.crop_height} onChange={handleChange} />
        </label>
        <button type="submit">Resmi Düzenle</button>
      </form>

      {originalPreview && (
        <div className="preview">
          <h2>🧸 Yüklenen Resim:</h2>
          <img src={originalPreview} alt="Orijinal" />
        </div>
      )}

      {preview && (
        <div className="preview">
          <h2>📸 Düzenlenmiş Resim:</h2>
          <img src={preview} alt="Processed" />
          <div style={{ marginTop: '15px' }}>
            <button onClick={handleOpenNewTab} style={{ marginRight: '10px' }}>Yeni Sekmede Aç</button>
            <button onClick={handleDownload}>İndir</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
