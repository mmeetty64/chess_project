import { useContext } from 'react';
import { Context } from '../../../Context/ContextWrapper';
import { Table, Tables} from '../Table/Table'
import { error } from 'console';

export enum Figures { KingD = "KingD", KingL = "KingL",  
QueenD = "QueenD", QueenL = "QueenL", 
PawnD = "PawnD", PawnL = "PawnL", 
ElephantD = "ElephantD", ElephantL = "ElephantL", 
RookD = "RookD", RookL = "RookL", 
HorseD = "HorseD", HorseL = "HorseL"}

export let positFigure = new Map();

interface ITrueRun{
  row: number;
  position: number;
}

class Figure {
    
    activeId: number = -1

    start(){
      if(positFigure.size < 1 ){
      for(let i = 0; i < 8; i++){
        positFigure.set(i, new Pawn(1, i, "black", i))
        positFigure.set(i+8, new Pawn(6, i, "white", i+8))
        console.log("nettttt")
      }
      positFigure.set(positFigure.size, new Rook(0, 0, "black", positFigure.size)) 
      positFigure.set(positFigure.size, new Rook(0, 7, "black", positFigure.size)) 
      positFigure.set(positFigure.size, new Rook(7, 0, "white", positFigure.size)) 
      positFigure.set(positFigure.size, new Rook(7, 7, "white", positFigure.size)) 
      positFigure.set(positFigure.size, new Elephant(0, 2, "black", positFigure.size))
      positFigure.set(positFigure.size, new Elephant(0, 5, "black", positFigure.size))
      positFigure.set(positFigure.size, new Elephant(7, 2, "white", positFigure.size))
      positFigure.set(positFigure.size, new Elephant(7, 5, "white", positFigure.size))
      positFigure.set(positFigure.size, new Horse(0, 1, "black", positFigure.size))
      positFigure.set(positFigure.size, new Horse(0, 6, "black", positFigure.size))
      positFigure.set(positFigure.size, new Horse(7, 1, "white", positFigure.size))
      positFigure.set(positFigure.size, new Horse(7, 6, "white", positFigure.size))
      positFigure.set(positFigure.size, new Queen(0, 3, "black", positFigure.size))
      positFigure.set(positFigure.size, new Queen(7, 3, "white", positFigure.size))
      positFigure.set(positFigure.size, new King(0, 4, "black", positFigure.size))
      positFigure.set(positFigure.size, new King(7, 4, "white", positFigure.size))
      }
      console.log(positFigure.size)
    }

    inActive(id: number) {
      positFigure.get(id).active = true;
      positFigure.get(id).activeId = positFigure.get(id).id;
      positFigure.get(id).colorActivation()
      return positFigure.get(id).activeId
    }

    run(id: number, newRowPosition: number, newPosition: number) {
      if(positFigure.get(id).conditionEat(newRowPosition, newPosition)){
        this.eatingFigure(newRowPosition, newPosition)
        console.log(positFigure.size)
      }
      if(positFigure.get(id).conditionRun(newRowPosition, newPosition) ||positFigure.get(id).conditionEat(newRowPosition, newPosition)){
        Tables[positFigure.get(id).positionRow][positFigure.get(id).position] = -1; 
        positFigure.get(id).positionRow = newRowPosition;
        positFigure.get(id).position = newPosition; 
        Tables[newRowPosition][newPosition] = positFigure.get(id).id; 
        positFigure.get(id).activeId = -1;
        return true
      }
      else{
        alert("Фигура не может как походить!")
        return false
      }
    }

    swithTurn(color: string){
      if(color === "white"){
        return "black"
      }
      else{
        return "white"
      }
    }

    eatingFigure(row: number, position: number){
      positFigure.delete(Tables[row][position])
      Tables[row][position] = -1
    }

    checkEnd(){
      let check = false;
      let idKing = -1;
      for(let i  = 0; i < positFigure.size; i++){
        if(positFigure.get(i)){
          positFigure.get(i).colorActivation() 
          for(let a = 0; a < positFigure.get(i).trueEat.length; i++){
            if(positFigure.get(Tables[positFigure.get(i).trueEat[a].row][positFigure.get(i).trueEat[a].position]).type == "King"){
              check = true;
              idKing = Tables[positFigure.get(i).trueEat[a].row][positFigure.get(i).trueEat[a].position]
            }
          }
        }
      }
      console.log(check, idKing)
    }
}

