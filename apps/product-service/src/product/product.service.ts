import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './models/product.model';
import { Model } from 'mongoose';
import { ProductEntity } from './entities/product.entity';
import { FindManyResponseDto, ResponseDto } from 'libs/common/dto/response.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(getModelToken(Product.name))
    private readonly productModel: Model<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    user_id: string,
  ): Promise<ResponseDto<ProductEntity>> {
    try {
      const product: ProductEntity = await new this.productModel({
        ...createProductDto,
        user_id,
      }).save();

      return {
        data: product,
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

  async findAll(
    pageNumber: number,
    pageSize: number,
  ): Promise<FindManyResponseDto<ProductEntity[]>> {
    try {
      const skip = (pageNumber - 1) * pageSize;

      const [products, total] = await Promise.all([
        await this.productModel.find().skip(skip).limit(pageSize).lean().exec(),
        this.productModel.countDocuments(),
      ]);

      return {
        data: products,
        total: total,
        pagination: {
          currentPage: pageNumber,
          pageSize: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },

        success: true,
        message: 'Products Fetched Successfully!',
        status: products.length === 0 ? HttpStatus.NO_CONTENT : HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while creating Product!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<ResponseDto<ProductEntity | null>> {
    try {
      const product: ProductEntity | null = await this.productModel
        .findOne({ _id: id })
        .lean()
        .exec();

      return {
        data: product ? product : null,
        success: product ? true : false,
        message: product
          ? 'Product Fetched Successfully!'
          : `No Product Found with id ${id}`,
        status: product ? HttpStatus.OK : HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while fetching Product!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user_id: string,
  ): Promise<ResponseDto<ProductEntity | null>> {
    try {
      const product: ProductEntity | null = await this.productModel
        .findOne({ _id: id })
        .lean()
        .exec();

      if (!product) {
        return {
          data: null,
          success: false,
          message: `No Product Found with id ${id}`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      if (product.user_id.toString() !== user_id.toString()) {
        return {
          data: null,
          success: false,
          message: 'You are not allowed to update this product',
          status: HttpStatus.METHOD_NOT_ALLOWED,
        };
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(
          id,
          { $set: updateProductDto },
          { new: true, runValidators: true },
        )
        .exec();

      return {
        data: updatedProduct ? updatedProduct : null,
        success: updatedProduct ? true : false,
        message: updatedProduct
          ? 'Product updated Successfully!'
          : `No Product Found with id ${id}`,
        status: updatedProduct ? HttpStatus.OK : HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while updating Product!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, user_id: string): Promise<ResponseDto<null>> {
    try {
      const product: ProductEntity | null = await this.productModel
        .findOne({ _id: id })
        .lean()
        .exec();

      if (!product) {
        return {
          data: null,
          success: false,
          message: `No Product Found with id ${id}`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      if (product.user_id.toString() !== user_id.toString()) {
        return {
          data: null,
          success: false,
          message: 'You are not allowed to delete this product',
          status: HttpStatus.METHOD_NOT_ALLOWED,
        };
      }

      const deletedProduct: ProductEntity | null = await this.productModel
        .findByIdAndDelete(id)
        .exec();

      return {
        data: null,
        success: deletedProduct ? true : false,
        message: deletedProduct
          ? 'Product deleted Successfully!'
          : `No Product Found with id ${id}`,
        status: deletedProduct ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while deleting Product!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
