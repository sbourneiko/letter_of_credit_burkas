//LandingPage
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img src="images/logo.png" alt="Банк" height="30" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/services" className="nav-link active">
                  Услуги
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/individuals" className="nav-link">
                  Частным лицам
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/self-employed" className="nav-link">
                  Самозанятым
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/credit-organizations" className="nav-link">
                  Кредитным организациям
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/shareholders" className="nav-link">
                  Акционерам
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  О банке
                </Link>
              </li>
            </ul>
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-primary me-2">
                Вход
              </Link>
              <Link to="/register" className="btn btn-primary">
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="container-fluid hero bg-image text-center py-5" style={{ backgroundImage: 'url("images/accredit.jpg")' }}>
        <div className="container">
          <h1 className="display-4 fw-bold">Аккредитив</h1>
          <div className="hero__content">
            <p>
              это один из наиболее распространенных и безопасных способов расчетов в международной торговле. Он представляет собой обязательство банка произвести платеж в пользу бенефициара (продавца) при выполнении определенных условий, указанных в аккредитиве
            </p>
            <Link to="/accreditive-form" className="btn btn-primary">Подать заявку на открытие аккредитива</Link>
          </div>
        </div>
      </header>
      <div className="container py-4 d-flex justify-content-center">
        <div className="content">
          <section>
            <h2 className="text-center fw-bold">Что такое аккредитив?</h2>
            <p className="lead text-center">
              Аккредитив — это условное банковское обязательство, выданное по поручению плательщика (покупателя) банку продавца (бенефициара) произвести платеж при выполнении условий аккредитива. Иными словами, это инструмент, обеспечивающий гарантию платежа продавцу при предоставлении им документов, подтверждающих выполнение условий контракта.
            </p>
          </section>
          <section>
            <h2 className="text-center fw-bold">Преимущества использования аккредитива</h2>
            <div className="row justify-content-between">
              <div className="col-md-3 mb-4">
                <div className="card h-100 border-0">
                  <img src="images/security.png" alt="security" height="90" className="mx-auto" />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Безопасность расчетов</h5>
                    <p className="card-text">Аккредитив гарантирует продавцу получение платежа при выполнении всех условий контракта.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card h-100 border-0">
                  <img src="images/graphic.jpg" alt="graphic" height="90" className="mx-auto" />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Снижение рисков</h5>
                    <p className="card-text">Использование аккредитива существенно снижает риски для обеих сторон сделки, так как банк тщательно проверяет документы и выполнение условий контракта.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card h-100 border-0">
                  <img src="images/money.png" alt="money" height="90" className="mx-auto" />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Финансирование сделки</h5>
                    <p className="card-text">Возможность финансирования сделки через банковский кредит, обеспеченный аккредитивом.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-center fw-bold">Как это работает</h2>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <p className="lead text-center">
                  Мы можем выпустить Аккредитив от вашего имени, чтобы обеспечить безопасное средство оплаты вашим поставщикам. Бенефициар Аккредитива, ваш поставщик, получит платеж только в том случае, если они представят документы, точно соответствующие условиям Аккредитива.
                </p>
                <p className="lead text-center">
                  В зависимости от согласованных условий, эти документы могут включать переводной вексель, коносамент или авианакладную, счет-фактуру, страховой полис и сертификат происхождения.
                </p>
              </div>
            </div>
          </section>
          <section className="mb-5">
            <h2 className="text-center fw-bold mb-4">Основные документы для открытия аккредитива</h2>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <ul className="list-group">
                  <li className="list-group-item">Договор купли-продажи или контракт на поставку товаров/услуг.</li>
                  <li className="list-group-item">Спецификация к договору, содержащая наименование, количество и стоимость товаров.</li>
                  <li className="list-group-item">Счет-фактура (инвойс) от поставщика.</li>
                  <li className="list-group-item">Документы, подтверждающие право собственности на товар (коносамент, товарно-транспортная накладная).</li>
                  <li className="list-group-item">Страховой полис.</li>
                  <li className="list-group-item">Сертификат происхождения товара.</li>
                  <li className="list-group-item">Упаковочный лист.</li>
                </ul>
                <p className="text-center mt-3">Их нужно прикрепить к заявке на открытие аккредитива!</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default LandingPage;