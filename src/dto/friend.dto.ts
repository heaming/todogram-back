export interface FriendResponse {
    id: string;
    friend: {
        id: string;
        userId: string;
        username: string;
    };
}

export interface CreateFriendRequest {
    userId: string;
    friendId: string;
}