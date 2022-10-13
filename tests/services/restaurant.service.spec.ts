import "reflect-metadata";
import chai, { expect } from "chai";
import Sinon from "sinon-chai";
import sinon from "sinon";
import { RestaurantDTO, ReviewDTO } from "../../server/models";
import { IRestaurantRepository, IReviewRepository } from "../../server/interfaces";
import { RestaurantService } from "../../server/services";

chai.use(Sinon);

//sinon general setup
describe("Restaurant Service", () => {
  afterEach(() => sinon.restore);
});

//mock data
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

const mock_reviewsDTO: ReviewDTO[] = [
  {
    id: "mockReview1Id",
    rate: 5,
    date: new Date(),
    message: "Mock review message",
    comments: [],
    restaurant: "mockRestaurantId",
    createdBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
    updatedBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mockReview2Id",
    rate: 3,
    date: new Date(),
    message: "Mock review message",
    comments: [],
    restaurant: "mockRestaurantId",
    createdBy: { fullName: "Mock Reviewer2", id: "mockReviewerId2" },
    updatedBy: { fullName: "Mock Reviewer2", id: "mockReviewerId2" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

//mock dependecies
const mock_IRestaurantRepo: Partial<IRestaurantRepository> = {
  async getRestaurants(filterParams: any): Promise<RestaurantDTO[]> {
    return [mock_restaurantDTO];
  },
  async getRestaurant(restaurantId: string): Promise<RestaurantDTO> {
    return mock_restaurantDTO;
  },
  async findRestaurant(name: string): Promise<RestaurantDTO | null> {
    if (name === "mockRestaurantName2") {
      let mock_restaurantDTO2 = Object.assign({}, mock_restaurantDTO);
      mock_restaurantDTO2.id = "mockRestaurantId2";
      mock_restaurantDTO2.name = "mockRestaurantName2";
      return mock_restaurantDTO2;
    }
    return null;
  },
  async createRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO> {
    return mock_restaurantDTO;
  },
  async updateRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO> {
    return mock_restaurantDTO;
  },
  async deleteRestaurant(restaurantId: string): Promise<void> {
    return;
  },
};

const mock_IReviewRepo: Partial<IReviewRepository> = {
  async getHighestAndLowestReview(restaurantId: string): Promise<ReviewDTO[]> {
    return mock_reviewsDTO;
  },
  async deleteReviews(restaurantId: string): Promise<void> {
    return;
  },
};

//service initialization
const restaurantService = new RestaurantService(<IRestaurantRepository>mock_IRestaurantRepo, <IReviewRepository>mock_IReviewRepo);

//tests
describe("getRestaurants", () => {
  it("Should return restaurant array", async () => {
    const spyRestaurantRepoGetRestaurants = sinon.spy(mock_IRestaurantRepo, "getRestaurants");

    const result = await restaurantService.getRestaurants({});

    expect(spyRestaurantRepoGetRestaurants.calledOnce, "RestaurantRepo.getRestaurants").to.be.true;
    expect(result.length, "function output: array lenght 1").to.be.equal(1);
    expect(result[0].id, "function output: array[0].id").to.equal("mockRestaurantId");
  });
});

describe("getRestaurant", () => {
  it("Should return restaurant", async () => {
    const spyRestaurantRepoGetRestaurant = sinon.spy(mock_IRestaurantRepo, "getRestaurant");

    const result = await restaurantService.getRestaurant("mockRestaurantId");

    expect(spyRestaurantRepoGetRestaurant.calledOnce, "RestaurantRepo.getRestaurant").to.be.true;
    expect(result.id, "function output: id").to.equal("mockRestaurantId");
  });
});

describe("createRestaurant", () => {
  let sandbox: any;
  let spyRestaurantRepoFindRestaurant: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyRestaurantRepoFindRestaurant = sandbox.spy(mock_IRestaurantRepo, "findRestaurant");
  });
  afterEach(() => sandbox.restore());
  it("Should create restaurant", async () => {
    const spyRestaurantRepoCreateRestaurant = sinon.spy(mock_IRestaurantRepo, "createRestaurant");

    const result = await restaurantService.createRestaurant(mock_restaurantDTO);

    expect(spyRestaurantRepoFindRestaurant.calledOnce, "RestaurantRepo.findRestaurant").to.be.true;
    expect(spyRestaurantRepoCreateRestaurant.calledOnce, "RestaurantRepo.createRestaurant").to.be.true;

    expect(result.id, "function output: id").to.equal("mockRestaurantId");
  });
});

describe("updateRestaurant", () => {
  let sandbox: any;
  let spyRestaurantRepoFindRestaurant: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyRestaurantRepoFindRestaurant = sandbox.spy(mock_IRestaurantRepo, "findRestaurant");
  });
  afterEach(() => sandbox.restore());
  it("Should update restaurant", async () => {
    const spyRestaurantRepoUpdateRestaurant = sinon.spy(mock_IRestaurantRepo, "updateRestaurant");

    const result = await restaurantService.updateRestaurant(mock_restaurantDTO);

    expect(spyRestaurantRepoFindRestaurant.calledOnce, "RestaurantRepo.findRestaurant").to.be.true;
    expect(spyRestaurantRepoUpdateRestaurant.calledOnce, "RestaurantRepo.updateRestaurant").to.be.true;

    expect(result.id, "function output: id").to.equal("mockRestaurantId");
  });
});

describe("deleteRestaurant", () => {
  it("Should delete restaurant", async () => {
    const spyReviewRepoDeleteReviews = sinon.spy(mock_IReviewRepo, "deleteReviews");
    const spyRestaurantRepoDeleteRestaurant = sinon.spy(mock_IRestaurantRepo, "deleteRestaurant");

    await restaurantService.deleteRestaurant("mockRestaurantId");

    expect(spyReviewRepoDeleteReviews.calledOnce, "RestaurantRepo.deleteReviews").to.be.true;
    expect(spyRestaurantRepoDeleteRestaurant.calledOnce, "RestaurantRepo.deleteRestaurant").to.be.true;
  });
});
