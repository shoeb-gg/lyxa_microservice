import { prop } from '@typegoose/typegoose';

export class User {
  @prop({ required: true })
  name: string;

  @prop({ unique: true, required: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop()
  age?: number;
}
