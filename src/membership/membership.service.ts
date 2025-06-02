import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@/entities/user.entity";
import {MoreThan, Repository} from "typeorm";
import {TodogramJwtService} from "@/jwt/jwt.service";
import {Membership} from "@/entities/membership.entity";
import {MembershipPlan} from "@/entities/membership-plan.entity";
import dayjs, {locale} from "dayjs";

require('dayjs/locale/ko');
dayjs().locale('ko');

@Injectable()
export class MembershipService {
    constructor(
        @InjectRepository(Membership)
        private membershipRepository: Repository<Membership>,
        @InjectRepository(MembershipPlan)
        private membershipPlanRepository: Repository<MembershipPlan>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // 멤버십 종류 조회
    async getMembershipPlans() {
        try {
            return await this.membershipPlanRepository.find({
                order: {
                    price: "DESC",
                }
            })
        }  catch (err) {
            console.error(err)
            throw new HttpException(`[멤버십 조회 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    // 플랜 변경
    async upsertMembership(userId: string, newPlan: MembershipPlan, isAutoRenew: boolean) {
        try {
            const now = dayjs();

            let membership = await this.membershipRepository.findOne({
                where: { userId },
            });

            if (!membership) {
                // 신규 생성
                membership = this.membershipRepository.create({
                    userId,
                    membershipPlan: newPlan.membershipPlan,
                    startedAt: now.toDate(),
                    expiresAt: now.add(newPlan.durationDays, 'days').toDate(),
                    isActive: true,
                    isAutoRenew: isAutoRenew,
                });
            } else {
                // 갱신
                if (membership.expiresAt > now.toDate()) { // 만료 이전 갱신
                    membership.expiresAt = dayjs(membership.expiresAt).add(newPlan.durationDays, 'days').toDate();
                    membership.isActive = true;
                    membership.isAutoRenew = isAutoRenew;
                } else { // 만료 후
                    membership.isActive = true;
                    membership.startedAt = now.toDate();
                    membership.expiresAt = now.add(newPlan.durationDays, 'days').toDate();
                }
                membership.membershipPlan = newPlan.membershipPlan;
            }

            return this.membershipRepository.save(membership);
        } catch (err) {
            console.error(err)
            throw new HttpException(`[유저 플랜 갱신 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    // 유저 멤버십 가져오기
    async getMembershipPlanByUserId(userId: string) {
        try {
            const user = await this.userRepository.findOneBy({userId});
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }

            const membership = await this.membershipRepository.findOne({
                where: {
                    userId,
                    isActive: true,
                    expiresAt: MoreThan(new Date()),
                }
            });

            return membership || null;
        } catch (err) {
            console.error(err)
            throw new HttpException(`[유저 플랜 조회 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    // TODO 자동갱신 & 결제
}