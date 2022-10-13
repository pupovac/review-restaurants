import "reflect-metadata";
import chai, { expect } from "chai";
import Sinon from "sinon-chai";
import sinon from "sinon";
import { RestaurantDTO, UserDTO, FullUserDTO } from "../../server/models";
import { IRestaurantRepository, IUserRepository } from "../../server/interfaces";
import { UserService } from "../../server/services";
import { ROLES } from "../../config/constants/enum.contants";

chai.use(Sinon);

//sinon general setup
describe("User Service", () => {
  afterEach(() => sinon.restore);
});

//mock data
const mock_userDTO: UserDTO = {
  id: "mockUserId",
  firstName: "Mock",
  lastName: "User",
  email: "mock@email.com",
  role: ROLES.regular.toString(),
  accessToken: "mockAccessToken",
  updatedBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mock_fullUserDTO: FullUserDTO = {
  id: "mockUserId",
  firstName: "Mock",
  lastName: "User",
  email: "mock@email.com",
  password: "$2a$10$lzwMy2aM7hBOVcL9D6hDo.UCKYxzk/Yvfqenwdx52L6YwsV34Uuua",
  role: ROLES.regular.toString(),
  accessToken: "mockAccessToken",
  updatedBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mock_restaurantDTO: RestaurantDTO = {
  id: "mockRestaurantId",
  name: "mockRestaurantName",
  address: "mockAddress",
  phone: "mockPhone",
  owner: {
    id: "mockOwnerId",
    fullName: "mockFullName",
  },
  averageRating: 4.5,
  createdBy: {
    id: "mockOwnerId",
    fullName: "mockFullName",
  },
  updatedBy: {
    id: "mockOwnerId",
    fullName: "mockFullName",
  },
};

//mock dependecies
const mock_IUserRepo: Partial<IUserRepository> = {
  async getUsers(filterParams: any): Promise<UserDTO[]> {
    return [mock_userDTO];
  },
  async getUser(userId: string): Promise<UserDTO> {
    return mock_userDTO;
  },
  async findUser(email: string): Promise<FullUserDTO | null> {
    return mock_fullUserDTO;
  },
  async updateUser(user: UserDTO): Promise<UserDTO> {
    return mock_userDTO;
  },

  async deleteUser(userId: string): Promise<void> {
    return;
  },
};

const mock_IRestaurantRepo: Partial<IRestaurantRepository> = {
  async getRestaurants(filterParams: any): Promise<RestaurantDTO[]> {
    return [mock_restaurantDTO];
  },
};

//service initialization
const userService = new UserService(<IUserRepository>mock_IUserRepo, <IRestaurantRepository>mock_IRestaurantRepo);

//tests
describe("getUsers", () => {
  it("Should return user array", async () => {
    const spyUserRepoGetUsers = sinon.spy(mock_IUserRepo, "getUsers");

    const result = await userService.getUsers({});

    expect(spyUserRepoGetUsers.calledOnce, "UserRepo.getUsers").to.be.true;
    expect(result.length, "function output: array lenght 1").to.be.equal(1);
    expect(result[0].id, "function output: array[0].id").to.equal("mockUserId");
  });
});

describe("updateUser", () => {
  it("Should update user", async () => {
    const spyUserRepoUpdateUser = sinon.spy(mock_IUserRepo, "updateUser");
    const spyUserRepoFindUser = sinon.spy(mock_IUserRepo, "findUser");
    const spyRestaurantRepoGetRestaurants = sinon.spy(mock_IRestaurantRepo, "getRestaurants");

    const result = await userService.updateUser(mock_userDTO);

    expect(spyUserRepoUpdateUser.calledOnce, "UserRepo.updateUser").to.be.true;
    expect(spyUserRepoFindUser.calledOnce, "UserRepo.findUser").to.be.true;
    expect(spyRestaurantRepoGetRestaurants.calledOnce, "RestaurantRepo.getRestaurants").to.be.true;

    expect(result.id, "function output: id").to.equal("mockUserId");
  });
});

describe("deleteUser", () => {
  it("Should delete user", async () => {
    const spyUserRepoDeleteUser = sinon.spy(mock_IUserRepo, "deleteUser");

    await userService.deleteUser("mockUserId");

    expect(spyUserRepoDeleteUser.calledOnce, "UserRepo.deleteUser").to.be.true;
  });
});
