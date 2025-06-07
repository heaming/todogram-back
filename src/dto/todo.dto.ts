export interface TodoCreateRequest {
    userId: string;
    sort: string;
    content: string;
    status: boolean;
    date: string;
    timeAt: string;
    timeAmpm: string;
    categoryId: string;
}

export enum UpdateType {
    sort,
    content,
    status,
    date,
    timeAt,
    timeAmpm
}

export interface TodoUpdateRequest {
    userId: string;
    updateType: UpdateType;
    value: string;
}