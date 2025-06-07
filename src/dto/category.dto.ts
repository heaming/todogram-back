export interface CategoryCreateRequest {
    userId: string;
    sort: string;
    content: string;
    color: string;
}

export enum UpdateType {
    sort,
    content,
    color,
}

export interface CategoryUpdateRequest {
    userId: string;
    updateType: UpdateType;
    value: string;
}