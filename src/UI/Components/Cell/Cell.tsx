import { FC, useContext, useMemo } from 'react'
import "./Cell.css"
import PawnD from "./chess/PawnD.png"
import PawnL from "./chess/PawnL.png"
import ElephantD from "./chess/ElephantD.png"
import ElephantL from "./chess/ElephantL.png"
import RookD from "./chess/RookD.png"
import RookL from "./chess/RookL.png"
import HorseD from "./chess/HorseD.png"
import HorseL from "./chess/HorseL.png"
import QueenD from "./chess/QueenD.png"
import QueenL from "./chess/QueenL.png"
import KingD from "./chess/KingD.png"
import KingL from "./chess/KingL.png"
import { Figures, main, positFigure } from '../Сhess/Chesses';
import { Context } from '../../../Context/ContextWrapper';

interface ICell{
    isEven: boolean;
    isEvenRow: boolean;
    index: number;
    figure: number;
    inActive: number
}

export const Cell: FC<ICell> = ({isEven, isEvenRow, index, figure, inActive}) => {

  const {getActive, turn, getTurn} = useContext(Context)

  let images = new Map();
  images.set("PawnD", PawnD).set("PawnL", PawnL)
  images.set("ElephantD", ElephantD).set("ElephantL", ElephantL)
  images.set("RookD", RookD).set("RookL", RookL)
  images.set("HorseD", HorseD).set("HorseL", HorseL)
  images.set("QueenD", QueenD).set("QueenL", QueenL)
  images.set("KingD", KingD).set("KingL", KingL)
  
  const color = useMemo(() => {
  if(isEven && isEvenRow){
      return "white"
  }
  else if(!isEven && !isEvenRow){
      return "white"
  }
  else{
    return "black"
  }}
  , [isEven])

  const click = () => {
    if(figure > -1 && turn === positFigure.get(figure).color){
        const data: number = main.inActive(figure)
        console.log("activate")
        console.log(data)
        getActive(data)
    }
    else if(inActive < 0 &&turn !== positFigure.get(figure).color){
      alert("Сейчас не ваш ход!")
    }
    else if(inActive > -1){
      let trueRunning = main.run(inActive, Math.floor(index / 8), index % 8)
      console.log("run")
      getActive(-1)
      if(trueRunning){
      getTurn(main.swithTurn(turn))
      main.checkEnd()
      }
    }
  }

  return (
      <div style={{backgroundColor: `${color}`}} className='cell' onClick={click}>
        {figure > -1 && <img src={images.get(positFigure.get(figure).figure)}/>}
      </div>
  )
}
