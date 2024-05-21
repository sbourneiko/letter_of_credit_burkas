// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import LandingPage from './components/LandingPage';
import AccreditiveForm from './components/AccreditiveForm';
import ConfirmationPage from './components/ConfirmationPage';
import ManagerPage from './components/ManagerPage';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/accreditive-form" element={<AccreditiveForm />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/manager" element={<ManagerPage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;