import { IAccountDAO } from "./AccountDAO"

export class GetAccount {
    constructor(private readonly accountDAO: IAccountDAO) {
        this.accountDAO = accountDAO
    }

    async execute(id: string) {
        const accountData = await this.accountDAO.getAccountById(id)
        return accountData
    }
}

