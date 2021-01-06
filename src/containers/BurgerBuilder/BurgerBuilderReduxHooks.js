import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

    const { ingredients, price, error, isAuthenticated } = useSelector(state => {
        return {
            ingredients: state.burgerBuilder.ingredients,
            price: state.burgerBuilder.totalPrice,
            error: state.burgerBuilder.error,
            isAuthenticated: state.auth.token !== null
        };
    });

    const dispatch = useDispatch();

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onPurchaseInit = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const totalIngredients = Object.values(ingredients).reduce((a, b) => a + b, 0);
        return totalIngredients > 0;
    };

    const purchasingHandler = () => {

        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseContinueHandler = () => {
        onPurchaseInit();
        props.history.push('/checkout');
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const disableInfo = { ...ingredients };

    for (const key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0;
    }

    let orderSummary = null;
    let burgerState = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (ingredients) {
        burgerState = (<Aux>
            <Burger ingredients={ingredients} />
            <BuildControls
                ingredientAdded={onIngredientAdded}
                ingredientRemoved={onIngredientRemoved}
                disabled={disableInfo}
                purchasable={updatePurchaseState(ingredients)}
                ordered={purchasingHandler}
                price={price}
                isAuth={isAuthenticated} />
        </Aux>);
        orderSummary = <OrderSummary
            ingredients={ingredients}
            price={price}
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

export default withErrorHandler(BurgerBuilder, axios);