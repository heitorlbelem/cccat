import { AccountDAOInMemory } from "../src/AccountDAO"
import { GetAccount } from "../src/GetAccount"
import { Signup } from "../src/Signup"

let getAccount: GetAccount
let signup: Signup
let accountId: string

const input = {
    name: "John Doe",
    cpf: "01234567890",
    email: `john.doe${Math.random()}@sample.com`,
    password: "123456",
    isPassenger: true
}

beforeEach(async () => {
    const accountDAOInMemory = new AccountDAOInMemory()
    getAccount = new GetAccount(accountDAOInMemory)
    signup = new Signup(accountDAOInMemory)
    accountId = (await signup.execute(input)).accountId
})

test("Deve criar um passageiro", async () => {
    const getAccountOutput = await getAccount.execute(accountId)
    expect(getAccountOutput.name).toBe(input.name)
    expect(getAccountOutput.email).toBe(input.email)
    expect(getAccountOutput.cpf).toBe(input.cpf)
    expect(getAccountOutput.isPassenger).toBe(input.isPassenger)
})
