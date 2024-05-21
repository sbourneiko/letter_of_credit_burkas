//ConfirmationPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationPage = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h2 className="confirmation-page__title mb-4">Спасибо за заявку!</h2>
            <p className="confirmation-page__description mb-4">
              Ваша заявка успешно отправлена и будет рассмотрена в ближайшее время.
            </p>
            <Link to="/" className="btn btn-primary button-highlight">Вернуться на главную страницу</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;