export class Cart {
  constructor() {
    this.cart = new Map();
    this.totalItems = 0;
  }

  changeQuantity(item, operation) {
    if (operation === -1 && !this.cart.has(item)) {
      console.log("Item not in cart");
    } else if (operation === -1 && this.cart.get(item) === 1) {
      this.cart.delete(item);
      --this.totalItems;
    } else {
      this.cart.set(item, this.cart.get(item) + operation || 1);
      this.totalItems += operation;
    }
  }

  getItemsInCart() {
    return this.cart;
  }

  getTotalItemsInCart() {
    return this.totalItems;
  }

  isCartEmpty() {
    return this.cart.size === 0;
  }
}
