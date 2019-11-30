import React  from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import storageUtils  from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

const user = storageUtils.GetUser()
memoryUtils.user = user

ReactDOM.render(<App/>,document.getElementById('root'))