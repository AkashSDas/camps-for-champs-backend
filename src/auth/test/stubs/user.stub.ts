import { User } from "src/user/schema";

import { UserRole } from "../../../utils/user";

type UserStub = Partial<User> & {
  createdAt: Date;
  updatedAt: Date;
};

export function userStub(): UserStub {
  return {
    email: "james@gmail.com",
    active: false,
    banned: false,
    verified: false,
    roles: [UserRole.BASE],
    _id: "63bbc5597413cc38dacdaf59",
    oauthProviders: [],
    userId: "acc_XLL2Wp8C0k0eZWpY",
    createdAt: new Date("2023-01-09T07:42:17.784Z"),
    updatedAt: new Date("2023-01-09T07:42:17.784Z"),
    __v: 0,
  };
}
