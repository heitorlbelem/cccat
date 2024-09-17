import crypto from "crypto"
import pgp from "pg-promise"

export interface IAccountDAO {
	getAccountByEmail(email: string): Promise<any>
	getAccountById(id: string): Promise<any>
	createAccount(account: any): Promise<any>
}

export class AccountDAODatabase implements IAccountDAO {
	async getAccountByEmail(email: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
        const [accountData] = await connection.query("select * from ccca.account where email = $1", [email])
        await connection.$pool.end()
        return accountData
    }

	async getAccountById(id: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
        const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [id])
        await connection.$pool.end()
        return accountData
    }

    async createAccount(account: any) {
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
}

export class AccountDAOInMemory implements IAccountDAO {
    accounts: any[]

    constructor() {
        this.accounts = []
    }

    async getAccountByEmail(email: string) {
        return this.accounts.find(account => account.email === email)
    }

    async getAccountById(id: string) {
        return this.accounts.find(account => account.id === id)
    }

    async createAccount(account: any) {
        const id = crypto.randomUUID()
        this.accounts.push({ id, ...account })

        return { id }
    }
}
