import { signup } from "../src/signup"

test("Deve criar um passageiro", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    const signupOutput = await signup(input)
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
    await signup(input)
    await expect(() => signup(input)).rejects.toThrow(new Error("Account already exist"))
})

test("Não deve criar um passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    await expect(() => signup(input)).rejects.toThrow(new Error("Invalid name"))
})

test("Não deve criar um passageiro com email inválido", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}.com`,
        password: "123456",
        isPassenger: true
    }
    await expect(() => signup(input)).rejects.toThrow(new Error("Invalid e-mail"))
})

test("Não deve criar um passageiro com cpf inválido", async () => {
    const input = {
        name: "John Doe",
        cpf: "0123456789",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    await expect(() => signup(input)).rejects.toThrow(new Error("Invalid CPF"))
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
    await expect(() => signup(input)).rejects.toThrow(new Error("Invalid car plate"))
})