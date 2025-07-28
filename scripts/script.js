let shoppingCart = [];

function startMenu() {
    loadCartFromLocalStorage();
    renderMenuSections();
    renderMenuDishes();
    updateCartDisplay();
    renderBurgerMenu();
}

function renderMenuSections() {
    let menuHTML = '';
    for (let i = 0; i < menu.length; i++) {
        menuHTML += generateMenuSection(menu[i], i);
    }
    document.getElementById('menu_sections').innerHTML = menuHTML;
}

function renderMenuDishes() {
    for (let i = 0; i < menu.length; i++) {
        let dishes = menu[i].items;
        let dishHTML = '';
        for (let j = 0; j < dishes.length; j++) {
            dishHTML += generateDishItem(dishes[j]);
        }
        document.getElementById('dish_description_' + i).innerHTML = dishHTML;
    }
}

function renderBurgerMenu() {
    let burgerMenu = '';
    for (let i = 0; i < menu.length; i++) {
        burgerMenu += `<a href="#dish_title_${i}">${menu[i].title}</a>`;
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
    saveCartToLocalStorage();
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
    saveCartToLocalStorage();
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

    let { html, total } = generateCartHTML();

    cartArea.innerHTML = html;
    totalArea.innerHTML = 'Gesamtpreis: ' + total.toFixed(2).replace('.', ',') + ' €';
}

function generateCartHTML() {
    let html = '';
    let total = 0;

    if (shoppingCart.length === 0) {
        html = 'Nichts ausgewählt.';
    } else {
        ({ html, total } = buildCartItemsAndTotal());
        html += generateDeliveryCostHTML(total);
        if (total < 25) total += 4.99;
    }

    return { html, total };
}

function buildCartItemsAndTotal() {
    let html = '';
    let total = 0;

    for (let i = 0; i < shoppingCart.length; i++) {
        html += generateCartItem(shoppingCart[i]);
        total += shoppingCart[i].price * shoppingCart[i].amount;
    }

    return { html, total };
}

function generateDeliveryCostHTML(total) {
    if (total < 25) {
        return `<div class="delivery-cost">Lieferkosten: 4,99 €</div>`;
    } else {
        return `<div class="delivery-cost free">Lieferkosten: Kostenlos</div>`;
    }
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

    const { html, total } = generateMobileCartHTML();

    overlayContent.innerHTML = html;
    overlayTotal.innerHTML = 'Gesamtpreis: ' + total.toFixed(2).replace('.', ',') + ' €';
}

function generateMobileCartHTML() {
    let html = '';
    let total = 0;

    if (shoppingCart.length === 0) {
        html = 'Nichts ausgewählt.';
    } else {
        ({ html, total } = buildMobileCartItemsAndTotal());
        html += generateDeliveryCostHTML(total);
        if (total < 25) total += 4.99;
    }

    return { html, total };
}

function buildMobileCartItemsAndTotal() {
    let html = '';
    let total = 0;

    for (let i = 0; i < shoppingCart.length; i++) {
        html += generateCartItem(shoppingCart[i]);
        total += shoppingCart[i].price * shoppingCart[i].amount;
    }

    return { html, total };
}

function generateDeliveryCostHTML(total) {
    if (total < 25) {
        return `<div class="delivery-cost">Lieferkosten: 4,99 €</div>`;
    } else {
        return `<div class="delivery-cost free">Lieferkosten: Kostenlos</div>`;
    }
}

function refreshCartBadge() {
    let amount = calculateCartAmount();
    updateDesktopCartBadge(amount);
    updateMobileCartCount(amount);
}

function calculateCartAmount() {
    let amount = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        amount += shoppingCart[i].amount;
    }
    return amount;
}

function updateDesktopCartBadge(amount) {
    let badge = document.getElementById('cart-badge');
    if (amount > 0) {
        badge.style.display = 'inline-block';
        badge.innerHTML = `(${amount})`;
    } else {
        badge.style.display = 'none';
    }
}

function updateMobileCartCount(amount) {
    let mobileCount = document.getElementById('cart-mobile-count');
    if (mobileCount) {
        mobileCount.innerText = amount;
    }
}

function clearShoppingCart() {
    shoppingCart = [];
    saveCartToLocalStorage();
    updateCartDisplay();
}

function placeOrder() {
    if (shoppingCart.length === 0) return;

    clearShoppingCart();
    showPopup('thanks-popup');
    document.getElementById('mobile-cart-overlay').style.display = 'none';
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

    const { html, totalPrice } = generateOverlayCartHTML();

    content.innerHTML = html;
    total.innerHTML = 'Gesamtpreis: ' + totalPrice.toFixed(2).replace('.', ',') + ' €';
}

function generateOverlayCartHTML() {
    let html = '';
    let totalPrice = 0;

    if (shoppingCart.length === 0) {
        html = 'Nichts ausgewählt.';
    } else {
        ({ html, totalPrice } = buildOverlayCartItemsAndTotal());
        html += generateOverlayDeliveryCostHTML(totalPrice);
        if (totalPrice < 25) totalPrice += 4.99;
    }

    return { html, totalPrice };
}

function buildOverlayCartItemsAndTotal() {
    let html = '';
    let totalPrice = 0;

    for (let i = 0; i < shoppingCart.length; i++) {
        html += generateCartItem(shoppingCart[i]);
        totalPrice += shoppingCart[i].price * shoppingCart[i].amount;
    }

    return { html, totalPrice };
}

function generateOverlayDeliveryCostHTML(totalPrice) {
    if (totalPrice < 25) {
        return `<div class="delivery-cost">Lieferkosten: 4,99 €</div>`;
    } else {
        return `<div class="delivery-cost free">Lieferkosten: Kostenlos</div>`;
    }
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

function closeThanksPopupIfOutside(event) {
    const popupContent = document.querySelector('#thanks-popup .popup-thanks');
    if (!popupContent.contains(event.target)) {
        hidePopup('thanks-popup');
    }
}

function closeOverlayIfOutside(event) {
    const overlay = document.getElementById('mobile-cart-overlay');
    const content = document.querySelector('.mobile-cart-content');

    if (!content.contains(event.target)) {
        overlay.style.display = 'none';
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
        shoppingCart = JSON.parse(storedCart);
    } else {
        shoppingCart = [];
    }
}