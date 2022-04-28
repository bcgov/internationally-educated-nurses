import EventEmitter from 'eventemitter3';

export const emitter = new EventEmitter();

export enum IEN_EVENTS {
  UPDATE_JOB = 'update job',
}
