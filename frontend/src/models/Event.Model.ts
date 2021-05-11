import { Address } from './Address.Model';
import { Image } from './Image.Model';
import { Organization } from './Organization.Model';

export interface Event {
    id: string,
    title: string,
    url: string,
    address: Address,
    date: Date,
    organizer?: Organization,
    images: Image[]
    description: string
}