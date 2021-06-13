import { createContext } from 'react';
import { createStore } from 'redux'
import { IMAGE_HOLDER_100 } from "./CONSTANTS";

let reduxListContext = createContext();
let reduxList = {
	list: [
		{
			fname: "adam",
			lname: "watson",
            gender: "male",
            bday: "2001-01-01",
            status: "single",
            image: IMAGE_HOLDER_100,
			id: Math.random().toString(36).substring(7)
		},
	],
	view: {
		fname: "",
		lname: "",
		gender: "",
		status: "",
		bday: "",
		image: "",
		id:""
	},
	page: {
		total: 0,
		current: 0,
		rows: 0
	},
	search: {
		search: "",
		name: "",
		status: "",
		gender: "",
	}
}

let reduxListReducer = (state = reduxList, { type, payload }) => {

	let newView = {};
	let newPage = {};
	let newSearch = {};
	switch (type) {
		case "LIST_SET" : 
			return { ...state, list: payload }
		case "LIST_ADD" : 
			let newList = [ ...state.list, payload ];
			return { ...state, list: newList };
		case "LIST_DELETE" : 
			let newlist = [];
			state.list.forEach( x => x.id != payload.id && newlist.push(x));
			// console.log(newlist);
			// return state;
			return { ...state, list: newlist };
		case "LIST_VIEW_SET" : 
			return { ...state, view: payload }
		case "LIST_VIEW_CLEAR": 
			newView = {...state.view }
			Object.keys(newView).forEach( x => newView[ x ] = "" )
			return { ...state, view: newView };
		case "LIST_VIEW_CHANGE": 
			newView = { ...state.view }
			newView[ payload.field ] = payload.value
			return { ...state, view: newView };
		case "LIST_SET_PAGE":
			 payload.current = Number(payload.current)
			return {...state, page: payload}
		case "LIST_PAGE_CHANGE":
			newPage = {...state.page}
			newPage[ payload.field ] = payload.value
			// console.log({reduxPage: newPage})
			return {...state, page: newPage}
		case "LIST_SEARCH_CHANGE":
			newSearch = { ...state.search }
			newSearch[ payload.field ] = payload.value
			return {...state, search: newSearch}
		default: return state;
	}
}

let reduxListStore = createStore(reduxListReducer);

let reduxListState = state => {
	return { listState: state };
}

let reduxListDispatch = dispatch => {
	return {
		listSetter: {
			listSet: data => { dispatch({ type: "LIST_SET", payload: data }) },
			listAdd: data => { dispatch({ type: "LIST_ADD", payload: data }) },
			listDelete: data => { dispatch({ type: "LIST_DELETE", payload: data }) },
			listViewClear: () => { dispatch({ type: "LIST_VIEW_CLEAR" }) },
			listViewSet: data => { dispatch({ type: "LIST_VIEW_SET", payload: data }) },
			listViewChange: data => { dispatch({ type: "LIST_VIEW_CHANGE", payload: data }) },
			listSetPage: data => { dispatch ( {type: "LIST_SET_PAGE", payload: data})},
			listPageChange: data => { dispatch ( {type: "LIST_PAGE_CHANGE", payload: data})},
			listSearchChange: data => { dispatch ( {type: "LIST_SEARCH_CHANGE", payload: data})}
		}
	}
}

export { 
    reduxList,
    reduxListContext,
    reduxListReducer,
    reduxListStore,
    reduxListDispatch,
    reduxListState
}