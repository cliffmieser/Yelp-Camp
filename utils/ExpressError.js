class ExpressError extends Error{
    constructor(message, statusCode){
        super(); //calls error constructor
        this.message = message;
        this.status = statusCode;
    }
}

module.exports = ExpressError;