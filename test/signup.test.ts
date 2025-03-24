import { AccountDAOMemory } from '../src/accountDAO'
import { GetAccount } from '../src/getAccount'
import { MailerGatewayMemory } from '../src/mailerGateway'
import { Signup } from '../src/signup'
import sinon from 'sinon'

let sut: Signup
let getAccount: GetAccount

beforeEach(() => {
  const accountDAO = new AccountDAOMemory()
  const mailerGateway = new MailerGatewayMemory()
  sut = new Signup(accountDAO, mailerGateway)
  getAccount = new GetAccount(accountDAO)
})

test('Deve criar uma conta de passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }
  const mailerMock = sinon.mock(MailerGatewayMemory.prototype)
  mailerMock
    .expects('send')
    .withArgs(input.email, 'Welcome!', 'Your account was created')
    .once()
    .callsFake(() => {
      console.log('e-mail sent')
    })
  const outputSignup = await sut.execute(input)
  const outputGetAccount = await getAccount.execute(outputSignup.id)
  expect(outputSignup.id).toBeDefined()
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.isPassenger).toBe(true)
  expect(outputGetAccount.password).toBe(input.password)
  mailerMock.verify()
  mailerMock.restore()
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
  await sut.execute(input)
  await expect(sut.execute(input)).rejects.toThrow('Email already in use')
})

test('Não deve criar uma conta de passageiro com nome inválido', async () => {
  const input = {
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }
  await expect(sut.execute(input)).rejects.toThrow('Invalid name')
})

test('Não deve criar uma conta de passageiro com email inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}gmail.com`,
    cpf: '01234567890',
    password: '123456',
    isPassenger: true,
  }
  await expect(sut.execute(input)).rejects.toThrow('Invalid email')
})

test('Não deve criar uma conta de passageiro com cpf inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '01234567891',
    password: '123456',
    isPassenger: true,
  }
  await expect(sut.execute(input)).rejects.toThrow('Invalid cpf')
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
  await expect(sut.execute(input)).rejects.toThrow('Invalid car plate')
})
