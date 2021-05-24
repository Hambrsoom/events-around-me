export default interface IResult {
    destination_addresses: string[];
    results: IMeasurement[];
}

interface IMeasurement {
    distance: IDistance;
    duration: IDuration;
    stateus: string;
}

interface IDistance {
    text: string;
    value: number;
}

interface IDuration {
    text: string;
    value: number;
}
