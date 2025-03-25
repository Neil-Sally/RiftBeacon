/**
 * Error classes for RiftBeacon SDK
 */

export class RiftBeaconError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RiftBeaconError';
  }
}

export class SessionExpiredError extends RiftBeaconError {
  constructor(sessionId: string) {
    super(`Session ${sessionId} has expired`);
    this.name = 'SessionExpiredError';
  }
}

export class InsufficientScoreError extends RiftBeaconError {
  constructor(current: number, required: number) {
    super(`Insufficient score: ${current} < ${required}`);
    this.name = 'InsufficientScoreError';
  }
}

export class InvalidSessionError extends RiftBeaconError {
  constructor(sessionId: string) {
    super(`Invalid session: ${sessionId}`);
    this.name = 'InvalidSessionError';
  }
}

export class NetworkError extends RiftBeaconError {
  constructor(message: string) {
    super(`Network error: ${message}`);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends RiftBeaconError {
  constructor(message: string) {
    super(`Validation error: ${message}`);
    this.name = 'ValidationError';
  }
}

