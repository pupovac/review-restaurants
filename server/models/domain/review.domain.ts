import mongoose from "mongoose";
import { prop, modelOptions, getModelForClass, Severity } from "@typegoose/typegoose";
import { CommentClass, RestaurantClass, UserClass } from "./";

@modelOptions({ schemaOptions: { collection: "reviews", timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class ReviewClass {
  @prop()
  public _id: mongoose.Types.ObjectId;
  @prop({ required: true })
  rate!: number;
  @prop({ required: true })
  date!: Date;
  @prop({ required: true })
  message!: string;
  @prop({ type: CommentClass })
  comments: CommentClass[];
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "RestaurantClass" })
  restaurant!: mongoose.Types.ObjectId | RestaurantClass;
  @prop()
  createdAt: Date;
  @prop()
  updatedAt: Date;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  createdBy: mongoose.Types.ObjectId | UserClass;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  updatedBy: mongoose.Types.ObjectId | UserClass;
}

const Review = getModelForClass(ReviewClass);
export default Review;
