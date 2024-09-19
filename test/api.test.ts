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
