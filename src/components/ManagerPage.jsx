//ManagerPage.jsx
import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_APPLICATIONS = gql`
  query GetApplications {
    applications {
      id
      status
      lastName
      firstName
      middleName
      birthDate
      phoneNumber
      email
      passportSeries
      passportNumber
      statementOfAccreditive
      document
      agreeToTerms
    }
  }
`;

const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($id: ID!, $status: String!) {
    updateApplicationStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const ManagerPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_APPLICATIONS);
  const [updateApplicationStatus] = useMutation(UPDATE_APPLICATION_STATUS);

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus({ variables: { id, status } });
      refetch();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleDownloadFile = async (fileId, filename) => {
    try {
      const response = await fetch(`/documents/${fileId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <header className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="text-white fw-bold me-auto">Личный кабинет</span>
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
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="nav-link active">Заявки</button>
              </li>
              <li className="nav-item">
                <button className="nav-link">Профиль</button>
              </li>
              <li className="nav-item">
                <button className="nav-link">Выход</button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="mt-4">
        <h2 className="mb-4">Список заявок</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Отчество</th>
              <th>Дата рождения</th>
              <th>Номер телефона</th>
              <th>Email</th>
              <th>Серия паспорта</th>
              <th>Номер паспорта</th>
              <th>Заявление на открытие аккредитива</th>
              <th>Документ основания</th>
              <th>Согласие на обработку данных</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.applications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.lastName}</td>
                <td>{application.firstName}</td>
                <td>{application.middleName}</td>
                <td>{application.birthDate}</td>
                <td>{application.phoneNumber}</td>
                <td>{application.email}</td>
                <td>{application.passportSeries}</td>
                <td>{application.passportNumber}</td>
                <td>
                  {application.statementOfAccreditive && (
                    <button
                      className="btn btn-link"
                      onClick={() =>
                        handleDownloadFile(application.statementOfAccreditive, 'statement.pdf')
                      }
                    >
                      Скачать
                    </button>
                  )}
                </td>
                <td>
                  {application.document && (
                    <button
                      className="btn btn-link"
                      onClick={() => handleDownloadFile(application.document, 'document.pdf')}
                    >
                      Скачать
                    </button>
                  )}
                </td>
                <td>{application.agreeToTerms ? 'Да' : 'Нет'}</td>
                <td>
                  {application.status === 'pending'
                    ? 'В обработке'
                    : application.status === 'approved'
                    ? 'Одобрена'
                    : application.status === 'rejected'
                    ? 'Отклонена'
                    : application.status}
                </td>
                <td>
                  {application.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleStatusChange(application.id, 'approved')}
                      >
                        Одобрить
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ManagerPage;