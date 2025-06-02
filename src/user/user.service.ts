import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@/entities/user.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import {TodogramJwtService} from "@/jwt/jwt.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: TodogramJwtService,

    ) {}
    private SALT_ROUNDS = 10;

    async register(userId: string, password: string, username: string, authCode: string) {
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

        try {
            const user = new User();
            user.userId = userId;
            user.username = username;
            user.password = hashedPassword;
            user.emailVerified = !!authCode;

            const saved = await this.userRepository.save(user);
            return saved;
        } catch (err) {
            console.error('Failed to register:', err);
        }
    }

    async login(userId: string, password: string) {
        try {
            const user = await this.userRepository.findOneBy({ userId });
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new HttpException('잘못된 비밀번호입니다.', HttpStatus.BAD_REQUEST);
            }

            const accessToken = this.jwtService.sign({ userId, membership: user.membershipPlan });
            return { accessToken: accessToken };

        } catch (err) {
            console.error(err)
            throw new HttpException(`[로그인 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserByUserId(userId: string) {
        try {
            const user = await this.userRepository.findOneBy({userId});
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }

            return user;
        } catch (err) {
            console.error(err)
            throw new HttpException(`[유저 조회 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async checkPassword(userId: string, password: string) {
        try {
            const user = await this.userRepository.findOneBy({ userId });
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }
            return await bcrypt.compare(password, user.password);
        } catch (err) {
            console.error(err)
            throw new HttpException(`[로그인 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async updateUserPassword(userId: string, password: string) {
        try {
            const user = await this.userRepository.findOneBy({userId});
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }
            user.password = await bcrypt.hash(password, this.SALT_ROUNDS);
            return await this.userRepository.update({id: user.id}, user);
        } catch (err) {
                console.error(err)
                throw new HttpException(`[비밀번호 변경 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async updateUsername(userId: string, username: string) {
        try {
            const user = await this.userRepository.findOneBy({userId});
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }
            user.username = username;
            return await this.userRepository.update({id: user.id}, user);
        } catch (err) {
            console.error(err)
            throw new HttpException(`[비밀번호 변경 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}