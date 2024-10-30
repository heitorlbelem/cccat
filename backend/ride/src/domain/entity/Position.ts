import { Coord } from "../vo/Coord";
import { UUID } from "../vo/UUID";

export class Position {
  positionId: UUID;
  rideId: UUID;
  coord: Coord;
  date: Date;

  constructor(positionId: string, rideId: string, lat: number, long: number, date: Date) {
    this.positionId = new UUID(positionId);
    this.rideId = new UUID(rideId);
    this.coord = new Coord(lat, long);
    this.date = date;
  }

  static create(rideId: string, lat: number, long: number) {
    const uuid = UUID.create();
    const date = new Date();
    return new Position(uuid.getValue(), rideId, lat, long, date);
  }
}