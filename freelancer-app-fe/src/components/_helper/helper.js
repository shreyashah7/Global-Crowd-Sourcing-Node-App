// Get User and loggedIn status whenever needed
var valid = require('card-validator');

export const getUserObject = () => {
    return !!window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : {};
}
export const setUserObject = (userObject) => {
    window.localStorage.setItem('user', JSON.stringify(userObject));
}
export const getLoggedInStatus = () => {
    return !!window.localStorage.getItem('isLoggedIn') ? Boolean(window.localStorage.getItem('isLoggedIn')) : false;
}
export const setLoggedInStatus = (loggedInStatus) => {
    window.localStorage.setItem('isLoggedIn', loggedInStatus);
}
export const redirectToLogin = () => {
    localStorage.clear();
    this.props.location.push("/");
}
export const getJobType = (jobType) => {
    if (jobType === 'HOURLY') {
        return 'Hr';
    } else {
        return 'Fixed';
    }
}

export const validateCardNumber = (creditCardNumber) => {
    if (!!creditCardNumber) {
        return valid.number(creditCardNumber).isValid;
    } else {
        return false;
    }
}

export const validateExpiration = (expiration) => {
    if (!!expiration) {
        var expirationObj = valid.expirationDate(expiration);
        return valid.expirationMonth(expirationObj.month).isValid && valid.expirationYear(expirationObj.year).isValid;
    } else {
        return false;
    }
}

export const validateCardCvv = (cardCvv) => {
    if (!!cardCvv) {
        return valid.cvv(cardCvv).isValid;
    } else {
        return false;
    }
}