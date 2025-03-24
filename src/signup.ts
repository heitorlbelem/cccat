import crypto from 'node:crypto'
import pgp from 'pg-promise'
import { validateCpf } from './validateCpf'
import type { AccountDAO } from './accountDAO'

interface CreateAccountInput {
  name: string
  cpf: string
  email: string
  password: string
  carPlate?: string
  isPassenger?: boolean
  isDriver?: boolean
}

export class Signup {
  constructor(private readonly signupData: SignupData) {}

  async execute(input: CreateAccountInput): Promise<{ id: string }> {
    const id = crypto.randomUUID()
    const existingAccount = await this.signupData.getAccountByEmail(input.email)
    if (existingAccount) throw new Error('Email already in use')
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name')
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email')
    if (!validateCpf(input.cpf)) throw new Error('Invalid cpf')
    if (input.isDriver && input.carPlate && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error('Invalid car plate')
    await this.signupData.saveAccount({
      id,
      name: input.name,
      cpf: input.cpf,
      email: input.email,
      carPlate: input.carPlate,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
      password: input.password,
    })
    return { id }
  }
}

export interface SignupData {
  saveAccount(account: any): Promise<void>
  getAccountByEmail(email: string): Promise<any>
}
