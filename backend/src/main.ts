import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { hostname } from 'os';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });
  

  void(process.env.NODE_ENV_FRONTEND_HOST);
  // allow-origin: ['*'],
  app.enableCors({
    origin: ['http://' + process.env.NODE_ENV_FRONTEND_HOST],
    allowedHeaders: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
