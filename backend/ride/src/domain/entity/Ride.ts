import { Coord } from "../vo/Coord";
import { UUID } from "../vo/UUID";

export class Ride {
  private rideId: UUID;
  private passengerId: UUID;
  private from: Coord;
  private to: Coord;
  private status: string
  private date: Date
  private driverId?: UUID

  constructor(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, driverId: string = "") {
    this.rideId = new UUID(rideId)
    this.passengerId = new UUID(passengerId)
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
    this.status = status
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
    return this.status
  }

  setStatus(newStatus: string) {
    this.status = newStatus
  }

  getDate() {
    return this.date
  }

  getDriverId() {
    return this.driverId?.getValue()
  }

  setDriverId(driverId: string) {
    this.driverId = new UUID(driverId)
  }
}