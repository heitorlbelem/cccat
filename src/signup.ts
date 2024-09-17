import crypto from "crypto"
import pgp from "pg-promise"
import { validateCpf } from "./validateCpf"

async function getAccountByEmail(email: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
	const [accountData] = await connection.query("select * from ccca.account where email = $1", [email])
	await connection.$pool.end()
	return accountData
}

async function getAccountById(id: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
	const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [id])
	await connection.$pool.end()
	return accountData
}

async function createAccount(account: any) {
	const { name, email, password, cpf, isDriver, isPassenger, carPlate } = account
	const id = crypto.randomUUID()
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
	await connection.query(
		"insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
		[id, name, email, cpf, carPlate, !!isPassenger, !!isDriver, password]
	)
	await connection.$pool.end()
	return { id }
}

export async function signup(input: any) { 
	const accountAlreadyExist = await getAccountByEmail(input.email)
	if (accountAlreadyExist) throw new Error("Account already exist")
	if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
	if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid e-mail")
	if (!validateCpf(input.cpf)) throw new Error("Invalid CPF")
	if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate")
	const { id } = await createAccount(input)
	return { accountId: id }
}

export async function getAccount(id: string) {
	const accountData = await getAccountById(id)
	return accountData
}
