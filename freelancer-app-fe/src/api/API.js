import * as UserHelper from '../components/_helper/helper';
const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const login = (payload) =>
    fetch(`${api}/login`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const logout = (payload) =>
    fetch(`${api}/logout`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const signUp = (payload) =>
    fetch(`${api}/signup`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getUserDetails = (payload) =>
    fetch(`${api}/user/` + payload, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const updateUser = (id, user) =>
    fetch(`${api}/user/` + id, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });
export const getLoggedInUserProjects = (userInfo) =>
    fetch(`${api}/userprojects`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userInfo)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });
export const postProject = (projectData) =>
    fetch(`${api}/project`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getTotalAmt = (projectData) =>
    fetch(`${api}/payedamount`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const hireFreelancer = (projectData) =>
    fetch(`${api}/project`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });
export const getProjectById = (projectId) =>
    fetch(`${api}/project/` + projectId, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });
export const getSkills = () =>
    fetch(`${api}/skills`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getTransactionHistory = (data) =>
    fetch(`${api}/transactionhistory`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getOpenProjects = () =>
    fetch(`${api}/projects`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const uploadProjectFiles = (formData) =>
    fetch(`${api}/uploadfile`, {
        method: 'POST',
        headers: {
            ...headers
        },
        credentials: 'include',
        body: formData
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const downloadProjectFiles = (fileName) =>
    fetch(`${api}/downloadfile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(fileName)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const savePaymentDetails = (paymentObj) =>
    fetch(`${api}/payment`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(paymentObj)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });
export const withdrawMoney = (paymentObj) =>
    fetch(`${api}/withdraw`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(paymentObj)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getTransactionCount = (paymentObj) =>
    fetch(`${api}/transactioncount`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(paymentObj)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getSearchedProjects = (searchStrng) =>
    fetch(`${api}/searchprojects/` + searchStrng, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getProjectsBySkills = (skills) =>
    fetch(`${api}/skillproject`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(skills)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const placeBid = (userProjectInfo) =>
    fetch(`${api}/placebid`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userProjectInfo)
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

export const getAllBidsByProject = (projectId) =>
    fetch(`${api}/bids/` + projectId, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => {
        return successHandler(res);
    }).catch(error => {
        return error;
    });

let successHandler = (res) => {
    if (res.status === 401) {
        UserHelper.redirectToLogin();
    } else {
        return res.json();
    }
}