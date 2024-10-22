import { AccountRepository } from "../../infra/repository/AccountRepository"
import { inject } from "../../infra/di/DI"
import { RideRepository } from "../../infra/repository/RideRepository"

export default class AcceptRide {
	@inject("accountRepository")
	accountRepository?: AccountRepository
  @inject("rideRepository")
  rideRepository?: RideRepository

	async execute (input: Input) {
    const account = await this.accountRepository?.getAccountById(input.driverId);
    if(!account) throw new Error("Account not found");
    if(!account.isDriver) throw new Error("Account must be from a driver");
    const ride = await this.rideRepository?.getRideById(input.rideId);
    if(!ride) throw new Error();
    if(ride.getStatus() !== 'requested') throw new Error("Invalid status")
    ride.setStatus("accepted");
    ride.setDriverId(input.driverId);
    await this.rideRepository?.updateRide(ride);
	}
}

type Input = {
  rideId: string,
  driverId: string
}