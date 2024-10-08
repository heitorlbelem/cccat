import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Registry } from "../src/infra/di/DI";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import GetAccount from "../src/application/usecase/GetAccount";
import Signup from "../src/application/usecase/Signup";

let signup: Signup;
let getAccount: GetAccount;

// Integration Narrow -> Broad
beforeEach(() => {
	Registry.getInstance().provide("databaseConnection",  new PgPromiseAdapter())
	Registry.getInstance().provide("accountRepository",  new AccountRepositoryDatabase())
	Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory())
	signup = new Signup();
	getAccount = new GetAccount();
});

test("Deve criar a conta de um passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	expect(outputGetAccount?.isPassenger).toBe(input.isPassenger);
});

test("Não deve criar a conta de um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar a conta de um passageiro duplicado", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	await signup.execute(input);
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Duplicated account"));
});

afterEach(async () => {
  const connection = Registry.getInstance().inject('databaseConnection')
  await connection.close()
})
