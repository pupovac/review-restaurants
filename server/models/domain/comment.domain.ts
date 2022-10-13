import { mongoose, prop } from "@typegoose/typegoose";
import { UserClass } from "./";

export class CommentClass {
  @prop()
  public _id: mongoose.Types.ObjectId;
  @prop({ required: true })
  message!: string;
  @prop({ required: true })
  role!: string;
  @prop()
  createdAt: Date;
  updatedAt: Date;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  createdBy: mongoose.Types.ObjectId | UserClass;
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "UserClass" })
  updatedBy: mongoose.Types.ObjectId | UserClass;
}
