import { FC, createContext, useState } from "react";
import { IProps, IValues } from "./Context.Interface";

export const Context = createContext({} as IValues)

export const ContextWrapper: FC<IProps> = ({children}) => {

    const [active, setActive] = useState(0)
    const [turn, setTurn] = useState("white")

    const getActive = (active: number) =>{
        setActive(active)
    }

    const getTurn = (turn: string) => {
      setTurn(turn)
    }

    const values = {
        active,
        getActive,
        turn, 
        getTurn
    }
  return (
    <Context.Provider value={values}>
        {children}
    </Context.Provider>
  )
}
