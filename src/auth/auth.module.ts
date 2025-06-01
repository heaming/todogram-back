import {EmailVerificationController} from "@/auth/email-verification.controller";
import {EmailVerificationService} from "@/auth/email-verification.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailVerification} from "@/entities/email-verification.entity";
import {User} from "@/entities/user.entity";
import {EmailService} from "@/auth/email.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmailVerification,
            User
        ]),
    ],
    controllers: [EmailVerificationController],
    providers: [EmailVerificationService, EmailService],
})
export class AuthModule {}