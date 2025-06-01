import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TodogramJwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        console.log('JWT_SECRETddd:', configService.get<string>('JWT_SECRET'));
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { userId: string }) {
        return { userId: payload.userId };
    }
}
