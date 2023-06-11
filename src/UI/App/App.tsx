import React from 'react';
import './App.css';
import { Cell } from '../Components/Cell/Cell';
import { Table } from '../Components/Table/Table';
import { ContextWrapper } from '../../Context/ContextWrapper';

function App() {
  return (
    <ContextWrapper>
       <Table/>
    </ContextWrapper>
  );
}

export default App;
