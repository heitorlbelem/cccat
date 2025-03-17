import axios from 'axios'

axios.defaults.validateStatus = () => true

test('Deve criar uma conta de passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input)
  expect(responseSignup.status).toBe(201)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeDefined()
})

test('Não deve criar uma conta de passageiro com email duplicado', async () => {
  const email = `john.doe${Math.random()}@gmail.com`
  const input = {
    name: 'John Doe',
    email,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }
  await axios.post('http://localhost:3000/signup', input)
  const responseSignup = await axios.post('http://localhost:3000/signup', input)
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data
  expect(outputSignup).toEqual({ message: 'Email already in use' })
})
