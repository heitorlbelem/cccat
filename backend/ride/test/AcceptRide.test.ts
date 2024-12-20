import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Registry } from "../src/infra/di/DI";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import Signup from "../src/application/usecase/Signup";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import AcceptRide from "../src/application/usecase/AcceptRide";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

// Integration Narrow -> Broad
beforeEach(() => {
  Registry.getInstance().provide("databaseConnection",  new PgPromiseAdapter())
	Registry.getInstance().provide("accountRepository",  new AccountRepositoryDatabase())
	Registry.getInstance().provide("rideRepository",  new RideRepositoryDatabase())
	Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory())
	signup = new Signup();
  requestRide = new RequestRide();
  getRide = new GetRide();
  acceptRide = new AcceptRide();
});

test("Deve aceitar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isDriver: true,
    carPlate: 'AAA9452'
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -23.5505,
    toLat: -23.4605,
    fromLong: -46.6333,
    toLong: -46.5333
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId
  }
  await acceptRide.execute(inputAcceptRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('accepted')
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId)
});

test("Não deve aceitar uma corrida que já foi aceita", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isDriver: true,
    carPlate: 'AAA9452'
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -23.5505,
    toLat: -23.4605,
    fromLong: -46.6333,
    toLong: -46.5333
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId
  }
  await acceptRide.execute(inputAcceptRide)
  expect(async () => await acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Invalid status"));
  
});

afterEach(async () => {
  const connection = Registry.getInstance().inject('databaseConnection')
  await connection.close()
})
