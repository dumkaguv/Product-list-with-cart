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
    const cart = document.querySelector(".cart");
    const modal = document.getElementById("confirmOrder");

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

    cart.addEventListener(
      "click",
      (event) => this.deleteItemFromCart(event),
      true
    );

    cart.addEventListener(
      "click",
      (event) => this.verifyIsModalConfirmation(event),
      true
    );

    modal.addEventListener(
      "click",
      (event) => this.closeModal(modal, event),
      true
    );
  }

  toggleButtonContent(event, action) {
    const target = event?.target;

    // target === cartButton
    if (target?.classList?.contains("dessert__list-item-buy")) {
      if (action === "mouseenter") {
        this.handleMouseEnter(event, target);
      } else if (action === "mouseleave") {
        this.handleMouseLeave(target);
      }
    }
  }

  verifyIsModalConfirmation(event) {
    const isConfirmOrderButton = event?.target?.classList?.contains(
      "cart__footer-confirmOrder"
    );
    if (isConfirmOrderButton) {
      const confirmationModal = document.getElementById("confirmOrder");
      if (confirmationModal.style.display !== "block") {
        this.showModal(confirmationModal);
      }
    }
  }

  showModal(modalId) {
    modalId.style.display = "block";
  }

  closeModal(modalId, event) {
    const isClickOutsideModalContent =
      event?.target?.classList?.contains("confirm-order");
    if (isClickOutsideModalContent) {
      modalId.style.display = "none";
    }
  }

  handleMouseEnter(event, cartButton) {
    if (!this.initialButtonContentHTML) {
      this.initialButtonContentHTML = cartButton.innerHTML;
    }

    const currentQuantity =
      cartButton?.querySelector(".current-quantity")?.textContent || 0;
    const itemImage = cartButton?.previousElementSibling;

    cartButton.innerHTML =
      this.changeButtonContentOnMouseOver(currentQuantity);
    cartButton.style.justifyContent = "space-between";
    cartButton.style.color = "white";
    cartButton.style.backgroundColor = "var(--color-accent-light)";
    itemImage.style.border = "3px solid var(--color-accent-light)";
  }

  handleMouseLeave(cartButton, isCalledToRemoveStyles = false) {
    if (
      !isCalledToRemoveStyles &&
      cartButton?.querySelector(".current-quantity")?.textContent > "0"
    ) {
      return;
    }
    let itemImage = null;
    if (!isCalledToRemoveStyles) {
      itemImage = cartButton?.previousElementSibling;
    } else if (isCalledToRemoveStyles) {
      const menuItems = document.querySelectorAll(".dessert__list-item");
      for (const item of menuItems) {
        if (parseInt(item.dataset.itemId) === cartButton) {
          cartButton = item.querySelector(".dessert__list-item-buy");
          itemImage = cartButton?.previousElementSibling;
        }
      }
    }

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

  /**
   * Handles mouse click events on quantity increment/decrement buttons.
   *
   * @param {Event} event - The mouse click event object.
   *
   * This function identifies whether the clicked element is an increment or
   * decrement button. It updates the quantity of the corresponding item in the
   * cart, adjusts the displayed current quantity, and re-renders the cart contents.
   */
  handleMouseClick(event) {
    const buttonQuantity = event?.target;
    const itemId = +buttonQuantity?.parentElement?.dataset?.itemId;
    const currentQuantityDiv =
      buttonQuantity?.parentElement?.querySelector(".current-quantity");
    const currentItem = this.menu.getItems()[itemId];

    if (buttonQuantity?.classList?.contains("increment-quantity")) {
      this.cart.changeQuantity(currentItem, +1);
      this.renderCurrentQuantity(currentQuantityDiv, currentItem);
      this.renderCart();
    } else if (buttonQuantity?.classList?.contains("decrement-quantity")) {
      this.cart.changeQuantity(currentItem, -1);
      this.renderCurrentQuantity(currentQuantityDiv, currentItem);
      this.renderCart();
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
      <li class="dessert__list-item" data-item-id="${index}">
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
    const cartFooter = cartDiv.querySelector(".cart__footer");

    if (!this.initialCartContentHTML) {
      this.initialCartContentHTML = cartList.innerHTML;
    }

    const browserIndexesSet = new Set();
    const actualIndexesSet = new Set();
    const items = this.cart.getItemsInCart();
    const itemsLi = cartList.querySelectorAll(".cart__list-item");

    if (this.cart.isCartEmpty()) {
      cartList.innerHTML = this.initialCartContentHTML;
      cartFooter?.remove();
    } else if (!this.cart.isCartEmpty()) {
      cartList?.querySelector(".cart__list-item-empty")?.remove();

      for (const [item, quantity] of items) {
        const { category, image, index, name, price } = item;
        actualIndexesSet.add(index);
        if (quantity === 1 && !this.isAlreadyInCart(itemsLi, index)) {
          cartList.insertAdjacentHTML(
            "beforeend",
            this.getItemCartTemplate(
              name,
              quantity,
              price.toFixed(2),
              (quantity * price).toFixed(2),
              index
            )
          );
          browserIndexesSet.add(index);
        } else {
          for (const itemLi of itemsLi) {
            const browserIndex = parseInt(itemLi.dataset.id);
            if (!browserIndexesSet.has(browserIndex)) {
              browserIndexesSet.add(browserIndex);
            }
            if (browserIndex === index && quantity > 0) {
              // change quantity
              itemLi.querySelector(
                ".cart__list-item-quantity"
              ).textContent = `${items.get(item)}x`;
              // change price
              itemLi.querySelector(
                ".cart__list-item-totalPrice"
              ).textContent = `$${(price * quantity).toFixed(2)}`;
            }
          }
        }
      }
      this.renderFooterCart(cartDiv, cartList);
      this.renderOrderTotalPrice();
    }
    if (browserIndexesSet.size !== actualIndexesSet.size) {
      for (const itemLi of itemsLi) {
        const browserIndex = parseInt(itemLi.dataset.id);
        if (!actualIndexesSet.has(browserIndex)) {
          itemLi.remove();
        }
      }
    }
  }

  renderTotalItemsInCart(cartDiv) {
    const countDiv = cartDiv.querySelector(".cart__title");
    countDiv.innerHTML = `Your Cart (${this.cart.getTotalItemsInCart()})`;
  }

  renderFooterCart(cartDiv, cartList) {
    const isFooterNext =
      cartList?.nextElementSibling?.classList?.contains("cart__footer");
    if (!isFooterNext) {
      cartDiv.insertAdjacentHTML(
        "beforeend",
        this.getFooterCartTemplate()
      );
    }
  }

  renderOrderTotalPrice() {
    const orderTotalPriceDiv = document.querySelector(
      ".cart__footer-totalPrice-value"
    );
    if (orderTotalPriceDiv) {
      orderTotalPriceDiv.textContent = `$ ${this.cart
        .getTotalPrice()
        .toFixed(2)}`;
    }
  }

  isAlreadyInCart(itemsLi, index) {
    for (const itemLi of itemsLi) {
      if (parseInt(itemLi?.dataset?.id) === index) {
        return true;
      }
    }
    return false;
  }

  deleteItemFromCart(event) {
    const deleteButton = event?.target;
    const items = this.cart.getItemsInCart();
    const menuItems = document.querySelectorAll(
      ".dessert__list .dessert__list-item"
    );

    if (
      deleteButton?.matches(
        ".cart__list-item-remove-button, .cart__list-item-remove-button-image"
      )
    ) {
      const itemInCartBrowser = deleteButton.closest(".cart__list-item");
      const indexBrowser = +itemInCartBrowser.dataset.id;

      for (const [item] of items) {
        if (item.index === indexBrowser) {
          this.cart.changeQuantity(item, 0);
        }
      }

      for (const item of menuItems) {
        if (parseInt(item.dataset.itemId) === indexBrowser) {
          this.handleMouseLeave(indexBrowser, true);
          break;
        }
      }

      itemInCartBrowser.remove();
      this.renderCart();
    }
  }

  getItemCartTemplate(name, quantity, price, totalPrice, index) {
    return `
      <li class="cart__list-item" data-id="${index}" tabindex="0">
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
            tabindex="0"
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

  getFooterCartTemplate() {
    return `
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
        <button type="button" class="cart__footer-confirmOrder button" tabindex="0">
          Confirm Order
        </button>
        </div>
      </div>
    `;
  }
}
