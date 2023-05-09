// TODO;
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

describe('User model test', () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('create & save user successfully', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword'
    });
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('John Doe');
    expect(savedUser.email).toBe('johndoe@example.com');
    expect(savedUser.password).toBeDefined();
  });

  it('should require name field', async () => {
    const user = new User({
      email: 'johndoe@example.com',
      password: 'mypassword'
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('should require email field', async () => {
    const user = new User({
      name: 'John Doe',
      password: 'mypassword'
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it('should require password field', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'johndoe@example.com'
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });

  it('should require unique email field', async () => {
    const user1 = new User({
      name: 'John Doe II',
      email: 'johndoe2@example.com',
      password: 'mypassword'
    });
    await user1.save();

    const user2 = new User({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'mypassword'
    });
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});
