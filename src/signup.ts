import { IAccountDAO } from "./AccountDAO"
import { validateCpf } from "./validateCpf"

export class Signup {
	constructor(private readonly accountDAO: IAccountDAO) {
		this.accountDAO = accountDAO
	}

	async execute(input: any) { 
		const accountAlreadyExist = await this.accountDAO.getAccountByEmail(input.email)
		if (accountAlreadyExist) throw new Error("Account already exist")
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
		if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid e-mail")
		if (!validateCpf(input.cpf)) throw new Error("Invalid CPF")
		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate")
		const { id } = await this.accountDAO.createAccount(input)
		return { accountId: id }
	}
}
