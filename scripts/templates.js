function generateMenuSection(category, index) {
    return /*html*/ `
    <section class="dish-section">
      <h2 class="dish-title">${category.title}</h2>
      <div class="dish-image-container" id="dish_image_${index}">
        <img src="${category.image}" alt="${category.title}" class="dish-image">
      </div>
      <div id="dish_description_${index}" class="dish-list"></div>
    </section>
  `;
}

function generateDishItem(item) {
    return /*html*/ `
    <div class="dish-item">
      <div class="dish-content">
        <h3 class="dish-name">${item.name}</h3>
        <p class="dish-description">${item.description}</p>
        <p class="dish-price">${item.price.toFixed(2).replace('.', ',')} €</p>
      </div>
      <button onclick="addDishToCart('${item.name}', ${item.price})" class="btn add-btn">+</button>
    </div>
  `;
}

function generateCartItem(dish) {
    return `
        <div class="cart-item">
            <div class="cart-info">
                <span>${dish.name}</span>
                <span>€ ${(dish.price * dish.amount).toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="cart-controls">
                <button onclick="removeDishFromCart('${dish.name}', ${dish.price})">−</button>
                <span>${dish.amount}</span>
                <button onclick="addDishToCart('${dish.name}', ${dish.price})">+</button>
            </div>
        </div>
    `;
}
