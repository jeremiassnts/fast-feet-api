export class InvalidPhotoTypeError extends Error {
    constructor() {
        super(`The type of file sent is invalid, try again with one of the following types: jpg, jpeg, png`)
    }
}