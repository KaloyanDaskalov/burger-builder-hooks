import React from 'react';
import classes from './Order.module.css';

const order = (props) => {
    const ingredients = Object.keys(props.ingredients)
        .reduce((acc, name) => acc.concat(<span
            style={{
                textTransform: 'Capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
            }}
            key={name}>{name} ({props.ingredients[name]})</span>), []);

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredients}</p>
            <p>Price: <strong>USD {props.price.toFixed(2)}</strong></p>
        </div>
    );
}

export default order;