import { Event } from './Event.Model';
import { Address } from './Address.Model';

export interface Organization {
    id: string,
    name: string,
    url: string,
    address: Address,
    events?: Event[],

}