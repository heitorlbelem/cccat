import express from 'express'
import { Signup } from './signup'
import { AccountDAODatabase } from './accountDAO'

const app = express()
app.use(express.json())

app.post('/signup', async (req, res) => {
  const input = req.body
  const accountDAO = new AccountDAODatabase()
  const signup = new Signup(accountDAO)
  try {
    const result = await signup.execute(input)
    return res.status(201).json({ accountId: result.id })
  } catch (err: any) {
    return res.status(422).json({ message: err.message })
  }
})

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
