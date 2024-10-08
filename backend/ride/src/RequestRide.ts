import { AccountRepository } from "./AccountRepository";
import { inject } from "./DI";
import { Ride } from "./Ride";
import { RideRepository } from "./RideRepository";

export default class RequestRide {
	@inject("accountRepository")
	accountRepository?: AccountRepository
  @inject("rideRepository")
  rideRepository?: RideRepository

	async execute (input: Input) {
    const account = await this.accountRepository?.getAccountById(input.passengerId)
    if(!account) throw new Error("Account not found")
    if(!account.isPassenger) throw new Error("Must be a passenger")
    const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong)
    await this.rideRepository?.saveRide(ride)
    return {
      rideId: ride.getRideId()
    }
	}
}

type Input = {
  passengerId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
}