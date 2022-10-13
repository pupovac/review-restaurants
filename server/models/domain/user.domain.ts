import mongoose from "mongoose";
import { prop, modelOptions, getModelForClass, Severity } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "users", timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class UserClass {
  @prop()
  public _id: mongoose.Types.ObjectId;
  @prop({ required: true })
  firstName!: string;
  @prop({ required: true })
  lastName!: string;
  @prop({ required: true })
  email!: string;
  @prop({ required: true })
  password!: string;
  @prop({ required: true })
  role!: string;
  @prop()
  createdAt: Date;
  @prop()
  updatedAt: Date;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  updatedBy: mongoose.Types.ObjectId | UserClass;
}

const User = getModelForClass(UserClass);
export default User;
