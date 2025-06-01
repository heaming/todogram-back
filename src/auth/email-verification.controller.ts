import { Controller, Post, Body } from '@nestjs/common';
import {EmailVerificationService} from "@/auth/email-verification.service";

@Controller('email')
export class EmailVerificationController {
    constructor(private readonly emailVerificationService: EmailVerificationService) {}

    @Post('verification')
    sendVerifyEmail(@Body() request: { userId: string }) {
        return this.emailVerificationService.sendVerificationCode(request.userId);
    }

    @Post('verify')
    verifyCode(@Body() request: { userId: string, authCode: string }) {
        return this.emailVerificationService.verifyCode(request.userId, request.authCode);
    }
}