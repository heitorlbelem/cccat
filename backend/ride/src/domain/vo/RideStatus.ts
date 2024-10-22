import { Ride } from "../entity/Ride";

export interface RideStatus {
  value: string;

  request(): void;
  accept(): void;
  start(): void;
}

class RequestedStatus implements RideStatus {
  value: string;

  constructor(readonly ride: Ride) {
    this.value = "requested"
  }

  request() {
    throw new Error("Invalid status");
  }

  accept() {
    this.ride.setStatus(new AcceptedStatus(this.ride))
  }

  start() {
    throw new Error("Invalid status");
  }
}

class AcceptedStatus implements RideStatus {
  value: string;

  constructor(readonly ride: Ride) {
    this.value = "accepted"
  }

  request() {
    throw new Error("Invalid status");
  }

  accept() {
    throw new Error("Invalid status");
  }

  start() {
    this.ride.setStatus(new InProgressStatus(this.ride))
  }
}

class InProgressStatus implements RideStatus {
  value: string;

  constructor(readonly ride: Ride) {
    this.value = "in_progress"
  }

  request() {
    throw new Error("Invalid status");
  }

  accept() {
    throw new Error("Invalid status");
  }

  start() {
    throw new Error("Invalid status");
  }
}

export class RideStatusFactory {
  static create(ride: Ride, status: string) {
    if(status === 'requested') return new RequestedStatus(ride);
    if(status === 'accepted') return new AcceptedStatus(ride);
    if(status === 'in_progress') return new InProgressStatus(ride);
    throw new Error("Invalid status")
  }
}