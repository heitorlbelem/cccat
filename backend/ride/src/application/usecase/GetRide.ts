import { inject } from "../../infra/di/DI";
import { RideRepository } from "../../infra/repository/RideRepository";

export default class GetRide {
	@inject("rideRepository")
	rideRepository?: RideRepository

	async execute (rideId: string) {
    const ride = await this.rideRepository?.getRideById(rideId)
    if(!ride) throw new Error("Ride not found");

    return {
      rideId: ride.getRideId(),
      passengerId: ride.getPassengerId(),
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      status: ride.getStatus(),
    }
	}
}