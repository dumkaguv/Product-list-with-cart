export class ScreenController {
  constructor(menu) {
    this.menu = menu;
    this.initEvents();
  }

  initEvents() {
    const menuListUl = document.querySelector(".dessert__list");
    const addToCartButtonClass = "dessert__list-item-buy";
    let initialButtonContentHTML = "";

    menuListUl.addEventListener(
      "mouseenter",
      (event) => toggleButtonContent(event, "mouseenter"),
      true
    );

    menuListUl.addEventListener(
      "mouseleave",
      (event) => toggleButtonContent(event, "mouseleave"),
      true
    );

    function toggleButtonContent(event, action) {
      const cartButton = event?.target;

      if (!cartButton?.classList?.contains(addToCartButtonClass)) {
        return;
      }

      if (action === "mouseenter") {
        if (!initialButtonContentHTML) {
          initialButtonContentHTML = cartButton.innerHTML;
        }

        cartButton.innerHTML = changeButtonContent_OnMouseOver(cartButton);
        cartButton.style.justifyContent = "space-between";
        cartButton.style.color = "white";

        function changeButtonContent_OnMouseOver() {
          return `
          <img
            src="./assets/images/icon-decrement-quantity.svg"
            alt="add to cart icon"
            class="decrement-quantity"
          />
          1
          <img
            src="./assets/images/icon-increment-quantity.svg"
            alt="remove from cart icon"
            class="increment-quantity"
          />`;
        }
      }

      if (action === "mouseleave") {
        cartButton.innerHTML = initialButtonContentHTML;
        cartButton.style.justifyContent = "center";
        cartButton.style.color = "black";
      }
    }
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
        <img
          class="dessert__list-item-image"
          src="${pathToImage}"
          alt="${name}"
          loading="lazy"
        />
        <button class="dessert__list-item-buy button button-to-cart">
          <img
            src="./assets/images/icon-add-to-cart.svg"
            alt="add to cart icon"
          />
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
