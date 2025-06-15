import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {HttpModule} from "@nestjs/axios";
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {AuthModule} from "@/auth/auth.module";
import {TodogramJwtModule} from "@/jwt/jwt.module";
import {UserModule} from "@/user/user.module";
import {TodoModule} from "@/todo/todo.module";
import {CategoryModule} from "@/category/category.module";
import {FriendModule} from "@/friend/friend.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.development'
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [__dirname + '/entities/*.entity.{ts,js}'],
          synchronize: true, // process.env.DB_DATABASE === 'development', // dev 환경에서는 true, prod에서는 false
          logging: true, // process.env.DB_DATABASE === 'development',
          namingStrategy: new SnakeNamingStrategy(),
          // dropSchema: true,
      }),
      HttpModule,
      AuthModule,
      TodogramJwtModule,
      UserModule,
      TodoModule,
      CategoryModule,
      FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
