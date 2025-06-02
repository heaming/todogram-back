import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

export interface JwtPayload {
    userId: string;
    membership?: string;
}

@Injectable()
export class TodogramJwtService {
    constructor(private readonly jwtService: NestJwtService) {}

    sign(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }

    verify(token: string) {
        return this.jwtService.verify(token);
    }
}
