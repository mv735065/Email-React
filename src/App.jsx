import { useState } from 'react'
import EmailContainer from './Components/EmailContainer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 className='text-3xl font-bold text-center p-4'>Email</h1>
     <EmailContainer />
    </>
  )
}

export default App
