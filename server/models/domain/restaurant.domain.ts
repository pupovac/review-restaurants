import mongoose from "mongoose";
import { prop, modelOptions, getModelForClass, Severity } from "@typegoose/typegoose";
import { UserClass } from "./";

@modelOptions({ schemaOptions: { collection: "restaurants", timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class RestaurantClass {
  @prop()
  public _id: mongoose.Types.ObjectId;
  @prop({ required: true, unique: true })
  name!: string;
  @prop()
  address: string;
  @prop()
  phone: string;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  owner!: mongoose.Types.ObjectId | UserClass;
  @prop({ default: 0 })
  averageRating: number;
  @prop()
  createdAt: Date;
  @prop()
  updatedAt: Date;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  createdBy: mongoose.Types.ObjectId | UserClass;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  updatedBy: mongoose.Types.ObjectId | UserClass;
}

const Restaurant = getModelForClass(RestaurantClass);
export default Restaurant;
