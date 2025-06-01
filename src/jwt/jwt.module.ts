import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import {TodogramJwtService} from './jwt.service';
import {TodogramJwtStrategy} from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        NestJwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
            inject: [ConfigService],
            imports: [ConfigModule],
        }),
    ],
    providers: [TodogramJwtService, TodogramJwtStrategy],
    exports: [TodogramJwtService],
})
export class TodogramJwtModule {}