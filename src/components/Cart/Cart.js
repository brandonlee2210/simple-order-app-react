import React from "react";

import { useContext, useState } from "react";

import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Modal from "../UI/Modal";
import Checkout from "./Checkout";

import classes from "./Cart.module.css";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);

  const [isCheckout, setIsCheckout] = useState(false);

  const totalAmount = cartCtx.totalAmount.toFixed(2);
  const hasItem = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const showCheckout = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    await fetch(
      "https://meal-35cc8-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
      {
        method: "POST",
        body: JSON.stringify({ user: userData, orderedItems: cartCtx.items }),
      }
    );

    props.onHideCart();
  };

  return (
    <Modal onClick={props.onHideCart}>
      <ul className={classes["cart-items"]}>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            price={item.price}
            amount={item.amount}
            onRemove={cartItemRemoveHandler.bind(null, item.id)}
            onAdd={cartItemAddHandler.bind(null, item)}
          />
        ))}
      </ul>
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>$ {+totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onCancel={props.onHideCart} onConfirm={submitOrderHandler} />
      )}
      {!isCheckout && (
        <div className={classes.actions}>
          <button className={classes["button--alt"]} onClick={props.onHideCart}>
            Close
          </button>
          {hasItem && (
            <button className={classes.button} onClick={showCheckout}>
              Order
            </button>
          )}
        </div>
      )}
    </Modal>
  );
};

export default Cart;
