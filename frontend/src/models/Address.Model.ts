export interface Address {
    id: string
    street: string
    postalCode: string
    appartmentNumber?: number
    city: City
    province: Province
    country: Country
}

export enum City {
    montreal = "Montreal"
}

export enum Country {
    canada = "Canada"
}

export enum Province {
    quebec = "Quebec"
}
