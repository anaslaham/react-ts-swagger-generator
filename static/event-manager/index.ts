import { EventEmitter } from "events";

const eventManager = new EventEmitter();

export default eventManager;

export const EVENT_UNAUTHORIZED = "event-unauthorized";
