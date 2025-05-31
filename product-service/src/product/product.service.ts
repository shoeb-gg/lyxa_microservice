import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './models/product.model';
import { HydratedDocument, Model } from 'mongoose';
import { ProductEntity } from './entities/product.entity';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(getModelToken(Product.name))
    private readonly productModel: Model<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ResponseDto<ProductEntity>> {
    try {
      const user: HydratedDocument<ProductEntity> = await new this.productModel(
        {
          ...createProductDto,
        },
      ).save();

      return {
        data: user,
        success: true,
        message: 'Product Created Successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while creating Product!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
