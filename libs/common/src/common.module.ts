import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
})
export class CommonModule {}
