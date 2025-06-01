import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {HttpExceptionFilter} from "@/exception/http.exception";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true, // 쿠키 전송 등 필요시
    },
  });
  console.log('JWT Secret:', process.env.JWT_SECRET);
  app.setGlobalPrefix('api/v1');
  // app.useGlobalFilters(new HttpExceptionFilter);
  const PORT = process.env.PORT || 4000;
  console.log("Env :: ",process.env)
  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
