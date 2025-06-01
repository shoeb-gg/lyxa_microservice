import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { FindManyResponseDto, ResponseDto } from 'libs/common/dto/response.dto';
import { UserID } from '@app/common/utils/user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UserID() userID: string,
  ): Promise<ResponseDto<ProductEntity>> {
    return await this.productService.create(createProductDto, userID);
  }

  @Get('all')
  async findAll(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<FindManyResponseDto<ProductEntity[]>> {
    return await this.productService.findAll(+pageNumber, +pageSize);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseDto<ProductEntity | null>> {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UserID() userID: string,
  ): Promise<ResponseDto<ProductEntity | null>> {
    return await this.productService.update(id, updateProductDto, userID);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @UserID() userID: string,
  ): Promise<ResponseDto<null>> {
    return await this.productService.remove(id, userID);
  }
}
