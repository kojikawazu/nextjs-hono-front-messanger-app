/**
 * Message type
 */
export interface Message {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        avatarUrl: string;
        createdAt: string;
    }
}