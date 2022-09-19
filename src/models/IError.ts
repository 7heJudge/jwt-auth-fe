export interface IError {
    response: IResponse;
}

interface IResponse {
    data: IData;
}

interface IData {
    message: string;
    errors: string[];
}
