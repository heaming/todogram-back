import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@/entities/user.entity";
import {Repository} from "typeorm";
import {Friend} from "@/entities/friend.entity";
import {FriendResponse} from "@/dto/friend.dto";

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(Friend)
        private friendRepository: Repository<Friend>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async addFriend(userId: string, friendId: string): Promise<FriendResponse> {
        try {
            const user = await this.userRepository.findOneBy({ userId });
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }

            const friendUser = await this.userRepository.findOneBy({ userId: friendId });
            if (!friendUser) {
                throw new HttpException('[친구찾기 실패!] 찾을 수 없는 계정입니다.', HttpStatus.BAD_REQUEST);
            }
            if(friendUser.deletedAt) {
                throw new HttpException('[친구찾기 실패!] 탈퇴한 계정입니다.', HttpStatus.BAD_REQUEST);
            }

            const friend = await this.friendRepository.save({ userId: user.id, friendId: friendUser.id });
            return {id: friend.id, friend: friendUser};
        } catch (err) {
            console.error(err);
            throw new HttpException(`[친구 등록 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteFriend(id: string) {
        try {
            return await this.friendRepository.softDelete({id});
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    }

    async getFriends(userId: string): Promise<FriendResponse[]> {
        try {
            const user = await this.userRepository.findOneBy({ userId });
            if (!user) {
                throw new HttpException('가입되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
            }

            const rows: { friend_id: string, id: string, user_id: string, username: string }[] = await this.friendRepository.query(`
                WITH f AS (
                    SELECT *
                    from friend
                    where user_id = ?
                    and deleted_at is null
                )
                SELECT u.id,
                       u.user_id,
                       u.username,
                       f.id as friend_id
                FROM f
                INNER JOIN todogram_user u ON f.friend_id = u.user_id
                WHERE u.deleted_at IS NULL
                ORDER BY f.id
            `,[userId])
            const friends: FriendResponse[] = rows.map(row => ({id: row.friend_id, friend: {id: row.id, userId: row.user_id, username: row.username}}))
            return friends;
        } catch (err) {
            console.error(err);
            throw new HttpException(`[친구 등록 실패] ${err.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}