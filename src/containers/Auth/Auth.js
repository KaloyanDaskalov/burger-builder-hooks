import React, { useEffect, useState } from 'react';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import checkValidity from '../../shared/checkValidity';
import { updateObject } from '../../store/utility';

const Auth = props => {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Mail Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        },
    });
    const [isSignup, setIsSignup] = useState(true);

    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                valid: checkValidity(
                    event.target.value,
                    authForm[controlName].validation
                ),
                touched: true
            })
        });
        setAuthForm(updatedControls);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, authForm.isSignup);
    };

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    };

    const formElementsArray = [];
    for (const key in authForm) {
        formElementsArray.push({ id: key, config: authForm[key] });
    }

    const form = formElementsArray.map(formElement =>
    (<Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation.required}
        touched={formElement.config.touched}
        changed={(event) => inputChangedHandler(event, formElement.id)} />));

    return (
        <div className={classes.Auth} >
            {props.isAuthenticated ? <Redirect to={props.authRedirectPath} /> : null}
            {props.error ? <p style={{ color: 'red', fontWeight: 'bold' }}>{props.error.message}</p> : null}
            <form onSubmit={submitHandler}>
                {props.loading ? <Spinner /> : form}
                <Button btnType="Success" >SUBMIT</Button>
            </form>
            <Button btnType='Danger'
                clicked={switchAuthModeHandler}
            >SWITCH TO {isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const dispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, dispatchToProps)(Auth);