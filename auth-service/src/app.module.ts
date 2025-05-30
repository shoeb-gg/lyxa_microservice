import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(
      'mongodb://LyxaMicroservice_knifegraph:e63553be8e6142562187931fd2d5680f899c8c71@94-lz.h.filess.io:61004/LyxaMicroservice_knifegraph',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
