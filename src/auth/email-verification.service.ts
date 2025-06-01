import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from './email.service';
import {EmailVerification} from "@/entities/email-verification.entity";
import crypto from 'crypto';
import dayjs from "dayjs";
import {User} from "@/entities/user.entity";

require('dayjs/locale/ko');
dayjs().locale('ko');

@Injectable()
export class EmailVerificationService {
    constructor(
        @InjectRepository(EmailVerification)
        private readonly emailVerificationRepository: Repository<EmailVerification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private readonly emailService: EmailService,
    ) {}

    async sendVerificationCode(userId: string): Promise<void> {

        const code = crypto.randomBytes(3).toString('hex'); // 6자리 숫자
        const expiresAt = dayjs().add(5, "minute").toDate();

        try {
            await this.emailVerificationRepository.save({ userId, code, expiresAt: expiresAt });
            await this.emailService.sendVerificationCode(userId, code);
        } catch (e) {
            console.error(e);
            throw new HttpException('인증 번호 전송을 실패했습니다.', HttpStatus.BAD_REQUEST);
        }
    }

    async verifyCode(userId: string, code: string): Promise<boolean> {
        try {
            const user = await this.userRepository.findOne({ where: { userId } });
            if (user) {
                throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.BAD_REQUEST);
            }

            const result = await this.emailVerificationRepository.findOne({
                where: { userId, code },
            });

            if (!result) {
                throw new HttpException('인증번호를 정확하게 입력하세요', HttpStatus.BAD_REQUEST);
            }

            if (result.expiresAt < dayjs().toDate()) {
                throw new HttpException('인증 시간이 만료되었습니다.', HttpStatus.BAD_REQUEST);
            }

            await this.emailVerificationRepository.update(
                { id: result.id },
                { verifiedAt: dayjs().toDate() }
            );

            return true;
        } catch (error) {
            throw new HttpException(`[이메일 인증 실패] ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
