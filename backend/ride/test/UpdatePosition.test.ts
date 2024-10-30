import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Registry } from "../src/infra/di/DI";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import Signup from "../src/application/usecase/Signup";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepository";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

// Integration Narrow -> Broad
beforeEach(() => {
  Registry.getInstance().provide("databaseConnection",  new PgPromiseAdapter())
	Registry.getInstance().provide("accountRepository",  new AccountRepositoryDatabase())
	Registry.getInstance().provide("rideRepository",  new RideRepositoryDatabase())
	Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory())
  Registry.getInstance().provide("positionRepository", new PositionRepositoryDatabase())
	signup = new Signup();
  requestRide = new RequestRide();
  getRide = new GetRide();
  acceptRide = new AcceptRide();
  startRide = new StartRide();
  updatePosition = new UpdatePosition();
});

test("Deve atualizar as posições em uma corrida", async function () {
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
	const inputStartRide = { 
		rideId: outputRequestRide.rideId
	}
	await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -23.5505,
    long: -46.6333,
  }
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -23.4605,
    long: -46.5333,
  }
  const inputUpdatePosition3 = {
    rideId: outputRequestRide.rideId,
    lat: -23.5505,
    long: -46.6333,
  }
  const inputUpdatePosition4 = {
    rideId: outputRequestRide.rideId,
    lat: -23.4605,
    long: -46.5333,
  }
  await updatePosition.execute(inputUpdatePosition1);
  await updatePosition.execute(inputUpdatePosition2);
  await updatePosition.execute(inputUpdatePosition3);
  await updatePosition.execute(inputUpdatePosition4);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.distance).toBe(42)
});

afterEach(async () => {
  const connection = Registry.getInstance().inject('databaseConnection')
  await connection.close()
})
