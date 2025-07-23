//html erstellen für menü kategorie mit titel, bild und leerem platz für gerichte//
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

//html erstellen für ein einzelnes gericht mit name, beschreibung, preis und hinzufügen button//
function generateDishItem(item) {
    return /*html*/ `
    <div class="dish-item">
      <div class="dish-content">
        <h3 class="dish-name">${item.name}</h3>
        <p class="dish-description">${item.description}</p>
        <p class="dish-price">€ ${item.price.toFixed(2).replace('.', ',')}</p>
      </div>
      <button onclick="addDishToCart('${item.name}', ${item.price})" class="btn add-btn">+</button>
    </div>
  `;
}

//html erstellen für den warenkorb eintrag mit menge, preis hinzufügen und wegnehmen button//
function generateCartItem(item) {
  const total = item.price * item.amount;
  return /*html*/ `
    <div class="cart-item">
      <div class="cart-details">
        <span class="cart-name">${item.amount}× ${item.name}</span>
        <span class="cart-price">€ ${total.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="cart-controls">
        <button onclick="addDishToCart('${item.name}', ${item.price})" class="btn add-btn">+</button>
        <button onclick="removeDishFromCart('${item.name}', ${item.price})" class="btn remove-btn">−</button>
      </div>
    </div>
    <div class="cart-divider"></div>
  `;
}
