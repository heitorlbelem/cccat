import { signup } from '../src/signup'

test('Deve criar uma conta de passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }
  const responseSignup = await signup(input)
  expect(responseSignup.id).toBeDefined()
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
  await signup(input)
  await expect(signup(input)).rejects.toThrow('Email already in use')
})

test('Não deve criar uma conta de passageiro com nome inválido', async () => {
  const input = {
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }
  await expect(signup(input)).rejects.toThrow('Invalid name')
})

test('Não deve criar uma conta de passageiro com email inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }

  await expect(signup(input)).rejects.toThrow('Invalid email')
})

test('Não deve criar uma conta de passageiro com cpf inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567891',
    password: '123456',
    isPassenger: true,
  }
  await expect(signup(input)).rejects.toThrow('Invalid cpf')
})

test('Não deve criar uma conta de motorista com placa inválida', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isDriver: true,
    carPlate: '123456',
  }
  await expect(signup(input)).rejects.toThrow('Invalid car plate')
})
