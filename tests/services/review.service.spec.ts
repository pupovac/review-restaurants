import "reflect-metadata";
import chai, { expect } from "chai";
import Sinon from "sinon-chai";
import sinon from "sinon";
import { CommentDTO, RestaurantDTO, ReviewDTO } from "../../server/models";
import { IRestaurantRepository, IReviewRepository } from "../../server/interfaces";
import { ReviewService } from "../../server/services";
import { ReviewRepository } from "../../server/repository";

chai.use(Sinon);

//sinon general setup
describe("Review Service", () => {
  afterEach(() => sinon.restore);
  beforeEach(() => sinon.createSandbox());
});

//mock data
const mock_reviewDTO: ReviewDTO = {
  id: "mockReview1Id",
  rate: 5,
  date: new Date(),
  message: "Mock review message",
  comments: [],
  restaurant: "mockReviewId",
  createdBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
  updatedBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mock_reviewsDTO: ReviewDTO[] = [
  {
    id: "mockReview1Id",
    rate: 5,
    date: new Date(),
    message: "Mock review message",
    comments: [],
    restaurant: "mockReviewId",
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
    restaurant: "mockReviewId",
    createdBy: { fullName: "Mock Reviewer2", id: "mockReviewerId2" },
    updatedBy: { fullName: "Mock Reviewer2", id: "mockReviewerId2" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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

const mock_commentDTO: CommentDTO = {
  id: "mockComment",
  message: "Mock comment message",
  role: "user",
  createdBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
  updatedBy: { fullName: "Mock Reviewer1", id: "mockReviewerId1" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

//mock dependecies
const mock_IReviewRepo: Partial<IReviewRepository> = {
  async getReviews(filterParams: any): Promise<ReviewDTO[]> {
    return mock_reviewsDTO;
  },
  async getReview(reviewId: string): Promise<ReviewDTO> {
    return mock_reviewDTO;
  },
  async createReview(review: ReviewDTO): Promise<ReviewDTO> {
    return mock_reviewDTO;
  },
  async updateReview(review: ReviewDTO): Promise<ReviewDTO> {
    return mock_reviewDTO;
  },
  async deleteReview(reviewId: string): Promise<void> {
    return;
  },
  async createComment(reviewId: string, comment: CommentDTO): Promise<void> {
    return;
  },
  async updateComment(reviewId: string, comment: CommentDTO): Promise<void> {
    return;
  },
  async deleteComment(commentId: string): Promise<void> {
    return;
  },
  async getReviewRates(restaurantId: string): Promise<number[]> {
    return [3, 5];
  },
};

const mock_IRestaurantRepo: Partial<IRestaurantRepository> = {
  async getRestaurants(filterParams: any): Promise<RestaurantDTO[]> {
    return [mock_restaurantDTO];
  },
  async getRestaurant(restaurantId: string): Promise<RestaurantDTO> {
    return mock_restaurantDTO;
  },
  async updateRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO> {
    return mock_restaurantDTO;
  },
};

//service initialization
const reviewService = new ReviewService(<IReviewRepository>mock_IReviewRepo, <IRestaurantRepository>mock_IRestaurantRepo);

//tests
describe("getReviews", () => {
  it("Should return review array", async () => {
    const spyReviewRepoGetReviews = sinon.spy(mock_IReviewRepo, "getReviews");

    const result = await reviewService.getReviews({});

    expect(spyReviewRepoGetReviews.calledOnce, "ReviewRepo.getReviews").to.be.true;
    expect(result.length, "function output: array lenght 2").to.be.equal(2);
    expect(result[0].id, "function output: array[0].id").to.equal("mockReview1Id");
  });
});

describe("getReview", () => {
  let sandbox: any;
  let spyReviewRepoGetReview: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyReviewRepoGetReview = sandbox.spy(mock_IReviewRepo, "getReview");
  });
  afterEach(() => sandbox.restore());
  it("Should return review", async () => {
    const result = await reviewService.getReview("mockReview1Id");

    expect(spyReviewRepoGetReview.calledOnce, "ReviewRepo.getReview").to.be.true;
    expect(result.id, "function output: array[0].id").to.equal("mockReview1Id");
  });
});

describe("createReview", () => {
  let sandbox: any;
  let spyReviewServiceUpdateAverageRating: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyReviewServiceUpdateAverageRating = sandbox.spy(reviewService, "updateAverageRating");
  });
  afterEach(() => sandbox.restore());
  it("Should create review", async () => {
    const spyReviewRepoCreateReview = sinon.spy(mock_IReviewRepo, "createReview");

    const result = await reviewService.createReview(mock_reviewDTO);

    expect(spyReviewRepoCreateReview.calledOnce, "ReviewRepo.createReview").to.be.true;
    expect(spyReviewServiceUpdateAverageRating.calledOnce, "reviewService.updateAverageRating").to.be.true;

    expect(result.id, "function output: id").to.equal("mockReview1Id");
  });
});

describe("updateReview", () => {
  let sandbox: any;
  let spyReviewServiceUpdateAverageRating: any;
  beforeEach(function () {
    sandbox = sinon.createSandbox();
    spyReviewServiceUpdateAverageRating = sandbox.spy(reviewService, "updateAverageRating");
  });
  afterEach(() => sandbox.restore());
  it("Should update review", async () => {
    const spyReviewRepoUpdateReview = sinon.spy(mock_IReviewRepo, "updateReview");

    const result = await reviewService.updateReview(mock_reviewDTO);

    expect(spyReviewRepoUpdateReview.calledOnce, "ReviewRepo.updateReview").to.be.true;
    expect(spyReviewServiceUpdateAverageRating.calledOnce, "reviewService.updateAverageRating").to.be.true;

    expect(result.id, "function output: id").to.equal("mockReview1Id");
  });
});

describe("deleteReview", () => {
  let sandbox: any;
  let spyReviewRepoGetReview: any;
  let spyReviewServiceUpdateAverageRating: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyReviewRepoGetReview = sandbox.spy(mock_IReviewRepo, "getReview");
    spyReviewServiceUpdateAverageRating = sandbox.spy(reviewService, "updateAverageRating");
  });
  afterEach(() => sandbox.restore());
  it("Should delete review", async () => {
    const spyReviewRepoDeleteReview = sinon.spy(mock_IReviewRepo, "deleteReview");

    await reviewService.deleteReview("mockReviewId");

    expect(spyReviewRepoGetReview.calledOnce, "ReviewRepo.getReview").to.be.true;
    expect(spyReviewRepoDeleteReview.calledOnce, "ReviewRepo.deleteReview").to.be.true;
    expect(spyReviewServiceUpdateAverageRating.calledOnce, "reviewService.updateAverageRating").to.be.true;
  });
});

