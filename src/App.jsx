import { useState } from 'react'
import { Button } from "@/shadcnComp/ui/button"
import AllTransaction from "./components/AllTransaction"
import SingleTransaction from "./components/SingleTransactions"
import './App.css'

function App() {
  const [showTransactions, setShowTransactions] = useState(false);
  //  func for toggle show content of component Alltransaction and SingleTransaction
  const toggleTransactions = () => {
    setShowTransactions(!showTransactions); 
  };

  return (
    <div className="App bg-gray-100">
      <div className="btn-tranaction flex justify-center">
      <Button onClick={toggleTransactions} className="mt-2">
        {showTransactions ? 'Show Single Transaction(Api Bakar)' : 'Show  All Transactions'}
      </Button>
      </div>
       {/* main data  will displayed simulate reactrouter dom of pages */}
      {showTransactions ? <AllTransaction />:<SingleTransaction/>}
    </div>
  )
}

export default App;
