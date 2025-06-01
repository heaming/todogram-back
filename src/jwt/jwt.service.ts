import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class TodogramJwtService {
    constructor(private readonly jwtService: NestJwtService) {}

    sign(payload: { userId: string }) {
        return this.jwtService.sign(payload);
    }

    verify(token: string) {
        return this.jwtService.verify(token);
    }
}