export let main = new Figure();

class Pawn extends Figure{
    type: string = "Pawn";
    figure: string = "";
    color: string;
    id: number;
    positionRow: number;
    position: number;
    active: boolean = false;
    noActivation: boolean = true;
    trueRun: ITrueRun[] = [];
    trueEat: ITrueRun[] = [];
    constructor(positionRow: number, position: number, figureColor: string, id: number){
      super();
      this.positionRow = positionRow;
      this.position = position; 
      this.id = id
      Tables[positionRow][position] = id; 
      if(figureColor == "white"){
        this.figure = Figures.PawnL 
      }else if(figureColor == "black"){
        this.figure = Figures.PawnD
      }   
      this.color = figureColor
    }

    colorActivation(){
      if(this.trueRun.length > 0){
        this.trueRun = [];
        this.trueEat = [];
      }
      let downUnlock: boolean = true
      let upUnlock: boolean = true
      for(let i = 1; i <= 2; i++){
        if(this.figure == Figures.PawnD && (this.positionRow + i) < 8 && i !== 0){
          if(this.noActivation == true && downUnlock){
            if(Tables[this.positionRow + i][this.position] !== -1){
              downUnlock = false;
            }else{this.trueRun.push({row: this.positionRow + i, position: this.position})}
          }else if(Tables[this.positionRow + 1][this.position] === -1){
            this.trueRun.push({row: this.positionRow + 1, position: this.position})
          }
          if(Tables[this.positionRow + 1][this.position + 1] > -1 && positFigure.get(Tables[this.positionRow + 1][this.position + 1]).color != this.color){
            this.trueEat.push({row: this.positionRow + 1, position: this.position + 1})
          }
          if(Tables[this.positionRow + 1][this.position - 1] > -1 && positFigure.get(Tables[this.positionRow + 1][this.position - 1]).color != this.color){
            this.trueEat.push({row: this.positionRow + 1, position: this.position - 1})
          }
        }
        if(this.figure == Figures.PawnL && (this.positionRow - i) > -1 && i !== 0){
          if(this.noActivation == true && upUnlock){
            if(Tables[this.positionRow - i][this.position] !== -1){
              upUnlock = false;
            }else{this.trueRun.push({row: this.positionRow - i, position: this.position})}
          }else if(Tables[this.positionRow - 1][this.position] === -1){
            this.trueRun.push({row: this.positionRow - 1, position: this.position})
          }
          if(Tables[this.positionRow - 1][this.position + 1] > -1 && positFigure.get(Tables[this.positionRow - 1][this.position + 1]).color != this.color){
            this.trueEat.push({row: this.positionRow - 1, position: this.position + 1})
          }
          if(Tables[this.positionRow - 1][this.position - 1] > -1 && positFigure.get(Tables[this.positionRow - 1][this.position - 1]).color != this.color){
            this.trueEat.push({row: this.positionRow - 1, position: this.position - 1})
          }
        }
        console.log(this.trueRun)
      }
    }

