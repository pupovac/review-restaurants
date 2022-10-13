import { prop } from "@typegoose/typegoose";

export class UserSubset {
  @prop()
  id: string;
  @prop()
  fullName: string;
}
