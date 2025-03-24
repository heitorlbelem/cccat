import type { AccountDAO } from './accountDAO'

export class GetAccount {
  constructor(private readonly getAccountData: GetAccountData) {}

  async execute(id: string): Promise<any> {
    const account = await this.getAccountData.getAccountById(id)
    if (!account) throw new Error('Account not found')
    return account
  }
}

export interface GetAccountData {
  getAccountById(id: string): Promise<any>
}
