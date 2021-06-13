import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxAccountState, reduxAccountDispatch, reduxAccountContext } from './reduxAccount';
import { reduxListContext, reduxListDispatch, reduxListState } from './reduxList';

let withConnect = Component => {

	Component = compose(
		connect(reduxAccountState, reduxAccountDispatch, null, { context: reduxAccountContext }),
		connect(reduxListState, reduxListDispatch, null, { context: reduxListContext })
	)(Component)


	return Component;

}

export { withConnect }