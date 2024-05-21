// server.js
const { ApolloServer, gql } = require('apollo-server');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/accreditive', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Создание схемы и модели данных для заявки
const applicationSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  middleName: String,
  birthDate: String,
  phoneNumber: String,
  email: String,
  passportSeries: String,
  passportNumber: String,
  statementOfAccreditive: String,
  document: String,
  agreeToTerms: Boolean,
  status: String,
});

const Application = mongoose.model('Application', applicationSchema);

const typeDefs = gql`
  type Application {
    id: ID!
    status: String!
    lastName: String!
    firstName: String!
    middleName: String!
    birthDate: String!
    phoneNumber: String!
    email: String!
    passportSeries: String!
    passportNumber: String!
    statementOfAccreditive: String
    document: String
    agreeToTerms: Boolean!
  }

  input ApplicationInput {
    lastName: String!
    firstName: String!
    middleName: String!
    birthDate: String!
    phoneNumber: String!
    email: String!
    passportSeries: String!
    passportNumber: String!
    statementOfAccreditive: String
    document: String
    agreeToTerms: Boolean!
  }

  type Query {
    applications: [Application!]!
  }

  type Mutation {
    submitApplication(formData: ApplicationInput!): Application!
    updateApplicationStatus(id: ID!, status: String!): Application!
  }
`;

const resolvers = {
  Query: {
    applications: async () => {
      const applications = await Application.find();
      return applications;
    },
  },
  Mutation: {
    submitApplication: async (_, { formData }) => {
      const { statementOfAccreditive, document, ...rest } = formData;
      const applicationId = Date.now().toString();
      const newApplication = new Application({
        ...rest,
        status: 'pending',
        statementOfAccreditive: statementOfAccreditive ? `/statements/${applicationId}.pdf` : null,
        document: document ? `/documents/${applicationId}.pdf` : null,
      });

      // Сохранение документов на сервере
      if (statementOfAccreditive) {
        const statementPath = path.join(__dirname, 'statements', `${applicationId}.pdf`);
        const statementBuffer = Buffer.from(statementOfAccreditive, 'base64');
        fs.writeFileSync(statementPath, statementBuffer);
      }
      if (document) {
        const documentPath = path.join(__dirname, 'documents', `${applicationId}.pdf`);
        const documentBuffer = Buffer.from(document, 'base64');
        fs.writeFileSync(documentPath, documentBuffer);
      }

      await newApplication.save();
      return newApplication;
    },
    updateApplicationStatus: async (_, { id, status }) => {
      const application = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return application;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// Создание папок для хранения документов
const statementsDir = path.join(__dirname, 'statements');
const documentsDir = path.join(__dirname, 'documents');
if (!fs.existsSync(statementsDir)) {
  fs.mkdirSync(statementsDir);
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir);
}

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});