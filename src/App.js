import './App.css';
import React, { useEffect, useState, useCallback, useMemo } from "react";

export default function App() {
  const allAnimalsUrl = 'all'; // Для отображения всех категорий

  const rabbitImages = useMemo(() => [
    'https://i.pinimg.com/736x/5a/ac/27/5aac274d2001f0b3afc6d9debb3e1889.jpg',
    'https://i.pinimg.com/736x/c9/b3/a9/c9b3a9359177b8461f328a16a36711d9.jpg',
    'https://i.pinimg.com/736x/5c/d4/0b/5cd40be716447955c5febac9961d27ab.jpg',
    'https://i.pinimg.com/736x/c6/28/db/c628db39f6e50a7871fda0455e836de8.jpg'
  ], []);

  const catImages = useMemo(() => [
    'https://i.pinimg.com/736x/12/d8/76/12d876e93ebc8269a994d434baf17d96.jpg',
    'https://i.pinimg.com/736x/1e/65/f9/1e65f9f75eb8f769d8710727f42cee54.jpg',
    'https://i.pinimg.com/736x/32/7a/d4/327ad462f47457f24a612160c86b76a4.jpg',
    'https://i.pinimg.com/736x/ab/7a/f6/ab7af68976df318685d2d942725f1a50.jpg'
  ], []);

  const chickImages = useMemo(() => [
    'https://i.pinimg.com/736x/ce/71/e7/ce71e7252fec587ea404b21087364b1f.jpg',
    'https://i.pinimg.com/736x/fd/3e/86/fd3e86317f9ef3114b43e08d1295a8f3.jpg'
  ], []);

  const [imgs, setImgs] = useState([]);
  const [category, setCategory] = useState(allAnimalsUrl);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchImages = useCallback(() => {
    setError(null);
    try {
      let categoryImages = [];
      if (category === allAnimalsUrl) {
        // Объединяем все изображения
        categoryImages = [
          ...rabbitImages,
          ...catImages,
          ...chickImages
        ];
      } else if (category === "rabbits") {
        categoryImages = rabbitImages;
      } else if (category === "cats") {
        categoryImages = catImages;
      } else if (category === "chicks") {
        categoryImages = chickImages;
      }

      const startIndex = (currentPage - 1) * itemsPerPage;
      const currentImages = categoryImages.slice(startIndex, startIndex + itemsPerPage);
      setImgs(currentImages);
    } catch (error) {
      setError('Ошибка при загрузке изображений: ' + error.message);
    }
  }, [category, rabbitImages, catImages, chickImages, currentPage]); // Включено rabbitImages, catImages, chickImages и currentPage в зависимости

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене категории
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = useMemo(() => {
    if (category === allAnimalsUrl) {
      return Math.ceil((rabbitImages.length + catImages.length + chickImages.length) / itemsPerPage);
    } else if (category === "rabbits") {
      return Math.ceil(rabbitImages.length / itemsPerPage);
    } else if (category === "cats") {
      return Math.ceil(catImages.length / itemsPerPage);
    } else if (category === "chicks") {
      return Math.ceil(chickImages.length / itemsPerPage);
    }
  }, [category, rabbitImages, catImages, chickImages]);

  useEffect(() => {
    fetchImages();
  }, [category, currentPage, fetchImages]); // Добавлено fetchImages в зависимости

  return (
    <>
      <div className="container">
        <div className="buttons-container">
          <button value={allAnimalsUrl} onClick={handleCategoryChange}>Все</button>
          <button value="rabbits" onClick={handleCategoryChange}>Зайчики</button>
          <button value="cats" onClick={handleCategoryChange}>Коты</button>
          <button value="chicks" onClick={handleCategoryChange}>Цыплята</button>
        </div>

        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="images-container">
            {imgs.map((img, index) => (
              <img key={index} id={`img${index}`} width={250} height={250} src={img} alt={`animal ${index}`} />
            ))}
          </div>
        )}

        <div className="pagination">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>Первая</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Назад</button>
          <span>Страница {currentPage} из {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Вперед</button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Последняя</button>
        </div>
      </div>
    </>
  );
}
