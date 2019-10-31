//tests for getUserByEmail

const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');
const { users } = require('../data.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe("Testing getUserByEmail", () => {
  const user = getUserByEmail("user@example.com", users);
  const expectedOutput = "userRandomID";
  
  it('should return a valid user object', () => {
    const expectedUser = testUsers["userRandomID"];
    assert.deepEqual(user, expectedUser);
  });

  it('should return undefined with invalid email', () => {
    const nonUser = getUserByEmail("notAUser@example.com", users);
    assert.equal(nonUser, undefined);
  });

  it("should return a user with valid email", () => {
    assert.equal(user.id, expectedOutput);
  })
});