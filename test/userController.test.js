const { User } = require('../models');
const { saveFullName, saveEmail, savePhone, savePassword } = require('../controllers/userController');
const sequelize = require('../models').sequelize;
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models');
jest.mock('sequelize');
jest.mock('../utils/logger');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

let mockSession;

beforeEach(() => {
  mockSession = { userData: {} };
});

test('saveFullName should save the full name of the user', async () => {
    const req = { body: { firstName: 'John', lastName: 'Doe' }, session: mockSession };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  
    User.create.mockResolvedValue({ id: 1 });
  
    await saveFullName(req, res);
  
    expect(User.create).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe' });
    expect(req.session.userData).toEqual({ id: 1, firstName: 'John', lastName: 'Doe' });
    expect(res.json).toHaveBeenCalledWith({ message: 'Firstname and Lastname saved', userId: 1 });
  });

  