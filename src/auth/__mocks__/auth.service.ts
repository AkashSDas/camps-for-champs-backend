import { userStub } from "../test/stubs";

// The original AuthService is an object with multiple methods
export var AuthService = jest.fn().mockReturnValue({
  emailAndPasswordSignup: jest.fn().mockReturnValue({
    user: userStub(),
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzQGdtYWlsLmNvbSIsImlhdCI6MTY3MzI1MDEzNywiZXhwIjoxNjczMjUwNDM3fQ.u4ulNIxOfYKqjYFWUQzXoqWb0YCkKxRVxfPeHvDOI6k",
  }),
});
