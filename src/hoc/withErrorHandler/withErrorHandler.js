import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';
// import axios from 'axios';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {

		state = {
			error: null
		}

		componentWillMount() {
			this.reqInterceptor = axios.interceptors.request.use(req => {
				this.resInterceptor = this.setState({ error: null });
				return req;
			});
			axios.interceptors.response.use(res => res, error => {
				this.setState({ error: error });
			});
		}

		errorConfirmedHandler = () => {
			this.setState({ error: null });
		}

		componentWillUnmount() {
			axios.interceptors.request.eject(this.reqInterceptor);
			axios.interceptors.response.eject(this.reqInterceptor);
		}

		render() {
			return (
				<Aux>
					<Modal show={this.state.error}
						modalClosed={this.errorConfirmedHandler}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</Aux>
			);
		}
	}
};

export default withErrorHandler;