    conditionEat(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueEat.length; i++){
        if(newRow == this.trueEat[i].row && newPosition == this.trueEat[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }
    
    conditionRun(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueRun.length; i++){
        if(newRow == this.trueRun[i].row && newPosition == this.trueRun[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }
  }

  class Rook extends Figure{
    type: string = "Rook";
    figure: string = "";
    color: string;
    id: number;
    positionRow: number;
    position: number;
    active: boolean = false;
    noActivation: boolean = true;
    trueRun: ITrueRun[] = [];
    trueEat: ITrueRun[] = [];
    constructor(positionRow: number, position: number, figureColor: string, id: number){
      super();
      this.positionRow = positionRow;
      this.position = position; 
      this.id = id
      Tables[positionRow][position] = id; 
      if(figureColor == "white"){
        this.figure = Figures.ElephantL
      }else if(figureColor == "black"){
        this.figure = Figures.ElephantD
      } 
      this.color = figureColor   
    }

    colorActivation(){
      if(this.trueRun.length > 0){
        this.trueRun = [];
        this.trueEat = [];
      }
      let upUnlock: boolean = true;
      let downUnlock: boolean = true;
      let leftUnlock: boolean = true;
      let rightUnlock: boolean = true;
      for(let i = 1; i <= 7; i++){
        if(this.position - i >= 0 && leftUnlock){
          if(Tables[this.positionRow][this.position - i] > -1 && positFigure.get(Tables[this.positionRow][this.position - i]).color == this.color){
            leftUnlock = false;
          }else if(Tables[this.positionRow][this.position - i] > -1 && positFigure.get(Tables[this.positionRow][this.position - i]).color != this.color){
            leftUnlock = false;
            this.trueEat.push({row: this.positionRow, position: this.position - i})
          }
          else{this.trueRun.push({row: this.positionRow, position: this.position - i})}
        }
        if(this.position + i < 8 && rightUnlock){
          if(Tables[this.positionRow][this.position + i] > -1 && positFigure.get(Tables[this.positionRow][this.position + i]).color == this.color){
            rightUnlock = false;
          }else if(Tables[this.positionRow][this.position + i] > -1 && positFigure.get(Tables[this.positionRow][this.position + i]).color != this.color){
            rightUnlock = false;
            this.trueEat.push({row: this.positionRow, position: this.position + i})
          }
          else{this.trueRun.push({row: this.positionRow, position: this.position + i})}
        }
        if(this.positionRow - i >= 0 && upUnlock){
          if(Tables[this.positionRow - i][this.position] > -1 && positFigure.get(Tables[this.positionRow - i][this.position]).color == this.color){
            upUnlock = false;
          }else if(Tables[this.positionRow - i][this.position] > -1 && positFigure.get(Tables[this.positionRow - i][this.position]).color != this.color){
            upUnlock = false;
            this.trueEat.push({row: this.positionRow - i, position: this.position})
          }
          else{this.trueRun.push({row: this.positionRow - i, position: this.position})}
        }
        if(this.positionRow + i < 8 && downUnlock){
          if(Tables[this.positionRow + i][this.position] > -1 && positFigure.get(Tables[this.positionRow + i][this.position]).color == this.color){
            downUnlock = false;
          }else if(Tables[this.positionRow + i][this.position] > -1 && positFigure.get(Tables[this.positionRow + i][this.position]).color != this.color){
            downUnlock = false;
            this.trueEat.push({row: this.positionRow + i, position: this.position})
          }
          else{this.trueRun.push({row: this.positionRow + i, position: this.position})}
        }
        console.log(this.trueRun)
        console.log(this.trueEat);
        
      }
    }

    conditionEat(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueEat.length; i++){
        if(newRow == this.trueEat[i].row && newPosition == this.trueEat[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }

    conditionRun(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueRun.length; i++){
        if(newRow == this.trueRun[i].row && newPosition == this.trueRun[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }
  }

  class Elephant extends Figure{
    type: string = "Elephant";
    figure: string = "";
    color: string;
    id: number;
    positionRow: number;
    position: number;
    active: boolean = false;
    noActivation: boolean = true;
    trueRun: ITrueRun[] = [];
    trueEat: ITrueRun[] = [];
    constructor(positionRow: number, position: number, figureColor: string, id: number){
      super();
      this.positionRow = positionRow;
      this.position = position; 
      this.id = id
      Tables[positionRow][position] = id; 
      if(figureColor == "white"){
        this.figure = Figures.RookL
      }else if(figureColor == "black"){
        this.figure = Figures.RookD
      }    
      this.color = figureColor
    }

    colorActivation(){
      if(this.trueRun.length > 0){
        this.trueRun = [];
        this.trueEat = [];
      }
      let upLeftUnlock: boolean = true;
      let upRightUnlock: boolean = true;
      let downLeftUnlock: boolean = true;
      let downRightUnlock: boolean = true;
      for(let i = 1; i <= 7; i++){
        if(this.position - i >= 0 && this.positionRow - i >= 0 && upLeftUnlock){
          if(Tables[this.positionRow - i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position - i]).color == this.color){
            upLeftUnlock = false;
          }else if(Tables[this.positionRow - i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position - i]).color != this.color){
            upLeftUnlock = false;
            this.trueEat.push({row: this.positionRow - i, position: this.position - i})
          }
          else{this.trueRun.push({row: this.positionRow - i, position: this.position - i})}
        }
        if(this.position + i < 8 && this.positionRow + i < 8 && downRightUnlock){
          if(Tables[this.positionRow + i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow + i][this.position + i]).color == this.color){
            downRightUnlock = false;
          }else if(Tables[this.positionRow + i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow  + i][this.position + i]).color != this.color){
            downRightUnlock = false;
            this.trueEat.push({row: this.positionRow + i, position: this.position + i})
          }
          else{this.trueRun.push({row: this.positionRow + i, position: this.position + i})}
        }
        if(this.positionRow - i >= 0 && this.position + i < 8 && upRightUnlock){
          if(Tables[this.positionRow - i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position + i]).color == this.color){
            upRightUnlock = false;
          }else if(Tables[this.positionRow - i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position + i]).color != this.color){
            upRightUnlock = false;
            this.trueEat.push({row: this.positionRow - i, position: this.position + i})
          }
          else{this.trueRun.push({row: this.positionRow - i, position: this.position + i})}
        }
        if(this.positionRow + i < 8 && this.position - i >= 0 && downLeftUnlock){
          if(Tables[this.positionRow + i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow + i][this.position - i]).color == this.color){
            downLeftUnlock = false;
          }else if(Tables[this.positionRow + i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow + i][this.position - i]).color != this.color){
            downLeftUnlock = false;
            this.trueEat.push({row: this.positionRow + i, position: this.position - i})
          }
          else{this.trueRun.push({row: this.positionRow + i, position: this.position - i})}
        }
        console.log(this.trueRun)
      }
    }

