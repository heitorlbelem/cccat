import express from 'express'
import { Signup } from './signup'
import { AccountDAODatabase } from './accountDAO'
import { GetAccount } from './getAccount'

const app = express()
app.use(express.json())

app.post('/signup', async (req, res) => {
  const input = req.body
  const accountDAO = new AccountDAODatabase()
  const signup = new Signup(accountDAO)
  try {
    const result = await signup.execute(input)
    return res.status(201).json({ id: result.id })
  } catch (err: any) {
    return res.status(422).json({ message: err.message })
  }
})

app.get('/accounts/:id', async (req, res) => {
  const id = req.params.id
  const accountDAO = new AccountDAODatabase()
  const getAccount = new GetAccount(accountDAO)
  const account = await getAccount.execute(id)
  if (!account) return res.status(404).json({ message: 'Account not found' })
  return res.json(account)
})

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
