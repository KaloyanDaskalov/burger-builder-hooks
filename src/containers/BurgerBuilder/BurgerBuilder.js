import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BurgerControls/BurgerControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false);

    const { onInitIngredients } = props;

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const totalIngredients = Object.values(ingredients).reduce((a, b) => a + b, 0);
        return totalIngredients > 0;
    };

    const purchasingHandler = () => {

        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseContinueHandler = () => {
        props.onPurchaseInit();
        props.history.push('/checkout');
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const disableInfo = { ...props.ings };

    for (const key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0;
    }

    let orderSummary = null;
    let burgerState = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (props.ings) {
        burgerState = (<Aux>
            <Burger ingredients={props.ings} />
            <BuildControls
                ingredientAdded={props.onIngredientAdded}
                ingredientRemoved={props.onIngredientRemoved}
                disabled={disableInfo}
                purchasable={updatePurchaseState(props.ings)}
                ordered={purchasingHandler}
                price={props.price}
                isAuth={props.isAuthenticated} />
        </Aux>);
        orderSummary = <OrderSummary
            ingredients={props.ings}
            price={props.price}
            purchaseContinued={purchaseContinueHandler}
            purchaseCancelled={purchaseCancelHandler} />;
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burgerState}
        </Aux>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onPurchaseInit: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));