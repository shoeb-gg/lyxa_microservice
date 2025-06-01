import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import fastifyCsrf from '@fastify/csrf-protection';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: '*',
    credentials: true,
    preflightContinue: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());
  await app.register(fastifyCsrf);

  await app.listen(3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
