import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail', // 예: gmail, naver, custom SMTP 등
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    async sendVerificationCode(userId: string, code: string) {
        try {
            await this.transporter.sendMail({
                from: `"Todogram" <${process.env.EMAIL_USER}>`,
                to: userId,
                subject: '[Todogram] 이메일 인증 코드',
                html:  `
              <div style="max-width: 480px; margin: 0 auto; padding: 32px 24px; font-family: 'Segoe UI', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px;">
                <h2 style="margin-bottom: 16px; color: #00BC7DFF; font-size: 20px;">Todogram 이메일 인증</h2>
            
                <p style="font-size: 15px; color: #333333; line-height: 1.6;">
                  안녕하세요 👋<br/>
                  아래 <strong style="color: #00BC7DFF;">인증 코드</strong>를 입력해 이메일 인증을 완료해주세요.
                </p>
            
                <div style="
                  margin: 24px 0;
                  padding: 20px;
                  text-align: center;
                  background-color: #f8f8f8;
                  border: 2px solid #00BC7DFF;
                  border-radius: 8px;
                  font-size: 24px;
                  font-weight: bold;
                  color: #00BC7DFF;
                  letter-spacing: 4px;
                ">
                  ${code}
                </div>
            
                <p style="font-size: 13px; color: #777777;">
                  ⏳ 인증 코드는 <strong>5분간 유효</strong>합니다.<br/>
                  본인이 요청하지 않은 경우, 이 메일은 무시하셔도 됩니다.
                </p>
            
                <p style="margin-top: 32px; font-size: 12px; color: #aaaaaa; text-align: center;">
                  Todogram
                </p>
              </div>
            `,
            });
        } catch (e) {
            throw new Error(`Failed to send verification code to ${userId} :: ${e.message || e}`);
        }

    }
}