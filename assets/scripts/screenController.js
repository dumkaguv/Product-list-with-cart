export class ScreenController {
  constructor(menu, cart) {
    this.menu = menu;
    this.cart = cart;
    this.initialButtonContentHTML = "";
    this.initialCartContentHTML = "";
  }

  init() {
    this.initEvents();

    this.menu.addItems().then(() => {
      this.renderMenu();
    });

    // this.renderCart();
  }

  initEvents() {
    const menuListUl = document.querySelector(".dessert__list");

    menuListUl.addEventListener(
      "mouseenter",
      (event) => this.toggleButtonContent(event, "mouseenter"),
      true
    );

    menuListUl.addEventListener(
      "mouseleave",
      (event) => this.toggleButtonContent(event, "mouseleave"),
      true
    );

    menuListUl.addEventListener(
      "click",
      (event) => this.handleMouseClick(event, "click"),
      true
    );

    menuListUl.addEventListener(
      "keydown",
      (event) => {
        if (event?.key === "Enter" && event?.target) {
          this.toggleButtonContent(event, "mouseenter");
          this.handleMouseClick(event, "click");
        }
      },
      true
    );
  }

  toggleButtonContent(event, action) {
    const target = event?.target;

    // target === cartButton
    if (target?.classList?.contains("dessert__list-item-buy")) {
      if (action === "mouseenter") {
        this.handleMouseEnter(target);
      } else if (action === "mouseleave") {
        this.handleMouseLeave(target);
      }
    }
  }

  handleMouseEnter(cartButton) {
    if (!this.initialButtonContentHTML) {
      this.initialButtonContentHTML = cartButton.innerHTML;
    }
    const currentQuantity =
      cartButton?.querySelector(".current-quantity")?.textContent || 0;
    const itemImage = cartButton?.previousElementSibling;
    console.log(itemImage);

    cartButton.innerHTML =
      this.changeButtonContentOnMouseOver(currentQuantity);
    cartButton.style.justifyContent = "space-between";
    cartButton.style.color = "white";
    cartButton.style.backgroundColor = "var(--color-accent-light)";
    itemImage.style.border = "3px solid var(--color-accent-light)";
  }

  handleMouseLeave(cartButton) {
    if (
      cartButton?.querySelector(".current-quantity")?.textContent > "0"
    ) {
      return;
    }
    const itemImage = cartButton?.previousElementSibling;

    cartButton.innerHTML = this.initialButtonContentHTML;
    cartButton.style.justifyContent = "center";
    cartButton.style.color = "black";
    cartButton.style.backgroundColor = "white";
    itemImage.style.border = "";
  }

  changeButtonContentOnMouseOver(currentQuantity) {
    return `
      <img src="./assets/images/icon-decrement-quantity.svg" alt="add to cart icon" class="decrement-quantity" tabindex="0"/>
      <div class="current-quantity">${currentQuantity}</div>
      <img src="./assets/images/icon-increment-quantity.svg" alt="remove from cart icon" class="increment-quantity" tabindex="0" />
    `;
  }

  handleMouseClick(event) {
    const buttonQuantity = event?.target;
    const itemId = buttonQuantity?.parentElement?.dataset?.itemId;
    const currentQuantityDiv =
      buttonQuantity?.parentElement?.querySelector(".current-quantity");
    const currentItem = this.menu.getItems()[itemId];

    if (buttonQuantity?.classList?.contains("increment-quantity")) {
      this.cart.changeQuantity(currentItem, +1);
      this.renderCurrentQuantity(currentQuantityDiv, currentItem);
      this.renderCart();
      console.log(this.cart.getItemsInCart());
    } else if (buttonQuantity?.classList?.contains("decrement-quantity")) {
      this.cart.changeQuantity(currentItem, -1);
      this.renderCurrentQuantity(currentQuantityDiv, currentItem);
      this.renderCart();
      console.log(this.cart.getItemsInCart());
    }
  }

  renderCurrentQuantity(currentQuantityDiv, currentItem) {
    const currentQuantity =
      this.cart.getItemsInCart().get(currentItem) || 0;
    currentQuantityDiv.textContent = currentQuantity;
  }

  renderMenu() {
    const items = this.menu.items;
    const menuList = document.querySelector(".dessert__list");
    const documentFragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const category = item.category || "Error";
      const name = item.name || "Error";
      const price = parseFloat(item.price).toFixed(2) || "Error";
      const pathToImage = item.image?.desktop || "Error";

      const template = this.getItemTemplate(
        category,
        name,
        price,
        pathToImage,
        index
      );
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = template;

      documentFragment.appendChild(tempDiv.firstElementChild);
    });

    menuList.appendChild(documentFragment);
  }

  getItemTemplate(category, name, price, pathToImage, index) {
    return `
      <li class="dessert__list-item">
        <div class="dessert__list-item-wrapper">
          <img class="dessert__list-item-image" src="${pathToImage}" alt="${name}" loading="lazy" />
          <button class="dessert__list-item-buy button button-to-cart" data-item-id="${index}" tabindex="0">
            <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart icon" />
            Add to Cart
          </button>
        </div>
        <div class="dessert__list-item-info">
          <div class="dessert__list-item-category">${category}</div>
          <div class="dessert__list-item-name">${name}</div>
          <div class="dessert__list-item-price">$${price}</div>
        </div>
      </li>
    `;
  }

  renderCart() {
    const cartDiv = document.querySelector(".cart");

    this.renderCartItems(cartDiv);
    this.renderTotalItemsInCart(cartDiv);
  }

  renderCartItems(cartDiv) {
    const cartList = cartDiv.querySelector(".cart__list");

    if (!this.initialCartContentHTML) {
      this.initialCartContentHTML = cartList.innerHTML;
    }

    if (this.cart.isCartEmpty()) {
      cartList.innerHTML = this.initialCartContentHTML;
    } else if (!this.cart.isCartEmpty()) {
      if (this.cart.totalItems === 1) {
        cartList.innerHTML = "";
      }

      cartList.insertAdjacentHTML("beforeend", this.getItemCartTemplate());
    }

    console.log(this.initialCartContentHTML);
  }

  renderTotalItemsInCart(cartDiv) {
    const countDiv = cartDiv.querySelector(".cart__title");
    countDiv.innerHTML = `Your Cart (${this.cart.getTotalItemsInCart()})`;
  }

  getItemCartTemplate(name, quantity, price, totalPrice) {
    return `
      <li class="cart__list-item">
        <div class="cart__list-item-title">${name}</div>
        <div class="cart__list-item-info">
          <div class="cart__list-item-quantity">${quantity}x</div>
          <div class="cart__list-item-prices">
            <div class="cart__list-item-price">@ $${price}</div>
            <div class="cart__list-item-totalPrice">$${totalPrice}</div>
          </div>
          <button
            type="button"
            class="cart__list-item-remove-button"
          >
            <img
              src="./assets/images/icon-remove-item.svg"
              class="cart__list-item-remove-button-image"
              alt="remove button icon"
            />
          </button>
        </div>
      </li>
    `;
  }
}

/*
          <div class="cart__footer">
            <div class="cart__footer-totalPrice">
              <div class="cart__footer-totalPrice-text">Order Total</div>
              <div class="cart__footer-totalPrice-value">$5.50</div>
            </div>
            <div class="cart__footer-ecology">
              <img
                src="./assets/images/icon-carbon-neutral.svg"
                class="cart__footer-ecology-icon"
                alt="carbon neutral delivery icon"
              />
              <div class="cart__footer-ecology-text">
                This is a&nbsp;<b>carbon-neutral</b>&nbsp;delivery
              </div>
            </div>
            <button type="button" class="cart__footer-confirmOrder button">
              Confirm Order
            </button>
          </div>
        </div>
*/
