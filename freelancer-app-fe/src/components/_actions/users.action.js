
export function requestLogin(state){
	return function (dispatch) {
		let temp = {
			"email":state.username,
			"password":state.password
		};
		return fetch.post("http://localhost:3001/login/", temp).then((response) => {
			if( response.data.token){
				sessionStorage.setItem('jwtToken', response.data.token);
				sessionStorage.setItem('userId', response.data.userId);
				sessionStorage.setItem('currentFileId', response.data.userId);
				dispatch({type:"loginSuccess", payload: response.data})
			}
		}).catch((err) => {
			 dispatch({type:"loginFailed", payload: err.response.data})
		})
	}
}

export function requestRegister(state){
	return function (dispatch) {
		let temp = {
			"email":state.username,
			"password":state.password,
			"firstName":state.firstName,
			"lastName":state.lastName
		};
		return fetch.post("http://localhost:3001/register/", temp).then((response) => {
			 dispatch({type:"registerSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"registerFailed", payload: err.response.data})
		})
	}
}

export function handleFileUpload(state, file){
	return function(dispatch){
		var data = new FormData();
		data.append("uploadThis", file);
		data.append("parentFolder",state.currentFileId);
		data.append("userId",state.userId);
		data.append("token",sessionStorage.getItem('jwtToken'));

		return fetch.post("http://localhost:3001/uploadFile", data).then((response) => {
			 dispatch({type:"fileUploadSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"fileUploadFailed", payload: err.response})
		})
	}
}

export function retrieveUserProfile(state){
	return function(dispatch){
		return fetch.get("http://localhost:3001/getUser?userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"retrieveUserProfileSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retrieveUserProfileFailed", payload: err.response})
		})
	}
}

export function changeUserProfile(state){
	return function(dispatch){		
		let temp = {
			"userId": sessionStorage.getItem('userId'),
			"firstName":state.firstName,
			"lastName":state.lastName,
			"userOverview":state.userOverview,
			"workData":state.workData,
			"educationData":state.educationData,
			"contactNumber":state.contactNumber,
			"interests":state.interests
		};
		return fetch.post("http://localhost:3001/updateUserData?token="+sessionStorage.getItem('jwtToken'), temp).then((response) => {
			dispatch({type:"userProfileUpdateSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"userProfileUpdateFailed", payload: err.response})
		})
	}
}