export class ScreenController {
  constructor(menu) {
    this.menu = menu;
    this.initialButtonContentHTML = "";
  }

  init() {
    this.initEvents();
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
  }

  toggleButtonContent(event, action) {
    const cartButton = event?.target;

    if (!cartButton?.classList?.contains("dessert__list-item-buy")) {
      return;
    }

    if (action === "mouseenter") {
      this.handleMouseEnter(cartButton);
    }

    if (action === "mouseleave") {
      this.handleMouseLeave(cartButton);
    }
  }

  handleMouseEnter(cartButton) {
    if (!this.initialButtonContentHTML) {
      this.initialButtonContentHTML = cartButton.innerHTML;
    }

    cartButton.innerHTML = this.changeButtonContentOnMouseOver();
    cartButton.style.justifyContent = "space-between";
    cartButton.style.color = "white";
  }

  handleMouseLeave(cartButton) {
    cartButton.innerHTML = this.initialButtonContentHTML;
    cartButton.style.justifyContent = "center";
    cartButton.style.color = "black";
  }

  changeButtonContentOnMouseOver() {
    return `
      <img src="./assets/images/icon-decrement-quantity.svg" alt="add to cart icon" class="decrement-quantity" />
      1
      <img src="./assets/images/icon-increment-quantity.svg" alt="remove from cart icon" class="increment-quantity" />
    `;
  }

  renderMenu() {
    const items = this.menu.items;
    const menuList = document.querySelector(".dessert__list");
    const documentFragment = document.createDocumentFragment();

    items.forEach((item) => {
      const category = item.category || "Error";
      const name = item.name || "Error";
      const price = parseFloat(item.price).toFixed(2) || "Error";
      const pathToImage = item.image?.desktop || "Error";

      const template = this.getItemTemplate(
        category,
        name,
        price,
        pathToImage
      );
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = template;

      documentFragment.appendChild(tempDiv.firstElementChild);
    });

    menuList.appendChild(documentFragment);
  }

  getItemTemplate(category, name, price, pathToImage) {
    return `
      <li class="dessert__list-item">
        <div class="dessert__list-item-wrapper">
          <img class="dessert__list-item-image" src="${pathToImage}" alt="${name}" loading="lazy" />
          <button class="dessert__list-item-buy button button-to-cart">
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
}
