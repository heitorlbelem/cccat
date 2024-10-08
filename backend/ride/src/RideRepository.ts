import pgp from "pg-promise";
import { Ride } from "./Ride";

// Port
export interface RideRepository {
	getRideById (rideId: string): Promise<Ride | undefined>;
	saveRide (ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
  async getRideById(rideId: string): Promise<Ride | undefined> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [rideData] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
    if(!rideData) throw new Error("Ride not found")
    return new Ride(
      rideData.ride_id,
      rideData.passenger_id,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.status,
      rideData.date
    )
  }

  async saveRide(ride: Ride): Promise<void> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query(`
      insert into ccca.ride
      (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date)
      values ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        ride.getRideId(), ride.getPassengerId(),
        ride.getFrom().getLat(), ride.getFrom().getLong(),
        ride.getTo().getLat(), ride.getTo().getLong(),
        ride.getStatus(), ride.getDate()
      ]
    );
		await connection.$pool.end();
  }
}