    conditionEat(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueEat.length; i++){
        if(newRow == this.trueEat[i].row && newPosition == this.trueEat[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }

    conditionRun(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueRun.length; i++){
        if(newRow == this.trueRun[i].row && newPosition == this.trueRun[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }
  }

  class Horse extends Figure{
    type: string = "Horse";
    figure: string = "";
    color: string;
    id: number;
    positionRow: number;
    position: number;
    active: boolean = false;
    noActivation: boolean = true;
    trueRun: ITrueRun[] = [];
    trueEat: ITrueRun[] = [];
    constructor(positionRow: number, position: number, figureColor: string, id: number){
      super();
      this.positionRow = positionRow;
      this.position = position; 
      this.id = id
      Tables[positionRow][position] = id; 
      if(figureColor == "white"){
        this.figure = Figures.HorseL
      }else if(figureColor == "black"){
        this.figure = Figures.HorseD
      }    
      this.color = figureColor
    }

    colorActivation(){
      if(this.trueRun.length > 0){
        this.trueRun = [];
        this.trueEat = [];
      }
      if(this.positionRow - 2 >= 0 && this.position - 1 >= 0){
        if(Tables[this.positionRow - 2][this.position - 1] > -1 && positFigure.get(Tables[this.positionRow - 2][this.position - 1]).color != this.color){
          this.trueEat.push({row: this.positionRow - 2, position: this.position - 1})
        }else{this.trueRun.push({row: this.positionRow - 2, position: this.position - 1})}
      }
      if(this.positionRow - 2 >= 0 && this.position + 1 < 8){
        if(Tables[this.positionRow - 2][this.position + 1] > -1 && positFigure.get(Tables[this.positionRow - 2][this.position + 1]).color != this.color){
          this.trueEat.push({row: this.positionRow - 2, position: this.position + 1})
        }else{this.trueRun.push({row: this.positionRow - 2, position: this.position + 1})}
      }
      if(this.positionRow + 2 < 8 && this.position - 1 >= 0){
        if(Tables[this.positionRow + 2][this.position - 1] > -1 && positFigure.get(Tables[this.positionRow + 2][this.position - 1]).color != this.color){
          this.trueEat.push({row: this.positionRow + 2, position: this.position - 1})
        }else{this.trueRun.push({row: this.positionRow + 2, position: this.position - 1})}
      }
      if(this.positionRow + 2 < 8 && this.position + 1 < 8){
        if(Tables[this.positionRow + 2][this.position + 1] > -1 && positFigure.get(Tables[this.positionRow + 2][this.position + 1]).color != this.color){
          this.trueEat.push({row: this.positionRow + 2, position: this.position + 1})
        }else{this.trueRun.push({row: this.positionRow + 2, position: this.position + 1})}
      }
      if(this.positionRow - 1 >= 0 && this.position - 2 >= 0){
        if(Tables[this.positionRow - 1][this.position - 2] > -1 && positFigure.get(Tables[this.positionRow - 1][this.position - 2]).color != this.color){
          this.trueEat.push({row: this.positionRow - 1, position: this.position - 2})
        }else{this.trueRun.push({row: this.positionRow - 1, position: this.position - 2})}
      }
      if(this.positionRow - 1 >= 0 && this.position + 2 < 8){
        if(Tables[this.positionRow - 1][this.position + 2] > -1 && positFigure.get(Tables[this.positionRow - 1][this.position + 2]).color != this.color){
          this.trueEat.push({row: this.positionRow - 1, position: this.position + 2})
        }else{this.trueRun.push({row: this.positionRow - 1, position: this.position + 2})}
      }
      if(this.positionRow + 1 < 8 && this.position - 2 >= 0){
        if(Tables[this.positionRow + 1][this.position - 2] > -1 && positFigure.get(Tables[this.positionRow + 1][this.position - 2]).color != this.color){
          this.trueEat.push({row: this.positionRow + 1, position: this.position - 2})
        }else{this.trueRun.push({row: this.positionRow + 1, position: this.position - 2})}
      }
      if(this.positionRow + 1 < 8 && this.position + 2 < 8){
        if(Tables[this.positionRow + 1][this.position + 2] > -1 && positFigure.get(Tables[this.positionRow + 1][this.position + 2]).color != this.color){
          this.trueEat.push({row: this.positionRow + 1, position: this.position + 2})
        }else{this.trueRun.push({row: this.positionRow + 1, position: this.position + 2})}
      }
      console.log(this.trueRun)
    }

    conditionEat(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueEat.length; i++){
        if(newRow == this.trueEat[i].row && newPosition == this.trueEat[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }

    conditionRun(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueRun.length; i++){
        if(newRow == this.trueRun[i].row && newPosition == this.trueRun[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }
  }

  class Queen extends Figure{
    type: string = "Queen";
    figure: string = "";
    color: string;
    id: number;
    positionRow: number;
    position: number;
    active: boolean = false;
    noActivation: boolean = true;
    trueRun: ITrueRun[] = [];
    trueEat: ITrueRun[] = [];
    constructor(positionRow: number, position: number, figureColor: string, id: number){
      super();
      this.positionRow = positionRow;
      this.position = position; 
      this.id = id
      Tables[positionRow][position] = id; 
      if(figureColor == "white"){
        this.figure = Figures.QueenL
      }else if(figureColor == "black"){
        this.figure = Figures.QueenD
      }    
      this.color = figureColor
    }

    colorActivation(){
      if(this.trueRun.length > 0){
        this.trueRun = [];
        this.trueEat = [];
      }
      let upUnlock: boolean = true;
      let downUnlock: boolean = true;
      let leftUnlock: boolean = true;
      let rightUnlock: boolean = true;
      let upLeftUnlock: boolean = true;
      let upRightUnlock: boolean = true;
      let downLeftUnlock: boolean = true;
      let downRightUnlock: boolean = true;
      for(let i = 1; i <= 7; i++){
        if(this.position - i >= 0 && leftUnlock){
          if(Tables[this.positionRow][this.position - i] > -1 && positFigure.get(Tables[this.positionRow][this.position - i]).color == this.color){
            leftUnlock = false;
          }else if(Tables[this.positionRow][this.position - i] > -1 && positFigure.get(Tables[this.positionRow][this.position - i]).color != this.color){
            leftUnlock = false;
            this.trueEat.push({row: this.positionRow, position: this.position - i})
          }
          else{this.trueRun.push({row: this.positionRow, position: this.position - i})}
        }
        if(this.position + i < 8 && rightUnlock){
          if(Tables[this.positionRow][this.position + i] > -1 && positFigure.get(Tables[this.positionRow][this.position + i]).color == this.color){
            rightUnlock = false;
          }else if(Tables[this.positionRow][this.position + i] > -1 && positFigure.get(Tables[this.positionRow][this.position + i]).color != this.color){
            rightUnlock = false;
            this.trueEat.push({row: this.positionRow, position: this.position + i})
          }
          else{this.trueRun.push({row: this.positionRow, position: this.position + i})}
        }
        if(this.positionRow - i >= 0 && upUnlock){
          if(Tables[this.positionRow - i][this.position] > -1 && positFigure.get(Tables[this.positionRow - i][this.position]).color == this.color){
            upUnlock = false;
          }else if(Tables[this.positionRow - i][this.position] > -1 && positFigure.get(Tables[this.positionRow - i][this.position]).color != this.color){
            upUnlock = false;
            this.trueEat.push({row: this.positionRow - i, position: this.position})
          }
          else{this.trueRun.push({row: this.positionRow - i, position: this.position})}
        }
        if(this.positionRow + i < 8 && downUnlock){
          if(Tables[this.positionRow + i][this.position] > -1 && positFigure.get(Tables[this.positionRow + i][this.position]).color == this.color){
            downUnlock = false;
          }else if(Tables[this.positionRow + i][this.position] > -1 && positFigure.get(Tables[this.positionRow + i][this.position]).color != this.color){
            downUnlock = false;
            this.trueEat.push({row: this.positionRow + i, position: this.position})
          }
          else{this.trueRun.push({row: this.positionRow + i, position: this.position})}
        }
        if(this.position - i >= 0 && this.positionRow - i >= 0 && upLeftUnlock){
          if(Tables[this.positionRow - i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position - i]).color == this.color){
            upLeftUnlock = false;
          }else if(Tables[this.positionRow - i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position - i]).color != this.color){
            upLeftUnlock = false;
            this.trueEat.push({row: this.positionRow - i, position: this.position - i})
          }
          else{this.trueRun.push({row: this.positionRow - i, position: this.position - i})}
        }
        if(this.position + i < 8 && this.positionRow + i < 8 && downRightUnlock){
          if(Tables[this.positionRow + i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow + i][this.position + i]).color == this.color){
            downRightUnlock = false;
          }else if(Tables[this.positionRow + i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow  + i][this.position + i]).color != this.color){
            downRightUnlock = false;
            this.trueEat.push({row: this.positionRow + i, position: this.position + i})
          }
          else{this.trueRun.push({row: this.positionRow + i, position: this.position + i})}
        }
        if(this.positionRow - i >= 0 && this.position + i < 8 && upRightUnlock){
          if(Tables[this.positionRow - i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position + i]).color == this.color){
            upRightUnlock = false;
          }else if(Tables[this.positionRow - i][this.position + i] > -1 && positFigure.get(Tables[this.positionRow - i][this.position + i]).color != this.color){
            upRightUnlock = false;
            this.trueEat.push({row: this.positionRow - i, position: this.position + i})
          }
          else{this.trueRun.push({row: this.positionRow - i, position: this.position + i})}
        }
        if(this.positionRow + i < 8 && this.position - i >= 0 && downLeftUnlock){
          if(Tables[this.positionRow + i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow + i][this.position - i]).color == this.color){
            downLeftUnlock = false;
          }else if(Tables[this.positionRow + i][this.position - i] > -1 && positFigure.get(Tables[this.positionRow + i][this.position - i]).color != this.color){
            downLeftUnlock = false;
            this.trueEat.push({row: this.positionRow + i, position: this.position - i})
          }
          else{this.trueRun.push({row: this.positionRow + i, position: this.position - i})}
        }
        console.log(this.trueRun)
        console.log(this.trueEat)
      }
    }

    conditionEat(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueEat.length; i++){
        if(newRow == this.trueEat[i].row && newPosition == this.trueEat[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }

    conditionRun(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueRun.length; i++){
        if(newRow == this.trueRun[i].row && newPosition == this.trueRun[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }
  }

  class King extends Figure{
    type: string = "King";
    figure: string = "";
    color: string;
    id: number;
    positionRow: number;
    position: number;
    active: boolean = false;
    noActivation: boolean = true;
    trueRun: ITrueRun[] = [];
    trueEat: ITrueRun[] = [];
    constructor(positionRow: number, position: number, figureColor: string, id: number){
      super();
      this.positionRow = positionRow;
      this.position = position; 
      this.id = id
      Tables[positionRow][position] = id; 
      if(figureColor == "white"){
        this.figure = Figures.KingL
      }else if(figureColor == "black"){
        this.figure = Figures.KingD
      }    
      this.color = figureColor
    }

    colorActivation(){
      if(this.trueRun.length > 0){
        this.trueRun = [];
        this.trueEat = [];
      }
      if(this.position - 1 >= 0){
        if(Tables[this.positionRow][this.position - 1] > -1 && positFigure.get(Tables[this.positionRow][this.position - 1]).color != this.color){
          this.trueEat.push({row: this.positionRow, position: this.position - 1})
        }else{this.trueRun.push({row: this.positionRow, position: this.position - 1})}
      }
      if(this.position + 1 < 8){
        if(Tables[this.positionRow][this.position + 1] > -1 && positFigure.get(Tables[this.positionRow][this.position + 1]).color != this.color){
          this.trueEat.push({row: this.positionRow, position: this.position + 1})
        }else{this.trueRun.push({row: this.positionRow, position: this.position + 1})}
      }
      if(this.positionRow - 1 >= 0){
        if(Tables[this.positionRow - 1][this.position] > -1 && positFigure.get(Tables[this.positionRow - 1][this.position]).color != this.color){
          this.trueEat.push({row: this.positionRow - 1, position: this.position})
        }else{this.trueRun.push({row: this.positionRow - 1, position: this.position})}
      }
      if(this.positionRow + 1 < 8){
        if(Tables[this.positionRow + 1][this.position] > -1 && positFigure.get(Tables[this.positionRow + 1][this.position]).color != this.color){
          this.trueEat.push({row: this.positionRow + 1, position: this.position})
        }else{this.trueRun.push({row: this.positionRow + 1, position: this.position})}
      }
      if(this.positionRow - 1 >= 0 && this.position - 1 >= 0){
        if(Tables[this.positionRow - 1][this.position - 1] > -1 && positFigure.get(Tables[this.positionRow - 1][this.position - 1]).color != this.color){
          this.trueEat.push({row: this.positionRow - 1, position: this.position - 1})
        }else{this.trueRun.push({row: this.positionRow - 1, position: this.position - 1})}
      }
      if(this.positionRow - 1 >= 0 && this.position + 1 < 8){
        if(Tables[this.positionRow - 1][this.position + 1] > -1 && positFigure.get(Tables[this.positionRow - 1][this.position + 1]).color != this.color){
          this.trueEat.push({row: this.positionRow - 1, position: this.position + 1})
        }else{this.trueRun.push({row: this.positionRow - 1, position: this.position + 1})}
      }
      if(this.positionRow + 1 < 8 && this.position - 1 >= 0){
        if(Tables[this.positionRow + 1][this.position - 1] > -1 && positFigure.get(Tables[this.positionRow + 1][this.position - 1]).color != this.color){
          this.trueEat.push({row: this.positionRow + 1, position: this.position - 1})
        }else{this.trueRun.push({row: this.positionRow + 1, position: this.position - 1})}
      }
      if(this.positionRow + 1 < 8 && this.position + 1 < 8){
        if(Tables[this.positionRow + 1][this.position + 1] > -1 && positFigure.get(Tables[this.positionRow + 1][this.position + 1]).color != this.color){
          this.trueEat.push({row: this.positionRow + 1, position: this.position + 1})
        }else{this.trueRun.push({row: this.positionRow + 1, position: this.position + 1})}
      }
      console.log(this.trueRun)
    }

    conditionEat(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueEat.length; i++){
        if(newRow == this.trueEat[i].row && newPosition == this.trueEat[i].position){
          yes = true
          this.noActivation = false
        }
      }
      return yes
    }

    conditionRun(newRow: number, newPosition: number){
      let yes = false;
      for(let i = 0; i < this.trueRun.length; i++){
        if(newRow == this.trueRun[i].row && newPosition == this.trueRun[i].position){
            yes = true
            this.noActivation = false
        }
      }
      return yes
    }
  }

