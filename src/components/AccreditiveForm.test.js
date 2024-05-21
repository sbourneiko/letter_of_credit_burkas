import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AccreditiveForm from './AccreditiveForm';
import { BrowserRouter as Router } from 'react-router-dom';

describe('AccreditiveForm', () => {
  test('renders the form correctly', () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <AccreditiveForm />
      </Router>
    );

    expect(getByLabelText('Фамилия:')).toBeInTheDocument();
    expect(getByLabelText('Имя:')).toBeInTheDocument();
    expect(getByLabelText('Отчество:')).toBeInTheDocument();
    expect(getByLabelText('Дата рождения:')).toBeInTheDocument();
    expect(getByLabelText('Номер телефона:')).toBeInTheDocument();
    expect(getByLabelText('Email:')).toBeInTheDocument();
    expect(getByLabelText('Серия паспорта:')).toBeInTheDocument();
    expect(getByLabelText('Номер паспорта:')).toBeInTheDocument();
    expect(getByLabelText('Документ основания:')).toBeInTheDocument();
    expect(getByText('Отправить заявку')).toBeInTheDocument();
  });

  test('validates form fields correctly', async () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <AccreditiveForm />
      </Router>
    );

    // Проверка фамилии
    fireEvent.change(getByLabelText('Фамилия:'), { target: { value: '123' } });
    fireEvent.submit(getByText('Отправить заявку'));
    await waitFor(() => expect(getByText('Некорректно. Фамилия должна содержать буквы кириллицы!')).toBeInTheDocument());

    // Test invalid birthDate
    fireEvent.change(getByLabelText('Дата рождения:'), { target: { value: '2030-01-01' } });
    fireEvent.submit(getByText('Отправить заявку'));
    await waitFor(() => expect(getByText('Вы не достигли совершеннолетия для открытия аккредитива!')).toBeInTheDocument());

    // Test invalid phoneNumber
    fireEvent.change(getByLabelText('Номер телефона:'), { target: { value: '+71234' } });
    fireEvent.submit(getByText('Отправить заявку'));
    await waitFor(() => expect(getByText('Некорректный номер телефона (начинается с +7)!')).toBeInTheDocument());

    // Test invalid email
    fireEvent.change(getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.submit(getByText('Отправить заявку'));
    await waitFor(() => expect(getByText('Некорректный email. Успользуйте домены @mail.ru, @gmail.com, @yandex.ru!')).toBeInTheDocument());

    // Test invalid passport series
    fireEvent.change(getByLabelText('Серия паспорта:'), { target: { value: '123' } });
    fireEvent.submit(getByText('Отправить заявку'));
    await waitFor(() => expect(getByText('Некорректно. Серия паспорта состоит из 4 чисел!')).toBeInTheDocument());

    // Проверить номер паспорта
    fireEvent.change(getByLabelText('Номер паспорта:'), { target: { value: '12345' } });
    fireEvent.submit(getByText('Отправить заявку'));
    await waitFor(() => expect(getByText('Некорректно. Номер паспорта состоит из 6 чисел!')).toBeInTheDocument());

    // Проверка корректной отправки формы
    fireEvent.change(getByLabelText('Фамилия:'), { target: { value: 'Иванов' } });
    fireEvent.change(getByLabelText('Имя:'), { target: { value: 'Иван' } });
    fireEvent.change(getByLabelText('Отчество:'), { target: { value: 'Иванович' } });
    fireEvent.change(getByLabelText('Дата рождения:'), { target: { value: '1990-01-01' } });
    fireEvent.change(getByLabelText('Номер телефона:'), { target: { value: '+71234567890' } });
    fireEvent.change(getByLabelText('Email:'), { target: { value: 'test@mail.ru' } });
    fireEvent.change(getByLabelText('Серия паспорта:'), { target: { value: '1234' } });
    fireEvent.change(getByLabelText('Номер паспорта:'), { target: { value: '123456' } });
    fireEvent.change(getByLabelText('Документ основания:'), { target: { files: [new File([], 'document.pdf')] } });
    fireEvent.submit(getByText('Отправить заявку'));
    await waitFor(() => expect(global.console.log).toHaveBeenCalledWith('Данные формы:', expect.anything()));
  });
});