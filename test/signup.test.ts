import { AccountDAOInMemory } from "../src/AccountDAO"
import { Signup } from "../src/Signup"
import sinon from "sinon"

let signup: Signup

beforeEach(() => {
    const accountDAOInMemory = new AccountDAOInMemory()
    signup = new Signup(accountDAOInMemory)
})

test("Deve criar um passageiro", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    const signupOutput = await signup.execute(input)
    expect(signupOutput.accountId).toBeDefined()
})

test("Não deve criar contas duplicadas", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    await signup.execute(input)
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exist"))
})

test("Não deve criar um passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"))
})

test("Não deve criar um passageiro com email inválido", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}.com`,
        password: "123456",
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid e-mail"))
})

test("Não deve criar um passageiro com cpf inválido", async () => {
    const input = {
        name: "John Doe",
        cpf: "0123456789",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid CPF"))
})

test("Não deve criar um motorista com placa inválida", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isDriver: true,
        carPlate: "123AAA",
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"))
})

test("Deve criar um passageiro com stub", async () => {
    const getAccountByEmail = sinon.stub(
        AccountDAOInMemory.prototype, "getAccountByEmail"
    ).resolves()
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    const signupOutput = await signup.execute(input)
    expect(signupOutput.accountId).toBeDefined()
    getAccountByEmail.restore()
})

test("Deve criar um passageiro com spy", async () => {
    const accountDAOSpy = sinon.spy(AccountDAOInMemory.prototype, "getAccountByEmail")
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    const signupOutput = await signup.execute(input)
    expect(signupOutput.accountId).toBeDefined()
    expect(accountDAOSpy.calledWith(input.email)).toBe(true)
    accountDAOSpy.restore()
})

test.only("Deve criar um passageiro com mock", async () => {
    const accountDAOMock = sinon.mock(AccountDAOInMemory.prototype)
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    accountDAOMock.expects("getAccountByEmail").withArgs("john.doe@sample.com").once().callsFake(() => {
        console.log("oi")
    })
    const signupOutput = await signup.execute(input)
    expect(signupOutput.accountId).toBeDefined()
    accountDAOMock.verify()
    accountDAOMock.restore()
})