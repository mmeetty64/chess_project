import React, { useContext, useEffect, useState } from 'react'
import { Cell } from '../Cell/Cell'
import './Table.css'
import { main, positFigure } from '../Сhess/Chesses'
import { Context } from '../../../Context/ContextWrapper'

export const Tables = Array.from({length: 8}, () => Array(8).fill(-1))

export const Table = () => {
  const {active} = useContext(Context)

  console.log("Restart table!")
  console.log(Tables)
  if(main){
    main.start()
  }

  useEffect(() => {}, [active])
  
  return (
    <div className='table'>
      {
        Tables.map((_, idxRow) => (
          Tables[idxRow].map((el: number, idx: number) =>(
            <Cell isEven={(idxRow * 8 + idx) % 2 === 0} isEvenRow={Math.floor((idxRow * 8 + idx) / 8) % 2 === 0} index={(idxRow * 8 + idx)} figure={el} inActive={active}/>
          ))
        ))
      }
    </div>  
  )
}
