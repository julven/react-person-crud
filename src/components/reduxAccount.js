import { createContext } from 'react';
import { createStore } from 'redux'

let reduxAccountContext = createContext();

let reduxAccount = {
	logged: false,
	fname: "",
	lname: "",
	bday: "",
	gender: "",
	email: "",
	token: "",
	image: "",
	id: "",
	form: {
		fname: "",
		lname: "",
		bday: "",
		gender: "",
		email: "",
		token: "",
		image: "",
	},
	alert: {
		success: false,
		error: false,
	}
};

let reduxAccountReducer = (state = reduxAccount, { type, payload }) => {
	let newState = {};
	let form = {};
	let alert = {}
	switch (type) {
		case "ACCOUNT_SET":
			newState = { ...state }
			Object.keys(payload).forEach(x => newState[x] = payload[x])
			// console.log(newState)
			return newState;
		case "ACCOUNT_CLEAR":
			newState = { ...state }
			
			Object.keys(newState).forEach(x => {
				if (x === 'logged') newState[x] = false
				else if (x === "form" ) return;
				else if (x === 'alert') return;
				else newState[x] = ""
			})
			console.log({clear: newState})
			return newState;
		case "ACCOUNT_FORM_CLEAR": 
			form = { ...state.form}
			Object.keys(form).forEach( x => form[ x ] = "" )
			newState = {
				...state,
				form
			}
			return newState;
		case "ACCOUNT_FORM_SET": 
			form = {...state};
			delete form.form
			delete form.token
			delete form.logged
			delete form.alert
			newState = {
				...state,
				form
			}
			console.log({newState})
			return newState;
		case "ACCOUNT_FORM_CHANGE": 
			form = {...state.form }
			form[ payload.field ] = payload.value

			newState = {
				...state,
				form
			}
			return newState;
		case "ACCOUNT_ALERT_SUCCESS_SET":
			alert = {...state.alert}
			alert.success = payload;

			newState = {
				...state,
				alert
			}

			return newState;
			case "ACCOUNT_ALERT_ERROR_SET":
				alert = {...state.alert}
				alert.error = payload;
	
				newState = {
					...state,
					alert
				}
	
				return newState;
		default: return state;
	}
}

let reduxAccountStore = createStore(reduxAccountReducer);

let reduxAccountState = state => {
	return { accountState: state };
}
let reduxAccountDispatch = dispatch => {
	return {
		accountSetter: {
			accountSet: data => { dispatch({ type: "ACCOUNT_SET", payload: data }) },
			accountClear: () => { dispatch({ type: "ACCOUNT_CLEAR" }) },
			accountFormClear: () => { dispatch({ type: "ACCOUNT_FORM_CLEAR" }) },
			accountFormSet: () => { dispatch({ type: "ACCOUNT_FORM_SET" }) },
			accountFormChange: data => { dispatch({ type: "ACCOUNT_FORM_CHANGE", payload: data }) },
			accountAlertSuccessSet: data => { dispatch({ type: "ACCOUNT_ALERT_SUCCESS_SET", payload: data }) },
			accountAlertErrorSet: data => { dispatch({ type: "ACCOUNT_ALERT_ERROR_SET", payload: data }) }
		}
	}
}

export {
	reduxAccount,
	reduxAccountContext,
	reduxAccountReducer,
	reduxAccountStore,
	reduxAccountState,
	reduxAccountDispatch
}