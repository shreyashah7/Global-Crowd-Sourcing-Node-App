'use strict';

/**
 *
 *    This method is helps with standardize the API response so the end
 *  developer always get data formated always exactly the same
 *
 */

    //
    //  Default status code for error
    //
let defaultErrorCode = 500;

//
//  Default status code for successfull operation
//
let defaultStatusCode = 200;

//
//  Default description
//
let defaultErrorDescription = {};

//
//  For use in logging statement
//
let logDividor = "----------------------------------------------------------\n";

//
//  Create the object which will store the data
//
function CustomResponse(data) {

    this.obj = {
        meta: {
            message: "Successful request"
        },
        data: {}
    };

    //
    //  Set default success status code
    //
    this.status = defaultStatusCode;

    if (data) {
        //
        //	1. Detect if we got an error object
        //
        if (data instanceof Error) {

            //
            //  Log error
            //
            console.error(logDividor + " ¯\(°_o)/¯  %s \n", data.message, data);

            //
            //	Detect if we have http code for error if not then set default
            //
            if (data.status) {

                this.setStatus(data.status);
            } else {

	            data.message = 'Internal server error';
                this.setStatus(defaultErrorCode);
            }

            //
            //	1. Build the message
            //
            this.obj = {
                message: data.message,
                description: (
                                 !data.description
                             ) ? defaultErrorDescription : data.description
            };

            //
            //  In development env description will be complete err obj
            //  for debug
            //
            if (process.env.NODE_ENV === 'development') {

                this.obj.description = data;
            }

        } else {
            //
            //	1. set the data that was passed
            //
            this.obj.data = data;
        }
    }

    //
    //	-> Return the object for chain-ability
    //
    return this;
}

//
//	Set a custom Meta
//
CustomResponse.prototype.customMeta = function(data) {
    //
    //	1. Set the custom meta object
    //
    this.obj.meta = data;

    //
    //	-> Return the object for chain-ability
    //
    return this;
}

//
//  Set a custom Http status Code
//
CustomResponse.prototype.setStatus = function(statusCode) {
    //
    //	1. Set the custom http code
    //
    this.status = statusCode;

    //
    //	-> Return the object for chain-ability
    //
    return this;
}

//
//	Return the data object
//
CustomResponse.prototype.log = function() {
    //
    //	-> Show the whole message
    //
    return this.obj;
}

//
//  Get a custom Http status code
//
CustomResponse.prototype.getStatus = function() {
    //
    //	-> Return status
    //
    return this.status;
}

module.exports = CustomResponse;
