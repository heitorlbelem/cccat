import pgp from 'pg-promise'

export interface AccountDAO {
  getAccountByEmail(email: string): Promise<any>
  getAccountById(id: string): Promise<any>
  saveAccount(account: any): Promise<void>
}

export class AccountDAODatabase implements AccountDAO {
  async getAccountByEmail(email: string): Promise<any> {
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
    const [account] = await connection.query('select * from ccca.account where email = $1', [email])
    await connection.$pool.end()
    return account
  }

  async getAccountById(id: string): Promise<any> {
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
    const [account] = await connection.query('select * from ccca.account where account_id = $1', [id])
    await connection.$pool.end()
    return account
  }

  async saveAccount(account: any): Promise<void> {
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
    await connection.query(
      'insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        account.id,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
        account.password,
      ]
    )
    await connection.$pool.end()
  }
}

export class AccountDAOMemory implements AccountDAO {
  accounts: any[] = []

  async getAccountByEmail(email: string): Promise<any> {
    return this.accounts.find((account: any) => account.email === email)
  }

  async getAccountById(accountId: string): Promise<any> {
    return this.accounts.find((account: any) => account.id === accountId)
  }

  async saveAccount(account: any): Promise<void> {
    this.accounts.push(account)
  }
}
