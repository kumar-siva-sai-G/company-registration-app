
const pool = require('../config/db');
const {
  findUserByMobileNumber,
  getUserByEmail,
  getUserById,
  createUser,
  getCompanyProfileByOwnerId,
  updateCompanyProfile,
  createCompanyProfile,
} = require('./dbService');

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('dbService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByMobileNumber', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, mobile_no: '1234567890' };
      pool.query.mockResolvedValue([[mockUser]]);
      const user = await findUserByMobileNumber('1234567890');
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE mobile_no = ?', ['1234567890']);
      expect(user).toEqual(mockUser);
    });

    it('should return undefined when not found', async () => {
      pool.query.mockResolvedValue([[]]);
      const user = await findUserByMobileNumber('1234567890');
      expect(user).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      pool.query.mockResolvedValue([[mockUser]]);
      const user = await getUserByEmail('test@example.com');
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['test@example.com']);
      expect(user).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      pool.query.mockResolvedValue([[mockUser]]);
      const user = await getUserById(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [1]);
      expect(user).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should return the insertId after creating a user', async () => {
      const userData = { name: 'Test User', email: 'test@example.com' };
      pool.query.mockResolvedValue([{ insertId: 1 }]);
      const userId = await createUser(userData);
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO users (name, email) VALUES (?, ?)', ['Test User', 'test@example.com']);
      expect(userId).toBe(1);
    });
  });

  describe('getCompanyProfileByOwnerId', () => {
    it('should return a company profile when found', async () => {
      const mockProfile = { id: 1, company_name: 'Test Inc.', owner_id: 1 };
      pool.query.mockResolvedValue([[mockProfile]]);
      const profile = await getCompanyProfileByOwnerId(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM companyProfile WHERE owner_id = ?', [1]);
      expect(profile).toEqual(mockProfile);
    });
  });

  describe('updateCompanyProfile', () => {
    it('should correctly call pool.query with updated fields', async () => {
      const updates = { company_name: 'New Name', city: 'New City' };
      pool.query.mockResolvedValue();
      await updateCompanyProfile(1, updates);
      expect(pool.query).toHaveBeenCalledWith('UPDATE companyProfile SET company_name = ?, city = ? WHERE owner_id = ?', ['New Name', 'New City', 1]);
    });

    it('should not call pool.query if no valid fields are provided', async () => {
      const updates = { invalid_field: 'some value' };
      await updateCompanyProfile(1, updates);
      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe('createCompanyProfile', () => {
    it('should return the insertId after creating a profile', async () => {
      const profileData = { company_name: 'Test Inc.', owner_id: 1 };
      pool.query.mockResolvedValue([{ insertId: 1 }]);
      const profileId = await createCompanyProfile(profileData);
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO companyProfile (company_name, owner_id) VALUES (?, ?)', ['Test Inc.', 1]);
      expect(profileId).toBe(1);
    });
  });
});
