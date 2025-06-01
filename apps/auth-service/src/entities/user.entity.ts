import { ObjectId } from 'mongoose';

export type UserEntity = {
  _id?: string | ObjectId;
  name: string;
  email: string;
  password?: string;
  age?: number;
};
