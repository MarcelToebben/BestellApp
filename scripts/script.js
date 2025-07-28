let shoppingCart = [];

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

    let burgerMenu = '';
    for (let i = 0; i < menu.length; i++) {
        burgerMenu += `<a href="#dish_image_${i}">${menu[i].title}</a>`;
    }
    document.getElementById('burger-menu').innerHTML = burgerMenu;
}

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

function updateCartDisplay() {
    updateCartContent();
    refreshCartBadge();
    showCartNotification();
    updateMobileCartOverlayIfVisible();
}

function updateCartContent() {
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
        if (total < 25) {
            total += 4.99;
            html += `<div class="delivery-cost">Lieferkosten: 4,99 €</div>`;
        } else {
            html += `<div class="delivery-cost free">Lieferkosten: Kostenlos</div>`;
        }
    }

    cartArea.innerHTML = html;
    totalArea.innerHTML = 'Gesamtpreis: ' + total.toFixed(2).replace('.', ',') + ' €';
}

function updateMobileCartOverlayIfVisible() {
    let overlay = document.getElementById('mobile-cart-overlay');
    if (overlay && overlay.style.display === 'flex') {
        updateMobileCartOverlayContent();
    }
}

function updateMobileCartOverlayContent() {
    const overlayContent = document.getElementById('cart_content_overlay');
    const overlayTotal = document.getElementById('cart_total_overlay');
    let overlayHTML = '';
    let overlayTotalPrice = 0;

    if (shoppingCart.length === 0) {
        overlayHTML = 'Nichts ausgewählt.';
    } else {
        for (let i = 0; i < shoppingCart.length; i++) {
            overlayHTML += generateCartItem(shoppingCart[i]);
            overlayTotalPrice += shoppingCart[i].price * shoppingCart[i].amount;
        }

        if (overlayTotalPrice < 25) {
            overlayTotalPrice += 4.99;
            overlayHTML += `<div class="delivery-cost">Lieferkosten: 4,99 €</div>`;
        } else {
            overlayHTML += `<div class="delivery-cost free">Lieferkosten: Kostenlos</div>`;
        }
    }

    overlayContent.innerHTML = overlayHTML;
    overlayTotal.innerHTML = 'Gesamtpreis: ' + overlayTotalPrice.toFixed(2).replace('.', ',') + ' €';
}

function refreshCartBadge() {
    let badge = document.getElementById('cart-badge');
    let amount = 0;

    for (let i = 0; i < shoppingCart.length; i++) {
        amount += shoppingCart[i].amount;
    }

    if (amount > 0) {
        badge.style.display = 'inline-block';
        badge.innerHTML = `(${amount})`;
    } else {
        badge.style.display = 'none';
    }

    let mobileCount = document.getElementById('cart-mobile-count');
    if (mobileCount) {
        mobileCount.innerText = amount;
    }
}

function clearShoppingCart() {
    shoppingCart = [];
    updateCartDisplay();
}


function placeOrder() {
    if (shoppingCart.length === 0) {
        return;
    }

    clearShoppingCart();
    showPopup('thanks-popup');

    const overlay = document.getElementById('mobile-cart-overlay');
    if (overlay && overlay.style.display === 'flex') {
        overlay.style.display = 'none';
    }
}

function showPopup(id) {
    let popup = document.getElementById(id);
    if (popup) {
        popup.style.display = 'flex';
    }
}

function hidePopup(id) {
    let popup = document.getElementById(id);
    if (popup) {
        popup.style.display = 'none';
    }
}

function showCartNotification() {
    let badge = document.getElementById('cart-badge');
    badge.classList.add('cart-feedback');
    setTimeout(function () {
        badge.classList.remove('cart-feedback');
    }, 300);
}

function toggleBurgerMenu() {
    let menu = document.getElementById('burger-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

function handleBurgerMenuClick(event) {
    const burgerMenuElement = document.getElementById('burger-menu');
    const burgerButtonElement = document.querySelector('.burger');
    const clickedElement = event.target;

    const {
        clickedInsideBurgerMenu,
        clickedBurgerButton,
        clickedMenuLink
    } = evaluateClickTargets(clickedElement, burgerMenuElement, burgerButtonElement);

    processBurgerMenuToggle(burgerMenuElement, clickedInsideBurgerMenu, clickedBurgerButton, clickedMenuLink);
}

function evaluateClickTargets(clickedElement, burgerMenuElement, burgerButtonElement) {
    let clickedInsideBurgerMenu = clickedElement === burgerMenuElement;
    let clickedBurgerButton = clickedElement === burgerButtonElement;
    let clickedMenuLink = false;

    const burgerMenuLinks = burgerMenuElement.getElementsByTagName('a');
    for (let i = 0; i < burgerMenuLinks.length; i++) {
        if (clickedElement === burgerMenuLinks[i]) {
            clickedMenuLink = true;
            break;
        }
    }

    return { clickedInsideBurgerMenu, clickedBurgerButton, clickedMenuLink };
}

function processBurgerMenuToggle(burgerMenuElement, clickedInsideBurgerMenu, clickedBurgerButton, clickedMenuLink) {
    if (burgerMenuElement.style.display === 'block') {
        if (!clickedInsideBurgerMenu && !clickedBurgerButton && !clickedMenuLink) {
            burgerMenuElement.style.display = 'none';
        }

        if (clickedMenuLink) {
            burgerMenuElement.style.display = 'none';
        }
    }
}

function toggleMobileCart() {
    let mobileCart = document.querySelector('.cart-mobile');
    if (mobileCart.classList.contains('expanded')) {
        mobileCart.classList.remove('expanded');
    } else {
        mobileCart.classList.add('expanded');
    }
}

function toggleMobileCartOverlay() {
    const overlay = document.getElementById('mobile-cart-overlay');

    if (overlay.style.display === 'flex') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'flex';
        updateMobileCartOverlayContent();
    }
}

function updateMobileCartOverlayContent() {
    const content = document.getElementById('cart_content_overlay');
    const total = document.getElementById('cart_total_overlay');
    let html = '';
    let totalPrice = 0;

    if (shoppingCart.length === 0) {
        html = 'Nichts ausgewählt.';
    } else {
        for (let i = 0; i < shoppingCart.length; i++) {
            html += generateCartItem(shoppingCart[i]);
            totalPrice += shoppingCart[i].price * shoppingCart[i].amount;
        }

        if (totalPrice < 25) {
            totalPrice += 4.99;
            html += `<div class="delivery-cost">Lieferkosten: 4,99 €</div>`;
        } else {
            html += `<div class="delivery-cost free">Lieferkosten: Kostenlos</div>`;
        }
    }

    content.innerHTML = html;
    total.innerHTML = 'Gesamtpreis: ' + totalPrice.toFixed(2).replace('.', ',') + ' €';
}

function placeOrder() {
    if (shoppingCart.length === 0) {
        return;
    }
    clearShoppingCart();
    showPopup('thanks-popup');
    document.getElementById('mobile-cart-overlay').style.display = 'none';
}

function handleOverlayClick(event) {
    let overlay = document.getElementById('mobile-cart-overlay');
    let content = document.querySelector('.mobile-cart-content');

    if (!content.contains(event.target)) {
        overlay.style.display = 'none';
    }
}

function closeOverlay() {
    let overlay = document.getElementById('mobile-cart-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}