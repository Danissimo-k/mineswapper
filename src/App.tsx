import { useState } from 'react'
import './App.css'
import {RootRouter} from "./routes/RootRouter";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
        <RootRouter/>
      </BrowserRouter>
  )
}

export default App
