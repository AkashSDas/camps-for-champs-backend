import { accessTokenStub, refreshTokenStub, userStub } from "../test/stubs";

// The original AuthService is an object with multiple methods
export var AuthService = jest.fn().mockReturnValue({
  emailAndPasswordSignup: jest.fn().mockReturnValue({
    user: userStub(),
    accessToken: accessTokenStub(),
    refreshToken: refreshTokenStub(),
    error: null,
  }),
});
