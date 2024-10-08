import { AccountRepositoryDatabase } from "../src/AccountRepository";
import { Registry } from "../src/DI";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import { MailerGatewayMemory } from "../src/MailerGateway";
import RequestRide from "../src/RequestRide";
import { RideRepositoryDatabase } from "../src/RideRepository";
import Signup from "../src/Signup";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

// Integration Narrow -> Broad
beforeEach(() => {
	Registry.getInstance().provide("accountRepository",  new AccountRepositoryDatabase())
	Registry.getInstance().provide("rideRepository",  new RideRepositoryDatabase())
	Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory())
	signup = new Signup();
  requestRide = new RequestRide();
  getRide = new GetRide();
});

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.5505,
    toLat: -23.4605,
    fromLong: -46.6333,
    toLong: -46.5333
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat)
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat)
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong)
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong)
  expect(outputGetRide.status).toBe("requested")
});

test("Não deve solicitar uma corrida se a conta não for de passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
    carPlate: 'AAA9999',
		isDriver: true
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.5505,
    toLat: -23.4605,
    fromLong: -46.6333,
    toLong: -46.5333
  }
  await expect(() => requestRide.execute(inputRequestRide)).rejects
    .toThrow(new Error("Must be a passenger"))
});
