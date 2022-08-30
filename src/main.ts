import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
require('dotenv').config();

const PORT = process.env.PORT
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  await app.listen(PORT, () => console.log(`Server started at PORT = ${PORT}`));
}
bootstrap();
