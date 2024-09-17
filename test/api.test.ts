import axios from "axios"

axios.defaults.validateStatus = () =>{
    return true
}

test("Deve criar um passageiro", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    const signupResponse = await axios.post("http://localhost:3000/signup", input)
    const signupOutput = signupResponse.data
    expect(signupOutput.accountId).toBeDefined()
    const getAccountResponse = await axios.get(`http://localhost:3000/accounts/${signupOutput.accountId}`)
    const getAccountOutput = getAccountResponse.data
    expect(getAccountOutput.name).toBe(input.name)
    expect(getAccountOutput.cpf).toBe(input.cpf)
    expect(getAccountOutput.email).toBe(input.email)
    expect(getAccountOutput.password).toBe(input.password)
    expect(getAccountOutput.is_passenger).toBe(input.isPassenger)
})

test("Não deve criar contas duplicadas", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    await axios.post("http://localhost:3000/signup", input)
    const signupResponse = await axios.post("http://localhost:3000/signup", input)
    expect(signupResponse.status).toBe(422)
    const signupOutput = signupResponse.data.message
    expect(signupOutput).toBe("Account already exist")
})

test("Não deve criar um passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        cpf: "01234567890",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    const signupResponse = await axios.post("http://localhost:3000/signup", input)
    expect(signupResponse.status).toBe(422)
    const signupOutput = signupResponse.data.message
    expect(signupOutput).toBe("Invalid name")
})

test("Não deve criar um passageiro com email inválido", async () => {
    const input = {
        name: "John Doe",
        cpf: "01234567890",
        email: `john.doe${Math.random()}.com`,
        password: "123456",
        isPassenger: true
    }
    const signupResponse = await axios.post("http://localhost:3000/signup", input)
    expect(signupResponse.status).toBe(422)
    const signupOutput = signupResponse.data.message
    expect(signupOutput).toBe("Invalid e-mail")
})

test("Não deve criar um passageiro com cpf inválido", async () => {
    const input = {
        name: "John Doe",
        cpf: "0123456789",
        email: `john.doe${Math.random()}@sample.com`,
        password: "123456",
        isPassenger: true
    }
    const signupResponse = await axios.post("http://localhost:3000/signup", input)
    expect(signupResponse.status).toBe(422)
    const signupOutput = signupResponse.data.message
    expect(signupOutput).toBe("Invalid CPF")
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
    const signupResponse = await axios.post("http://localhost:3000/signup", input)
    expect(signupResponse.status).toBe(422)
    const signupOutput = signupResponse.data.message
    expect(signupOutput).toBe("Invalid car plate")
})
