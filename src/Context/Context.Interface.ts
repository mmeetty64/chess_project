import { ReactNode } from "react";

interface IValues{
    active: number;
    getActive: (active: number) => void;
    turn: string;
    getTurn: (turn: string) => void
}

interface IProps{
    children: ReactNode;
}
export type{
    IValues,
    IProps
}