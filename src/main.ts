import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";

require('dotenv').config();

const PORT = process.env.PORT
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  const config = new DocumentBuilder()
      .setTitle("User Backend with Auth")
      .setDescription("Locked Guards + Access/RefreshTokens")
      .setVersion('1.0.0.infdev.ilsul.gay')
      .addOAuth2(
          {
            type: "oauth2",
            flows: {
              password: {
                tokenUrl: '/api/auth/login',
                refreshUrl: '/api/auth/refresh',
                scopes: []
              }
            }
          }, 'Oauth2'
      )
      .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
          oauth2RedirectUrl : 'api/auth/login'
      }
  });
  await app.listen(PORT, () => console.log(`Server started at PORT = ${PORT}`));
}
bootstrap();
