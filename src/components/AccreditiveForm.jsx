// AccreditiveForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

const SUBMIT_APPLICATION = gql`
  mutation SubmitApplication($formData: ApplicationInput!) {
    submitApplication(formData: $formData) {
      id
      status
    }
  }
`;

const AccreditiveForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
    passportSeries: '',
    passportNumber: '',
    statementOfAccreditive: null,
    document: null,
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
    passportSeries: '',
    passportNumber: '',
    statementOfAccreditive: '',
    document: '',
    agreeToTerms: '',
  });

  const [submitApplication, { loading, error }] = useMutation(SUBMIT_APPLICATION);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let formattedValue = value;

    if (name === 'lastName' || name === 'firstName' || name === 'middleName') {
      formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (name === 'statementOfAccreditive' || name === 'document') {
      setFormData({ ...formData, [name]: files?.[0] || null });
    } else if (name === 'agreeToTerms') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: formattedValue });
    }

    validateField(name, type === 'checkbox' ? checked : formattedValue || (files ? files[0] : null));
  };

  const validateField = (fieldName, value) => {
    let fieldError = '';

    switch (fieldName) {
      case 'lastName':
        const lastnameRegex = /^[А-ЯЁа-яё]*$/;
        fieldError = !lastnameRegex.test(value) ? `Некорректно. Фамилия должна содержать буквы кириллицы!` : '';
        break;
      case 'firstName':
        const nameRegex = /^[А-ЯЁа-яё]*$/;
        fieldError = !nameRegex.test(value) ? `Некорректно. Имя должно содержать буквы кириллицы!` : '';
        break;
      case 'middleName':
        const middleRegex = /^[А-ЯЁа-яё]*$/;
        fieldError = !middleRegex.test(value) ? `Некорректно. Отчество должно содержать буквы кириллицы!` : '';
        break;
      case 'birthDate':
        const currentDate = new Date();
        const birthDateObj = new Date(value);
        const age = currentDate.getFullYear() - birthDateObj.getFullYear();
        fieldError = birthDateObj > currentDate || age < 18 ? 'Вы не достигли совершеннолетия для открытия аккредитива!' : '';
        break;
      case 'phoneNumber':
        const phoneRegex = /^\+7\d{10}$/;
        fieldError = !phoneRegex.test(value) ? 'Некорректный номер телефона (начинается с +7)!' : '';
        break;
      case 'passportSeries':
        const seriesRegex = /^\d{4}$/;
        fieldError = !seriesRegex.test(value) ? 'Некорректно. Серия паспорта состоит из 4 чисел!' : '';
        break;
      case 'passportNumber':
        const numberRegex = /^\d{6}$/;
        fieldError = !numberRegex.test(value) ? 'Некорректно. Номер паспорта состоит из 6 чисел!' : '';
        break;
      case 'email':
        const emailRegex = /^[\w.-]+@(mail\.ru|gmail\.com|yandex\.ru)$/;
        fieldError = !emailRegex.test(value) ? 'Некорректный email. Успользуйте домены @mail.ru, @gmail.com, @yandex.ru!' : '';
        break;
      case 'statementOfAccreditive':
        fieldError = !value ? 'Пожалуйста, прикрепите заявление на открытие аккредитива в формате PDF' : '';
        break;
      case 'document':
        fieldError = !value ? 'Пожалуйста, приложите документ в формате PDF' : '';
        break;
      case 'agreeToTerms':
        fieldError = !value ? 'Вы должны согласиться с обработкой персональных данных' : '';
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: fieldError }));
  };

  const validateForm = () => {
    let formIsValid = true;

    Object.keys(formData).forEach((fieldName) => {
      if (!formData[fieldName] || (fieldName === 'agreeToTerms' && !formData[fieldName])) {
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: `Поле обязательно для заполнения` }));
        formIsValid = false;
      }
    });

    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const { statementOfAccreditive, document, ...rest } = formData;
        const formDataToSend = { ...rest };
  
        if (statementOfAccreditive) {
          const statementBase64 = await fileToBase64(statementOfAccreditive);
          formDataToSend.statementOfAccreditive = statementBase64;
        }
  
        if (document) {
          const documentBase64 = await fileToBase64(document);
          formDataToSend.document = documentBase64;
        }
  
        const { data } = await submitApplication({ variables: { formData: formDataToSend } });
        console.log('Application submitted:', data.submitApplication);
        navigate('/confirmation');
      } catch (error) {
        console.error('Error submitting application:', error);
      }
    }
  };
  
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 mt-5">Заполните заявку на аккредитив</h2>
          <form onSubmit={handleSubmit} className="accreditive-form" noValidate>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Фамилия:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                required
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Имя:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                required
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="middleName" className="form-label">Отчество:</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className={`form-control ${errors.middleName ? 'is-invalid' : ''}`}
                required
              />
              {errors.middleName && <div className="invalid-feedback">{errors.middleName}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label">Дата рождения:</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                required
              />
              {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Номер телефона:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                required
              />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="passportSeries" className="form-label">Серия паспорта:</label>
              <input
                type="text"
                id="passportSeries"
                name="passportSeries"
                value={formData.passportSeries}
                onChange={handleChange}
                className={`form-control ${errors.passportSeries ? 'is-invalid' : ''}`}
                required
              />
              {errors.passportSeries && <div className="invalid-feedback">{errors.passportSeries}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="passportNumber" className="form-label">Номер паспорта:</label>
              <input
                type="text"
                id="passportNumber"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                className={`form-control ${errors.passportNumber ? 'is-invalid' : ''}`}
                required
              />
              {errors.passportNumber && <div className="invalid-feedback">{errors.passportNumber}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="statementOfAccreditive" className="form-label">Заявление на открытие аккредитива:</label>
              <div>
                <input
                  type="file"
                  id="statementOfAccreditive"
                  name="statementOfAccreditive"
                  onChange={handleChange}
                  className={`form-control ${errors.statementOfAccreditive ? 'is-invalid' : ''}`}
                  required
                />
                {errors.statementOfAccreditive && <div className="invalid-feedback">{errors.statementOfAccreditive}</div>}
                {!formData.statementOfAccreditive && <div className="text-muted">Пожалуйста, прикрепите заявление на открытие аккредитива</div>}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="document" className="form-label">Документ основания:</label>
              <div>
                <input
                  type="file"
                  id="document"
                  name="document"
                  onChange={handleChange}
                  className={`form-control ${errors.document ? 'is-invalid' : ''}`}
                  required
                />
                {errors.document && <div className="invalid-feedback">{errors.document}</div>}
                {!formData.document && <div className="text-muted">Пожалуйста, приложите документ в формате PDF</div>}
              </div>
            </div>
            <div className="mb-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                required
              />
              <label htmlFor="agreeToTerms" className="form-check-label">
                &nbsp;Я согласен с обработкой моих персональных данных
              </label>
              {errors.agreeToTerms && <div className="invalid-feedback">{errors.agreeToTerms}</div>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Отправка...' : 'Отправить заявку'}
        </button>
      </form>
      {error && <p className="text-danger">Ошибка при отправке заявки: {error.message}</p>}
    </div>
      </div>
    </div>
  );
};

export default AccreditiveForm;