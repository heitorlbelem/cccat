import type { AccountDAO } from './accountDAO'

export class GetAccount {
  constructor(private readonly accountDAO: AccountDAO) {}

  async execute(id: string): Promise<any> {
    const account = await this.accountDAO.getAccountById(id)
    if (!account) throw new Error('Account not found')
    return account
  }
}
