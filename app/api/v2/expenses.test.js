/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const app     = require('./app');

const testUser = {
  '_id' : '629725a5c1345475f676cfef',
  'email': 'rpi@unitn.it'
}

describe('GET /api/v2/users/:id/expenses', () => {

  // Moking User.findById method
  let userSpyFindById;

  beforeAll( () => {
    const User = require('../../models/user');

    userSpyFindById = jest.spyOn(Book, 'findById').mockImplementation((id) => {
      if (id==testUser._id)
        return {
          id: testUser._id,
          email: testUser.email
        };
      else
        return {};
    });
  });

  afterAll(async () => {
    userSpyFindById.mockRestore();
  });
  /*
  test('GET /api/v2/users/:id/expenses/:id should respond with an array of expenses', async () => {
    return request(app)
      .get('/api/v2/expenses')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            success: 'true'
          });
        }
      });
  });
*/
  
  test('GET /api/v2/users/:id/expenses/:id should respond with json', async () => {
    return request(app)
      .get('/api/v2/users/:id/expenses/:id')
      .expect('Content-Type', /json/)
      .expect(200, {
          self: '/api/v1/books/1010',
          title: 'Software Engineering 2'
        });
  });

});
