import { Account } from "../src/domain/Account"

test("Deve criar uma conta", () => {
  const account = Account.create("John Doe", "john.doe@example.com", "01234567890", "", "123456", true, false)
  expect(account).toBeDefined()
})

test("Não deve criar uma conta com nome inválido", () => {
  expect(() => Account.create("John", "john.doe@example.com", "01234567890", "", "123456", true, false))
    .toThrow(new Error("Invalid name"))
})

test("Não deve criar uma conta com email inválido", () => {
  expect(() => Account.create("John Doe", "john.doe", "01234567890", "", "123456", true, false))
    .toThrow(new Error("Invalid email"))
})

test("Não deve criar uma conta com cpf inválido", () => {
  expect(() => Account.create("John Doe", "john.doe@example.com", "1234567890", "", "123456", true, false))
    .toThrow(new Error("Invalid cpf"))
})

test("Não deve criar uma conta com placa do carro inválida", () => {
  expect(() => Account.create("John Doe", "john.doe@example.com", "01234567890", "", "123456", false, true))
    .toThrow(new Error("Invalid car plate"))
})