describe("createComment", () => {
  it("Should create comment", async () => {
    const spyReviewRepoCreateComment = sinon.spy(mock_IReviewRepo, "createComment");
    await reviewService.createComment("mockReviewId", mock_commentDTO);

    expect(spyReviewRepoCreateComment.calledOnce, "ReviewRepo.createComment").to.be.true;
  });
});

describe("updateComment", () => {
  it("Should update comment", async () => {
    const spyReviewRepoUpdateComment = sinon.spy(mock_IReviewRepo, "updateComment");
    await reviewService.updateComment("mockReviewId", mock_commentDTO);

    expect(spyReviewRepoUpdateComment.calledOnce, "ReviewRepo.updateComment").to.be.true;
  });
});

describe("deleteComment", () => {
  it("Should delete comment", async () => {
    const spyReviewRepoDeleteComment = sinon.spy(mock_IReviewRepo, "deleteComment");
    await reviewService.deleteComment("mockReviewId", "mockCommentId");

    expect(spyReviewRepoDeleteComment.calledOnce, "ReviewRepo.deleteComment").to.be.true;
  });
});

describe("updateAverageRating", () => {
  it("Should update average rating", async () => {
    const spyRestaurantRepoGetRestaurant = sinon.spy(mock_IRestaurantRepo, "getRestaurant");
    const spyReviewRepoGetReviewRates = sinon.spy(mock_IReviewRepo, "getReviewRates");
    const spyRestaurantRepoUpdateRestaurant = sinon.spy(mock_IRestaurantRepo, "updateRestaurant");
    const spyReviewServiceCalculateAverageRating = sinon.spy(reviewService, "calculateAverageRating");

    await reviewService.updateAverageRating("mockRestaurantId");

    expect(spyRestaurantRepoGetRestaurant.calledOnce, "RestaurantRepo.getRestaurant").to.be.true;
    expect(spyReviewRepoGetReviewRates.calledOnce, "ReviewRepo.getReviewRates").to.be.true;
    expect(spyRestaurantRepoUpdateRestaurant.calledOnce, "RestaurantRepo.updateRestaurant").to.be.true;
    expect(spyReviewServiceCalculateAverageRating.calledOnce, "reviewService.calculateAverageRating").to.be.true;
  });
});

describe("calculateAverageRating", () => {
  it("Should calculate average rating when existing ratings", async () => {
    const rating = reviewService.calculateAverageRating([4, 5]);
    expect(rating, "function output: 4.5").to.be.equal(4.5);
  });
  it("Should calculate average rating when no ratings", async () => {
    const rating = reviewService.calculateAverageRating([]);
    expect(rating, "function output: 0").to.be.equal(0);
  });
});
