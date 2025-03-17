import express from 'express'
import { signup } from './signup'

const app = express()
app.use(express.json())

app.post('/signup', async (req, res) => {
  const input = req.body
  console.log('Signup', input)
  try {
    const result = await signup(input)
    return res.status(201).json({ accountId: result.id })
  } catch (err: any) {
    return res.status(422).json({ message: err.message })
  }
})

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
