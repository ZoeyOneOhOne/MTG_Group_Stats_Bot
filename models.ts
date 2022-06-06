export type player = {
    id: string;
    Name: string;
    Games: number;
    Wins: number;
}

export type commander = {
    id: string;
    Name: string;
    Games: number;
    Wins: number;
    playerId: string;
}
