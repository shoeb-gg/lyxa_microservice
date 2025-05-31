import { prop } from '@typegoose/typegoose';

export class Product {
  @prop({ unique: true, required: true })
  name: string;

  @prop({ required: true })
  count: number;

  @prop({ required: true })
  price: number;

  @prop()
  description?: string;
}
