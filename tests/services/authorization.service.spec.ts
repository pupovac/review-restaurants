import "reflect-metadata";
import chai, { expect } from "chai";
import Sinon from "sinon-chai";
import sinon from "sinon";
import { AuthDTO, FullUserDTO, LoginDTO } from "../../server/models";
import { IUserRepository } from "../../server/interfaces";
import { AuthorizationService } from "../../server/services";
import { ROLES } from "../../config/constants/enum.contants";

chai.use(Sinon);

//sinon general setup
describe("Authorization Service", () => {
  afterEach(() => sinon.restore);
});

//mock data
const mock_authDTO: AuthDTO = {
  firstName: "Mock",
  lastName: "User",
  email: "mock@email.com",
  password: "$2a$10$lzwMy2aM7hBOVcL9D6hDo.UCKYxzk/Yvfqenwdx52L6YwsV34Uuua",
  role: ROLES.regular.toString(),
};

const mock_fullUserDTO: FullUserDTO = {
  id: "mockUserId2",
  firstName: "Mock2",
  lastName: "User2",
  email: "mock2@email.com",
  password: "$2a$10$lzwMy2aM7hBOVcL9D6hDo.UCKYxzk/Yvfqenwdx52L6YwsV34Uuua",
  role: ROLES.regular.toString(),
  accessToken: "mockAccessToken",
  updatedBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mock_loginDTO: LoginDTO = {
  email: "mock2@email.com",
  password: "111111",
};

//mock dependecies
const mock_IUserRepo: Partial<IUserRepository> = {
  async findUser(email: string): Promise<FullUserDTO | null> {
    if (email === "mock2@email.com") return mock_fullUserDTO;
    return null;
  },
  async createUser(authInfo: AuthDTO): Promise<void> {
    return;
  },
};

//service initialization
const authService = new AuthorizationService(<IUserRepository>mock_IUserRepo);

//tests
describe("signup", () => {
  let sandbox: any;
  let spyUserRepoFindUser: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyUserRepoFindUser = sandbox.spy(mock_IUserRepo, "findUser");
  });
  afterEach(() => sandbox.restore());
  it("Should register new user", async () => {
    const spyUserRepoCreateUser = sinon.spy(mock_IUserRepo, "createUser");

    const result = await authService.signup(mock_authDTO);

    expect(spyUserRepoFindUser.calledOnce, "UserRepo.findUser").to.be.true;
    expect(spyUserRepoCreateUser.calledOnce, "UserRepo.createUser").to.be.true;
  });
});

describe("login", () => {
  let sandbox: any;
  let spyUserRepoFindUser: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyUserRepoFindUser = sandbox.spy(mock_IUserRepo, "findUser");
  });
  afterEach(() => sandbox.restore());
  it("Should login", async () => {
    const result = await authService.login(mock_loginDTO);

    expect(spyUserRepoFindUser.calledOnce, "UserRepo.findUser").to.be.true;
    expect(result.id, "function output: array[0].id").to.equal("mockUserId2");
  });
});
