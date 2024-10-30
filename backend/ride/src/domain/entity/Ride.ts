import { DistanceCalculator } from "../service/DistanceCalculator";
import { Coord } from "../vo/Coord";
import { RideStatus, RideStatusFactory } from "../vo/RideStatus";
import { UUID } from "../vo/UUID";
import { Position } from "./Position";

export class Ride {
  private rideId: UUID;
  private passengerId: UUID;
  private from: Coord;
  private to: Coord;
  private status: RideStatus
  private date: Date
  private driverId?: UUID

  constructor(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, driverId: string = "") {
    this.rideId = new UUID(rideId)
    this.passengerId = new UUID(passengerId)
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
    this.status = RideStatusFactory.create(this, status)
    this.date = date
    if (driverId) this.driverId = new UUID(driverId)
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const uuid = UUID.create()
    const status = "requested"
    const date = new Date()
    return new Ride(uuid.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date)
  }

  getRideId() {
    return this.rideId.getValue()
  }

  getPassengerId() {
    return this.passengerId.getValue()
  }

  getFrom() {
    return this.from;
  }

  getTo() {
    return this.to;
  }

  getStatus() {
    return this.status.value
  }

  setStatus(status: RideStatus) {
    this.status = status 
  }

  getDate() {
    return this.date
  }

  getDriverId() {
    return this.driverId?.getValue()
  }

  accept(driverId: string) {
    this.status.accept();
    this.driverId = new UUID(driverId)
  }

  start() {
    this.status.start();
  }

  getDistance(positions: Position[]) {
    let distance = 0
    for (const [index, position] of positions.entries()) {
      const nextPosition = positions[index + 1]
      if(!nextPosition) break;
      distance += DistanceCalculator.calculate(position.coord, nextPosition.coord)
    }
    return distance;
  }
}
