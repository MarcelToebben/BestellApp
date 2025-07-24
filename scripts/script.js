let shoppingCart = [];

//gesamte speisekarte aufbauen, allege kategorien hinzufügen, die gerichte ins html einfügen und den warenkorb aktualisieren 
function startMenu() {
    let menuHTML = '';
    for (let i = 0; i < menu.length; i++) {
        menuHTML += generateMenuSection(menu[i], i);
    }
    document.getElementById('menu_sections').innerHTML = menuHTML;

    for (let i = 0; i < menu.length; i++) {
        let dishes = menu[i].items;
        let dishHTML = '';
        for (let j = 0; j < dishes.length; j++) {
            dishHTML += generateDishItem(dishes[j]);
        }
        document.getElementById('dish_description_' + i).innerHTML = dishHTML;
    }

    updateCartDisplay();

    // burger-menu links generieren
    let burgerMenu = '';
    for (let i = 0; i < menu.length; i++) {
        burgerMenu += `<a href="#dish_image_${i}">${menu[i].title}</a>`;
    }
    document.getElementById('burger-menu').innerHTML = burgerMenu;
}

//menge im warenkorb erhöhen, wenn keins drin ist neues gericht mit menge 1 hinzufügen und danach den warenkorb aktualisieren 
function addDishToCart(name, price) {
    let found = false;
    for (let i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].name === name) {
            shoppingCart[i].amount++;
            found = true;
        }
    }
    if (!found) {
        shoppingCart.push({ name: name, price: price, amount: 1 });
    }
    updateCartDisplay();
}

//menge im warenkorb reduzieren, wenn keins drin ist gericht entfernen und den warenkorb aktualisieren
function removeDishFromCart(name, price) {
    for (let i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].name === name) {
            shoppingCart[i].amount--;
            if (shoppingCart[i].amount <= 0) {
                shoppingCart.splice(i, 1);
            }
            break;
        }
    }
    updateCartDisplay();
}

//html anzeige für den aktuellen warenkorb, berechnet dann den gesamtpreis, zeigt nichts ausgewählt wenn der warenkorb leer ist und aktualisiert den warenkorb
function updateCartDisplay() {
    let cartArea = document.getElementById('cart_content');
    let totalArea = document.getElementById('cart_total');
    let html = '';
    let total = 0;

    if (shoppingCart.length === 0) {
        html = 'Nichts ausgewählt.';
    } else {
        for (let i = 0; i < shoppingCart.length; i++) {
            html += generateCartItem(shoppingCart[i]);
            total += shoppingCart[i].price * shoppingCart[i].amount;
        }
    }

    cartArea.innerHTML = html;
    totalArea.innerHTML = 'Gesamtpreis: € ' + total.toFixed(2).replace('.', ',');
    refreshCartBadge();
}

//zeigt die anzahl der artikel im warenkorb oder blendet sie aus wenn er leer ist 
function refreshCartBadge() {
    let badge = document.getElementById('cart-badge');
    let amount = 0;

    for (let i = 0; i < shoppingCart.length; i++) {
        amount += shoppingCart[i].amount;
    }

    if (amount > 0) {
        badge.style.display = 'inline-block';
        badge.innerHTML = amount;
    } else {
        badge.style.display = 'none';
    }
}

//löscht alle artikel im warenkorb aktualisiert die anzeige
function clearShoppingCart() {
    shoppingCart = [];
    updateCartDisplay();
}

//wenn der warenkorb leer ist und man auf bestellen klickt passiert nichts, wenn nicht wird der warenkorb geleert und das danke fenster erscheint 
function placeOrder() {
    if (shoppingCart.length === 0) {
        return;
    }
    clearShoppingCart();
    showPopup('thanks-popup');
}

//rendert das popup fenster
function showPopup(id) {
    let popup = document.getElementById(id);
    if (popup) {
        popup.style.display = 'flex';
    }
}

//versteckt das popup fenster
function hidePopup(id) {
    let popup = document.getElementById(id);
    if (popup) {
        popup.style.display = 'none';
    }
}

function toggleBurgerMenu() {
    let menu = document.getElementById('burger-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// burger-menu automatisch schließen wenn ein link geklickt wird
document.addEventListener('click', function (event) {
    const burgerMenu = document.getElementById('burger-menu');
    const burgerButton = document.getElementById('burger-button');

    const clickedInsideMenu = burgerMenu.contains(event.target);
    const clickedBurgerButton = burgerButton.contains(event.target);

    // Wenn das Menü offen ist, und man NICHT im Menü oder auf dem Button klickt → Menü schließen
    if (burgerMenu.style.display === 'block' && !clickedInsideMenu && !clickedBurgerButton) {
        burgerMenu.style.display = 'none';
    }

    // Wenn man auf einen Link im Burger-Menü klickt → Menü schließen
    if (event.target.closest('#burger-menu a')) {
        burgerMenu.style.display = 'none';
    }
});