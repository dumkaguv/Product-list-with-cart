export class ScreenController {
  constructor(menu) {
    this.menu = menu;
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
