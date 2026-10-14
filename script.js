/* ============================================================
   JOMA ANIMALS — Navbar
   Toggle de menú móvil + sombra al hacer scroll.
   (Cuando se sumen secciones con motion, GSAP/ScrollTrigger/Lenis
   ya están disponibles en vendor/ listos para engancharse aquí,
   siguiendo el mismo patrón que Keller.)
   ============================================================ */
(function () {
    'use strict';

    var navbar = document.getElementById('navbar');
    var toggle = document.querySelector('.navbar__toggle');
    if (!navbar || !toggle) return;

    /* ---------- Sombra al hacer scroll ---------- */
    function updateChrome() {
        if (window.pageYOffset > 4) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }
    updateChrome();
    window.addEventListener('scroll', updateChrome, { passive: true });

    /* ---------- Menú móvil ---------- */
    function navToggleLabel(isOpen) {
        return window.JomaI18n ? window.JomaI18n.t(isOpen ? 'nav.toggle.close' : 'nav.toggle.open') : (isOpen ? 'Cerrar menú' : 'Abrir menú');
    }

    toggle.addEventListener('click', function () {
        var isOpen = navbar.classList.toggle('is-menu-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', navToggleLabel(isOpen));
    });

    /* Cierra el menú móvil al tocar un enlace */
    var mobileLinks = document.querySelectorAll('.navbar__mobile-menu .navbar__link, .navbar__mobile-menu .navbar__cart');
    for (var i = 0; i < mobileLinks.length; i++) {
        mobileLinks[i].addEventListener('click', function () {
            navbar.classList.remove('is-menu-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', navToggleLabel(false));
        });
    }

    /* El botón trae un data-i18n-aria fijo (estado "cerrado") para el
       primer render; si el menú está abierto cuando se cambia de
       idioma, ese data-i18n-aria lo resetearía al texto de "abrir".
       Se corrige a mano con el estado real tras cada cambio. */
    document.addEventListener('joma:langchange', function () {
        toggle.setAttribute('aria-label', navToggleLabel(navbar.classList.contains('is-menu-open')));
    });
})();

/* ============================================================
   TIENDA — buscador y filtros
   Filtra en vivo sobre las cards reales del grid (lee los mismos
   data-* que usan el carrito y la ficha de producto, así que
   funciona igual el día que haya más productos: no hace falta
   tocar este archivo, solo agregar cards nuevas con sus data-*).
   ============================================================ */
(function () {
    'use strict';

    var shopGrid = document.querySelector('.shop__grid');
    if (!shopGrid) return;

    var shopSearch = document.getElementById('shopSearch');
    var navSearch = document.getElementById('navSearch');
    var navSearchMobile = document.getElementById('navSearchMobile');
    var categoryChecks = document.querySelectorAll('.shop__sidebar input[name="categoria"]');
    var forChecks = document.querySelectorAll('.shop__sidebar input[name="para-quien"]');
    var saleCheck = document.querySelector('.shop__sidebar input[name="ofertas"]');
    var clearBtn = document.getElementById('clearFiltersBtn');
    var shopEmpty = document.getElementById('shopEmpty');
    var shopEmptyClear = document.getElementById('shopEmptyClear');
    var shopPagination = document.getElementById('shopPagination');
    var shopPagePrev = document.getElementById('shopPagePrev');
    var shopPageNext = document.getElementById('shopPageNext');
    var shopPaginationPages = document.getElementById('shopPaginationPages');

    var PAGE_SIZE = 6;
    var currentPage = 1;
    var matchingCards = [];

    function t(key, vars) {
        return window.JomaI18n ? window.JomaI18n.t(key, vars) : key;
    }

    /* Minúsculas y sin tildes, para que "pelo"/"peló" o "Alimentación"/
       "alimentacion" coincidan igual */
    function normalize(str) {
        return (str || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
    function slugify(str) {
        return normalize(str).replace(/\s+/g, '-');
    }
    function getChecked(nodeList) {
        var values = [];
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].checked) values.push(nodeList[i].value);
        }
        return values;
    }
    function matchesForWho(dataFor, checkedValues) {
        if (!checkedValues.length) return true;
        var norm = normalize(dataFor);
        for (var i = 0; i < checkedValues.length; i++) {
            var v = checkedValues[i];
            if (v === 'otros') {
                if (norm.indexOf('perros') === -1 && norm.indexOf('gatos') === -1) return true;
            } else if (norm.indexOf(v) !== -1) {
                return true;
            }
        }
        return false;
    }

    function applyFilters() {
        var query = normalize(shopSearch ? shopSearch.value : '').trim();
        var categories = getChecked(categoryChecks);
        var forWho = getChecked(forChecks);
        var onlyOffers = !!(saleCheck && saleCheck.checked);

        var cards = shopGrid.querySelectorAll('.product-card');
        matchingCards = [];

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var categorySlug = card.getAttribute('data-category-slug') || slugify(card.getAttribute('data-category'));
            var matchesCategory = !categories.length || categories.indexOf(categorySlug) !== -1;
            var matchesFor = matchesForWho(card.getAttribute('data-for'), forWho);
            var matchesOffer = !onlyOffers || card.getAttribute('data-sale') === 'true';

            /* Incluye ambos idiomas en la búsqueda: el buscador debe
               encontrar un producto sin importar si la ficha se ve
               en castellano o en catalán. */
            var haystack = normalize(
                card.getAttribute('data-name') + ' ' +
                card.getAttribute('data-name-ca') + ' ' +
                card.getAttribute('data-subtitle') + ' ' +
                card.getAttribute('data-subtitle-ca') + ' ' +
                card.getAttribute('data-category') + ' ' +
                card.getAttribute('data-category-ca') + ' ' +
                card.getAttribute('data-for') + ' ' +
                card.getAttribute('data-for-ca') + ' ' +
                card.getAttribute('data-description') + ' ' +
                card.getAttribute('data-description-ca')
            );
            var matchesQuery = !query || haystack.indexOf(query) !== -1;

            var visible = matchesCategory && matchesFor && matchesOffer && matchesQuery;
            if (visible) {
                matchingCards.push(card);
            } else {
                card.hidden = true;
            }
        }

        currentPage = 1;
        renderPage();
    }

    /* ---------- Paginación ----------
       applyFilters() arma matchingCards (qué productos cumplen los
       filtros); renderPage() solo decide qué porción de esos mostrar
       según PAGE_SIZE y la página actual, sin recalcular filtros. */
    function renderPage() {
        var total = matchingCards.length;
        var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;

        var start = (currentPage - 1) * PAGE_SIZE;
        var end = start + PAGE_SIZE;
        for (var i = 0; i < matchingCards.length; i++) {
            matchingCards[i].hidden = !(i >= start && i < end);
        }

        if (shopEmpty) shopEmpty.hidden = total > 0;
        renderPaginationControls(totalPages);
    }

    function goToPage(n) {
        currentPage = n;
        renderPage();
        shopGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderPaginationControls(totalPages) {
        if (!shopPagination) return;
        shopPagination.hidden = totalPages <= 1;
        if (shopPagePrev) shopPagePrev.disabled = currentPage <= 1;
        if (shopPageNext) shopPageNext.disabled = currentPage >= totalPages;
        if (shopPaginationPages) {
            shopPaginationPages.innerHTML = '';
            for (var p = 1; p <= totalPages; p++) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'shop__pagination-page' + (p === currentPage ? ' is-active' : '');
                btn.textContent = String(p);
                btn.setAttribute('aria-label', t('shop.pagination.page', { n: p }));
                if (p === currentPage) btn.setAttribute('aria-current', 'page');
                btn.addEventListener('click', (function (page) {
                    return function () { goToPage(page); };
                })(p));
                shopPaginationPages.appendChild(btn);
            }
        }
    }

    function clearFilters() {
        var checkboxes = document.querySelectorAll('.shop__sidebar input[type="checkbox"]');
        for (var i = 0; i < checkboxes.length; i++) checkboxes[i].checked = false;
        if (shopSearch) shopSearch.value = '';
        if (navSearch) navSearch.value = '';
        if (navSearchMobile) navSearchMobile.value = '';
        applyFilters();
    }

    if (shopSearch) shopSearch.addEventListener('input', applyFilters);
    for (var c = 0; c < categoryChecks.length; c++) categoryChecks[c].addEventListener('change', applyFilters);
    for (var f = 0; f < forChecks.length; f++) forChecks[f].addEventListener('change', applyFilters);
    if (saleCheck) saleCheck.addEventListener('change', applyFilters);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    if (shopEmptyClear) shopEmptyClear.addEventListener('click', clearFilters);
    if (shopPagePrev) shopPagePrev.addEventListener('click', function () { if (currentPage > 1) goToPage(currentPage - 1); });
    if (shopPageNext) shopPageNext.addEventListener('click', function () {
        var totalPages = Math.max(1, Math.ceil(matchingCards.length / PAGE_SIZE));
        if (currentPage < totalPages) goToPage(currentPage + 1);
    });
    /* Re-dibuja los números/aria-labels de la paginación en el idioma
       nuevo sin recalcular filtros ni mover de página. */
    document.addEventListener('joma:langchange', function () {
        renderPaginationControls(Math.max(1, Math.ceil(matchingCards.length / PAGE_SIZE)));
    });

    /* Cards de "¿Qué necesita tu compañero?": llevan a la tienda con
       esa categoría ya marcada en los filtros (y el resto, limpios). */
    var categoryCards = document.querySelectorAll('.cat-card[data-category-filter]');
    for (var cc = 0; cc < categoryCards.length; cc++) {
        categoryCards[cc].addEventListener('click', function () {
            var slug = this.getAttribute('data-category-filter');
            for (var k = 0; k < categoryChecks.length; k++) {
                categoryChecks[k].checked = categoryChecks[k].value === slug;
            }
            applyFilters();
        });
    }

    /* El buscador del navbar (visible en toda la web) se sincroniza con
       el de la tienda: escribir ahí filtra igual, y Enter te lleva
       directo a ver los resultados. */
    function wireNavSearch(input) {
        if (!input) return;
        input.addEventListener('input', function () {
            if (shopSearch) shopSearch.value = input.value;
            applyFilters();
        });
        input.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            /* Reutiliza el link "Tienda" del navbar: así, si hay una
               vista del carrito/producto/checkout abierta, se cierra
               sola antes de saltar (misma lógica de siempre). */
            var navLink = document.querySelector('.navbar__link[href="#catalogo"]');
            if (navLink) navLink.click();
        });
    }
    wireNavSearch(navSearch);
    wireNavSearch(navSearchMobile);

    applyFilters();
})();

/* ============================================================
   CATEGORÍAS — arrastrar con el mouse para scrollear
   El carrusel ya scrollea con touch/trackpad/barra de forma nativa;
   esto agrega "click sostenido + mover" para mouse de escritorio.
   ============================================================ */
(function () {
    'use strict';

    var track = document.querySelector('.categories__grid');
    if (!track) return;

    var isDown = false;
    var moved = false;
    var startX = 0;
    var startScroll = 0;

    track.addEventListener('mousedown', function (e) {
        isDown = true;
        moved = false;
        startX = e.pageX;
        startScroll = track.scrollLeft;
        track.classList.add('is-dragging');
        /* evita que el navegador arranque su propio "arrastrar imagen/link"
           nativo, que si no interfiere con los mousemove de abajo */
        e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        var dx = e.pageX - startX;
        if (Math.abs(dx) > 4) moved = true;
        track.scrollLeft = startScroll - dx;
    });

    window.addEventListener('mouseup', function () {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
    });

    /* Si hubo arrastre, el "click" que sigue al soltar no debe
       disparar el link de la card (si no, al arrastrar se abriría
       la categoría sin querer) */
    track.addEventListener('click', function (e) {
        if (moved) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
})();

/* ============================================================
   CARRITO + FICHA DE PRODUCTO
   Estado del carrito persistido en localStorage. El botón "Carrito"
   del navbar abre #cartView; hacer clic en cualquier card de producto
   abre su ficha (#productView). Ambas reemplazan el contenido de
   <main> en vez de taparlo con un overlay (navbar y footer siguen
   visibles). El "+" de cada card agrega/suma al carrito sin abrir nada.
   ============================================================ */
(function () {
    'use strict';

    var STORAGE_KEY = 'joma-cart';
    var cartView = document.getElementById('cartView');
    if (!cartView) return;

    var cartList = document.getElementById('cartList');
    var cartSubtitle = document.getElementById('cartSubtitle');
    var cartSubtotalEl = document.getElementById('cartSubtotal');
    var cartTotalEl = document.getElementById('cartTotal');
    var cartToggles = document.querySelectorAll('.navbar__cart');
    var cartBadges = document.querySelectorAll('.navbar__cart-badge');
    var navbar = document.getElementById('navbar');
    var navToggle = document.querySelector('.navbar__toggle');
    var mainEl = document.getElementById('main');

    var productView = document.getElementById('productView');
    var productMedia = document.getElementById('productMedia');
    var productImage = document.getElementById('productImage');
    var productEyebrow = document.getElementById('productEyebrow');
    var productTitle = document.getElementById('productTitle');
    var productStars = document.getElementById('productStars');
    var productRatingValue = document.getElementById('productRatingValue');
    var productPrice = document.getElementById('productPrice');
    var productStock = document.getElementById('productStock');
    var productDescription = document.getElementById('productDescription');
    var productQtyValueEl = document.getElementById('productQtyValue');
    var productQtyMinus = document.getElementById('productQtyMinus');
    var productQtyPlus = document.getElementById('productQtyPlus');
    var productAddBtn = document.getElementById('productAddBtn');
    var productBuyBtn = document.getElementById('productBuyBtn');
    var productSpecCategory = document.getElementById('productSpecCategory');
    var productSpecFor = document.getElementById('productSpecFor');
    var productImgPrev = document.getElementById('productImgPrev');
    var productImgNext = document.getElementById('productImgNext');
    var relatedGrid = document.getElementById('relatedGrid');

    var cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    var checkoutView = document.getElementById('checkoutView');
    var checkoutSteps = document.getElementById('checkoutSteps');
    var checkoutStepDatos = document.getElementById('checkoutStepDatos');
    var checkoutStepPago = document.getElementById('checkoutStepPago');
    var checkoutStepListo = document.getElementById('checkoutStepListo');
    var checkoutForm = document.getElementById('checkoutForm');
    var checkoutBackToDatos = document.getElementById('checkoutBackToDatos');
    var checkoutConfirmOrderBtn = document.getElementById('checkoutConfirmOrderBtn');
    var checkoutShippingOptions = document.getElementById('checkoutShippingOptions');
    var checkoutPaymentOptions = document.getElementById('checkoutPaymentOptions');
    var checkoutAddress = document.getElementById('checkoutAddress');
    var checkoutItems = document.getElementById('checkoutItems');
    var checkoutSubtotalEl = document.getElementById('checkoutSubtotal');
    var checkoutShippingCostEl = document.getElementById('checkoutShippingCost');
    var checkoutTotalEl = document.getElementById('checkoutTotal');
    var SHIPPING_COST = 4.90;
    var FREE_SHIPPING_FROM = 40;

    var legalView = document.getElementById('legalView');
    var legalTabs = document.getElementById('legalTabs');
    var legalDocs = {
        aviso: document.getElementById('legalAviso'),
        privacidad: document.getElementById('legalPrivacidad'),
        condiciones: document.getElementById('legalCondiciones')
    };
    var legalLinks = document.querySelectorAll('[data-legal-link]');

    var cart = loadCart();
    var currentProductData = null;
    var currentProductQty = 1;
    var currentProductImages = [];
    var currentImageIndex = 0;

    /* ---------- Persistencia ---------- */
    function loadCart() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }
    function saveCart() {
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* localStorage no disponible: el carrito sigue funcionando en memoria */ }
    }

    /* ---------- Utilidades ---------- */
    function tr(key, vars) {
        return window.JomaI18n ? window.JomaI18n.t(key, vars) : key;
    }
    function formatPrice(n) {
        return n.toFixed(2).replace('.', ',') + ' €';
    }
    function findItem(id) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === id) return cart[i];
        }
        return null;
    }
    function totalCount() {
        var sum = 0;
        for (var i = 0; i < cart.length; i++) sum += cart[i].qty;
        return sum;
    }
    function subtotal() {
        var sum = 0;
        for (var i = 0; i < cart.length; i++) {
            var card = findStoreCardById(cart[i].id);
            var price = card ? parseFloat(card.getAttribute('data-price')) || 0 : 0;
            sum += cart[i].qty * price;
        }
        return sum;
    }
    /* ---------- Idioma ----------
       Cada card de producto trae su texto en castellano en data-name/
       data-category/... y su equivalente en catalán en data-name-ca/
       data-category-ca/... (data-category-slug y data-for se quedan
       siempre en castellano: son solo claves estables para filtrar). */
    function isCA() {
        return !!window.JomaI18n && window.JomaI18n.getLang() === 'ca';
    }
    function localizedAttr(card, base) {
        if (isCA()) {
            var caVal = card.getAttribute('data-' + base + '-ca');
            if (caVal !== null) return caVal;
        }
        return card.getAttribute('data-' + base);
    }
    /* Lee los data-* de una card de producto (fuente única de datos,
       tanto para el carrito como para la ficha de producto) */
    function readProductData(card) {
        return {
            id: card.getAttribute('data-id'),
            categorySlug: card.getAttribute('data-category-slug') || '',
            name: localizedAttr(card, 'name'),
            category: localizedAttr(card, 'category'),
            subtitle: localizedAttr(card, 'subtitle'),
            price: card.getAttribute('data-price'),
            image: card.getAttribute('data-image'),
            media: card.getAttribute('data-media'),
            rating: card.getAttribute('data-rating'),
            forWho: localizedAttr(card, 'for'),
            description: localizedAttr(card, 'description'),
            imgAlt: localizedAttr(card, 'img-alt'),
            stock: card.getAttribute('data-stock') || 'in'
        };
    }

    /* ---------- Stock ----------
       'in' (por defecto, sin aviso) | 'low' (pocas unidades) |
       'out' (agotado: deshabilita los botones de agregar/comprar).
       baseClass es 'product-card__stock' o 'product-view__stock'. */
    function renderStockBadge(el, stock, baseClass) {
        if (!el) return;
        el.classList.remove(baseClass + '--low', baseClass + '--out');
        if (stock === 'low') {
            el.textContent = tr('stock.low');
            el.classList.add(baseClass + '--low');
        } else if (stock === 'out') {
            el.textContent = tr('stock.out');
            el.classList.add(baseClass + '--out');
        } else {
            el.textContent = '';
        }
    }

    /* ---------- Mutaciones del carrito ---------- */
    function addToCart(data, qty) {
        qty = qty || 1;
        var item = findItem(data.id);
        if (item) {
            item.qty += qty;
        } else {
            /* Solo se guarda id + cantidad: el resto (nombre, precio,
               imagen...) se resuelve siempre en vivo desde la card de
               la tienda, para que nunca quede congelado en el idioma
               con el que se agregó al carrito. */
            cart.push({ id: data.id, qty: qty });
        }
        saveCart();
        render();
        pulseBadges();
    }
    function removeFromCart(id) {
        cart = cart.filter(function (i) { return i.id !== id; });
        saveCart();
        render();
    }
    function changeQty(id, delta) {
        var item = findItem(id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) { removeFromCart(id); return; }
        saveCart();
        render();
    }

    /* ---------- Render ---------- */
    function updateBadges() {
        var count = totalCount();
        for (var i = 0; i < cartBadges.length; i++) {
            cartBadges[i].textContent = String(count);
            cartBadges[i].classList.toggle('is-empty', count === 0);
        }
    }
    function pulseBadges() {
        for (var i = 0; i < cartBadges.length; i++) {
            var b = cartBadges[i];
            b.classList.remove('is-pulsing');
            void b.offsetWidth; /* fuerza reflow para poder repetir la animación */
            b.classList.add('is-pulsing');
        }
    }

    function buildItemEl(item) {
        var card = findStoreCardById(item.id);
        var data = card ? readProductData(card) : { name: item.id, category: '', subtitle: '', price: '0', image: '', media: '' };
        var price = parseFloat(data.price) || 0;

        var el = document.createElement('article');
        el.className = 'cart-item';
        el.setAttribute('data-id', item.id);
        el.innerHTML =
            '<div class="cart-item__media ' + data.media + '"><img src="' + data.image + '" alt=""></div>' +
            '<div class="cart-item__info">' +
                '<p class="cart-item__eyebrow">' + data.category + '</p>' +
                '<h3 class="cart-item__name">' + data.name + '</h3>' +
                '<p class="cart-item__subtitle">' + data.subtitle + '</p>' +
            '</div>' +
            '<div class="cart-item__qty">' +
                '<button type="button" class="cart-item__qty-btn" data-action="decrease" aria-label="' + tr('cart.item.minus.aria', { name: data.name }) + '">−</button>' +
                '<span class="cart-item__qty-value">' + item.qty + '</span>' +
                '<button type="button" class="cart-item__qty-btn" data-action="increase" aria-label="' + tr('cart.item.plus.aria', { name: data.name }) + '">+</button>' +
            '</div>' +
            '<p class="cart-item__price">' + formatPrice(price * item.qty) + '</p>' +
            '<button type="button" class="cart-item__remove" aria-label="' + tr('cart.item.remove.aria', { name: data.name }) + '">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>' +
            '</button>';

        el.querySelector('[data-action="decrease"]').addEventListener('click', function () { changeQty(item.id, -1); });
        el.querySelector('[data-action="increase"]').addEventListener('click', function () { changeQty(item.id, 1); });
        el.querySelector('.cart-item__remove').addEventListener('click', function () { removeFromCart(item.id); });
        return el;
    }

    function render() {
        updateBadges();

        var count = totalCount();
        if (cartSubtitle) {
            cartSubtitle.textContent = count === 0
                ? tr('cart.empty.subtitle')
                : count + tr(count === 1 ? 'cart.subtitle.one' : 'cart.subtitle.many');
        }

        if (cartList) {
            cartList.innerHTML = '';
            for (var i = 0; i < cart.length; i++) {
                cartList.appendChild(buildItemEl(cart[i]));
            }
        }

        var sub = subtotal();
        if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(sub);
        if (cartTotalEl) cartTotalEl.textContent = formatPrice(sub);
    }

    /* ---------- Abrir / cerrar las vistas ----------
       El carrito y la ficha de producto reemplazan el contenido de
       <main> (navbar y footer siguen visibles, como el resto de la
       página) en vez de taparlo todo con un overlay. */
    function openCart() {
        closeProductView();
        closeCheckout();
        closeLegalView();
        if (mainEl) mainEl.hidden = true;
        cartView.classList.add('is-open');
        cartView.setAttribute('aria-hidden', 'false');
        if (navbar) navbar.classList.remove('is-menu-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        window.scrollTo(0, 0);
    }
    function closeCart() {
        if (mainEl) mainEl.hidden = false;
        cartView.classList.remove('is-open');
        cartView.setAttribute('aria-hidden', 'true');
    }
    function isCartOpen() {
        return cartView.classList.contains('is-open');
    }

    for (var t = 0; t < cartToggles.length; t++) {
        cartToggles[t].addEventListener('click', openCart);
    }
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (isCartOpen()) closeCart();
        if (isProductViewOpen()) closeProductView();
        if (isCheckoutOpen()) closeCheckout();
        if (isLegalOpen()) closeLegalView();
    });

    /* Cualquier enlace ancla (navbar, footer, "Seguir comprando",
       "Volver a la tienda"...) cierra la vista abierta primero, para
       que el destino —que vive dentro de <main>— ya esté visible
       cuando el navegador salte a él. */
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        if (isCartOpen()) closeCart();
        if (isProductViewOpen()) closeProductView();
        if (isCheckoutOpen()) closeCheckout();
        if (isLegalOpen()) closeLegalView();
    });

    /* ---------- Ficha de producto ---------- */
    function getStoreCards() {
        /* Siempre lee del grid original de la tienda: es la única
           fuente de datos, también para los productos relacionados. */
        return document.querySelectorAll('.shop__grid .product-card');
    }
    function findStoreCardById(id) {
        var cards = getStoreCards();
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].getAttribute('data-id') === id) return cards[i];
        }
        return null;
    }
    function buildStars(rating) {
        var r = Math.round(parseFloat(rating) || 0);
        r = Math.max(0, Math.min(5, r));
        return '★★★★★'.slice(0, r) + '☆☆☆☆☆'.slice(0, 5 - r);
    }
    function getRelatedProducts(current) {
        var cards = getStoreCards();
        var all = [];
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].getAttribute('data-id') === current.id) continue;
            all.push(readProductData(cards[i]));
        }
        var sameCategory = all.filter(function (p) { return p.categorySlug === current.categorySlug; });
        var others = all.filter(function (p) { return p.categorySlug !== current.categorySlug; });
        return sameCategory.concat(others).slice(0, 3);
    }
    function buildProductCardEl(data) {
        /* Reconstruye el mismo markup .product-card que arma la tienda,
           para que luzca y funcione igual (clic abre su ficha, "+" lo
           agrega al carrito) dentro de "También te puede interesar". */
        var el = document.createElement('article');
        el.className = 'product-card';
        el.setAttribute('data-id', data.id);
        el.setAttribute('data-name', data.name);
        el.setAttribute('data-category', data.category);
        el.setAttribute('data-subtitle', data.subtitle || '');
        el.setAttribute('data-price', data.price);
        el.setAttribute('data-image', data.image);
        el.setAttribute('data-media', data.media);
        el.setAttribute('data-rating', data.rating || '');
        el.setAttribute('data-for', data.forWho || '');
        el.setAttribute('data-description', data.description || '');
        el.setAttribute('data-stock', data.stock || 'in');
        var outOfStock = data.stock === 'out';
        var stockClass = data.stock === 'low' ? ' product-card__stock--low' : (outOfStock ? ' product-card__stock--out' : '');
        var stockText = data.stock === 'low' ? tr('stock.low') : (outOfStock ? tr('stock.out') : '');
        el.innerHTML =
            '<div class="product-card__media ' + data.media + '">' +
                '<img src="' + data.image + '" alt="' + (data.imgAlt || data.name) + '" loading="lazy" decoding="async">' +
            '</div>' +
            '<div class="product-card__body">' +
                '<p class="product-card__eyebrow">' + data.category + '</p>' +
                '<h3 class="product-card__name">' + data.name + '</h3>' +
                '<p class="product-card__stock' + stockClass + '">' + stockText + '</p>' +
                '<div class="product-card__footer">' +
                    '<p class="product-card__price">' + formatPrice(parseFloat(data.price) || 0) + '</p>' +
                    '<button type="button" class="product-card__add" aria-label="' + tr('pdp.add.aria', { name: data.name }) + '"' + (outOfStock ? ' disabled' : '') + '>' +
                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
                    '</button>' +
                '</div>' +
            '</div>';
        return el;
    }

    /* data-image acepta una ruta o varias separadas por coma — así, el
       día que un producto tenga más de una foto, alcanza con escribir
       "assets/a.jpg, assets/b.jpg" en el HTML, sin tocar el JS. */
    function parseImages(raw) {
        var list = (raw || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        return list.length ? list : [''];
    }
    function showImage(index) {
        if (!currentProductImages.length) return;
        var len = currentProductImages.length;
        currentImageIndex = ((index % len) + len) % len; /* wrap-around en ambos sentidos */
        if (productImage) productImage.src = currentProductImages[currentImageIndex];
    }

    function openProductView(id) {
        if (!productView) return;
        var card = findStoreCardById(id);
        if (!card) return;
        var data = readProductData(card);
        currentProductData = data;
        currentProductQty = 1;
        currentProductImages = parseImages(data.image);
        currentImageIndex = 0;

        if (productImage) { productImage.src = currentProductImages[0]; productImage.alt = data.imgAlt || data.name; }
        if (productMedia) productMedia.className = 'product-view__media ' + data.media;
        if (productEyebrow) productEyebrow.textContent = data.category;
        if (productTitle) productTitle.textContent = data.name;
        if (productStars) productStars.textContent = buildStars(data.rating);
        if (productRatingValue) productRatingValue.textContent = data.rating ? data.rating.replace('.', ',') : '';
        if (productPrice) productPrice.textContent = formatPrice(parseFloat(data.price) || 0);
        renderStockBadge(productStock, data.stock, 'product-view__stock');
        if (productDescription) productDescription.textContent = data.description || '';
        if (productQtyValueEl) productQtyValueEl.textContent = '1';
        if (productSpecCategory) productSpecCategory.textContent = data.category;
        if (productSpecFor) productSpecFor.textContent = data.forWho || '—';

        var outOfStock = data.stock === 'out';
        if (productQtyMinus) productQtyMinus.disabled = outOfStock;
        if (productQtyPlus) productQtyPlus.disabled = outOfStock;
        if (productAddBtn) {
            productAddBtn.disabled = outOfStock;
            productAddBtn.textContent = outOfStock ? tr('pdp.add.outofstock') : tr('pdp.add');
        }
        if (productBuyBtn) productBuyBtn.disabled = outOfStock;

        if (relatedGrid) {
            relatedGrid.innerHTML = '';
            var related = getRelatedProducts(data);
            for (var i = 0; i < related.length; i++) {
                relatedGrid.appendChild(buildProductCardEl(related[i]));
            }
        }

        closeCart();
        closeCheckout();
        closeLegalView();
        if (mainEl) mainEl.hidden = true;
        productView.classList.add('is-open');
        productView.setAttribute('aria-hidden', 'false');
        if (navbar) navbar.classList.remove('is-menu-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        window.scrollTo(0, 0);
    }
    function closeProductView() {
        if (!productView) return;
        if (mainEl) mainEl.hidden = false;
        productView.classList.remove('is-open');
        productView.setAttribute('aria-hidden', 'true');
    }
    function isProductViewOpen() {
        return !!productView && productView.classList.contains('is-open');
    }

    if (productQtyMinus) {
        productQtyMinus.addEventListener('click', function () {
            if (currentProductQty <= 1) return;
            currentProductQty -= 1;
            if (productQtyValueEl) productQtyValueEl.textContent = String(currentProductQty);
        });
    }
    if (productQtyPlus) {
        productQtyPlus.addEventListener('click', function () {
            currentProductQty += 1;
            if (productQtyValueEl) productQtyValueEl.textContent = String(currentProductQty);
        });
    }
    if (productImgPrev) productImgPrev.addEventListener('click', function () { showImage(currentImageIndex - 1); });
    if (productImgNext) productImgNext.addEventListener('click', function () { showImage(currentImageIndex + 1); });
    if (productAddBtn) {
        productAddBtn.addEventListener('click', function () {
            if (!currentProductData) return;
            addToCart(currentProductData, currentProductQty);
        });
    }
    if (productBuyBtn) {
        productBuyBtn.addEventListener('click', function () {
            if (!currentProductData) return;
            addToCart(currentProductData, currentProductQty);
            openCart();
        });
    }

    /* ---------- Clics en cualquier card de producto (tienda y
       "también te puede interesar"): el "+" agrega al carrito, el
       resto de la card abre su ficha. Delegado en document para que
       funcione también con las cards que arma buildProductCardEl(). ---------- */
    document.addEventListener('click', function (e) {
        var addBtn = e.target.closest('.product-card__add');
        if (addBtn) {
            var cardForAdd = addBtn.closest('.product-card');
            if (cardForAdd) addToCart(readProductData(cardForAdd));
            return;
        }
        var card = e.target.closest('.product-card');
        if (card) openProductView(card.getAttribute('data-id'));
    });

    /* ---------- Checkout ---------- */
    function selectedShippingMethod() {
        var checked = checkoutShippingOptions
            ? checkoutShippingOptions.querySelector('input[name="entrega"]:checked')
            : null;
        return checked ? checked.value : 'domicilio';
    }
    function computeShipping(sub) {
        if (selectedShippingMethod() === 'tienda') return 0;
        return sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
    }
    function renderCheckoutSummary() {
        var sub = subtotal();
        var shipping = computeShipping(sub);

        if (checkoutItems) {
            checkoutItems.innerHTML = '';
            for (var i = 0; i < cart.length; i++) {
                var item = cart[i];
                var card = findStoreCardById(item.id);
                var data = card ? readProductData(card) : { name: item.id, media: '', price: '0' };
                var price = parseFloat(data.price) || 0;
                var row = document.createElement('div');
                row.className = 'checkout-view__item';
                row.innerHTML =
                    '<span class="checkout-view__item-dot ' + data.media + '"></span>' +
                    '<span class="checkout-view__item-name">' + data.name + ' × ' + item.qty + '</span>' +
                    '<span class="checkout-view__item-price">' + formatPrice(price * item.qty) + '</span>';
                checkoutItems.appendChild(row);
            }
        }
        if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = formatPrice(sub);
        if (checkoutShippingCostEl) checkoutShippingCostEl.textContent = shipping === 0 ? tr('checkout.envio.free') : formatPrice(shipping);
        if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(sub + shipping);
    }
    function updateShippingUI() {
        var method = selectedShippingMethod();
        if (checkoutShippingOptions) {
            var labels = checkoutShippingOptions.querySelectorAll('.checkout-view__option');
            for (var i = 0; i < labels.length; i++) {
                var input = labels[i].querySelector('input');
                labels[i].classList.toggle('is-selected', !!input && input.checked);
            }
        }
        var isDomicilio = method === 'domicilio';
        if (checkoutAddress) {
            checkoutAddress.classList.toggle('is-hidden', !isDomicilio);
            var requiredFields = checkoutAddress.querySelectorAll('#coDireccion, #coCP, #coPoblacion');
            for (var j = 0; j < requiredFields.length; j++) {
                requiredFields[j].required = isDomicilio;
            }
        }
        renderCheckoutSummary();
    }

    /* ---------- Pasos del checkout: 1 Datos · 2 Pago · 3 Listo ---------- */
    function updatePaymentUI() {
        if (!checkoutPaymentOptions) return;
        var checked = checkoutPaymentOptions.querySelector('input[name="pago"]:checked');
        var labels = checkoutPaymentOptions.querySelectorAll('.checkout-view__option');
        for (var i = 0; i < labels.length; i++) {
            var input = labels[i].querySelector('input');
            labels[i].classList.toggle('is-selected', !!input && input === checked);
        }
    }
    function goToStep(n) {
        if (checkoutStepDatos) checkoutStepDatos.hidden = n !== 1;
        if (checkoutStepPago) checkoutStepPago.hidden = n !== 2;
        if (checkoutStepListo) checkoutStepListo.hidden = n !== 3;
        if (checkoutSteps) {
            var items = checkoutSteps.querySelectorAll('.checkout-steps__item');
            for (var i = 0; i < items.length; i++) {
                items[i].classList.toggle('is-active', parseInt(items[i].getAttribute('data-step'), 10) === n);
            }
        }
        if (checkoutView) window.scrollTo(0, 0);
    }

    function openCheckout() {
        if (!checkoutView) return;
        closeCart();
        closeProductView();
        closeLegalView();
        goToStep(1);
        updateShippingUI();
        updatePaymentUI();
        if (mainEl) mainEl.hidden = true;
        checkoutView.classList.add('is-open');
        checkoutView.setAttribute('aria-hidden', 'false');
        window.scrollTo(0, 0);
    }
    function closeCheckout() {
        if (!checkoutView) return;
        if (mainEl) mainEl.hidden = false;
        checkoutView.classList.remove('is-open');
        checkoutView.setAttribute('aria-hidden', 'true');
    }
    function isCheckoutOpen() {
        return !!checkoutView && checkoutView.classList.contains('is-open');
    }

    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', function () {
            if (!cart.length) return; /* nada que pagar con el carrito vacío */
            openCheckout();
        });
    }
    if (checkoutShippingOptions) {
        checkoutShippingOptions.addEventListener('change', updateShippingUI);
    }
    if (checkoutPaymentOptions) {
        checkoutPaymentOptions.addEventListener('change', updatePaymentUI);
    }
    /* Paso 1 → 2: valida los datos y pasa a elegir forma de pago */
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }
            goToStep(2);
        });
    }
    /* Paso 2 → 1 */
    if (checkoutBackToDatos) {
        checkoutBackToDatos.addEventListener('click', function (e) {
            e.preventDefault();
            goToStep(1);
        });
    }
    /* Paso 2 → 3: sin pasarela de pago real todavía, esto simula el
       pedido confirmado y vacía el carrito. */
    if (checkoutConfirmOrderBtn) {
        checkoutConfirmOrderBtn.addEventListener('click', function () {
            goToStep(3);
            cart = [];
            saveCart();
            updateBadges();
        });
    }

    /* ---------- Vista legal (Aviso legal / Privacidad / Condiciones) ---------- */
    function showLegalDoc(key) {
        for (var name in legalDocs) {
            if (!legalDocs[name]) continue;
            legalDocs[name].hidden = name !== key;
        }
        if (legalTabs) {
            var tabs = legalTabs.querySelectorAll('.legal-view__tab');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.toggle('is-active', tabs[i].getAttribute('data-legal') === key);
            }
        }
        window.scrollTo(0, 0);
    }
    function openLegalView(key) {
        if (!legalView) return;
        closeCart();
        closeProductView();
        closeCheckout();
        showLegalDoc(key || 'aviso');
        if (mainEl) mainEl.hidden = true;
        legalView.classList.add('is-open');
        legalView.setAttribute('aria-hidden', 'false');
        if (navbar) navbar.classList.remove('is-menu-open');
        window.scrollTo(0, 0);
    }
    function closeLegalView() {
        if (!legalView) return;
        if (mainEl) mainEl.hidden = false;
        legalView.classList.remove('is-open');
        legalView.setAttribute('aria-hidden', 'true');
    }
    function isLegalOpen() {
        return !!legalView && legalView.classList.contains('is-open');
    }

    for (var lg = 0; lg < legalLinks.length; lg++) {
        legalLinks[lg].addEventListener('click', function (e) {
            e.preventDefault();
            openLegalView(this.getAttribute('data-legal-link'));
        });
    }
    if (legalTabs) {
        legalTabs.addEventListener('click', function (e) {
            var tab = e.target.closest('.legal-view__tab');
            if (tab) showLegalDoc(tab.getAttribute('data-legal'));
        });
    }

    /* ---------- Idioma: refresca el texto generado por JS ----------
       Las cards de la tienda muestran su nombre/categoría vía
       data-field (marcado en el HTML); todo lo demás (carrito, ficha
       de producto abierta, resumen del checkout) se reconstruye con
       las mismas funciones de render de arriba. */
    function applyProductCardLanguage() {
        var cards = getStoreCards();
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var data = readProductData(card);
            var nameEl = card.querySelector('[data-field="name"]');
            var categoryEl = card.querySelector('[data-field="category"]');
            if (nameEl) nameEl.textContent = data.name;
            if (categoryEl) categoryEl.textContent = data.category;
            var img = card.querySelector('.product-card__media img');
            if (img) img.alt = data.imgAlt || data.name;
            var addBtn = card.querySelector('.product-card__add');
            if (addBtn) {
                addBtn.setAttribute('aria-label', tr('pdp.add.aria', { name: data.name }));
                addBtn.disabled = data.stock === 'out';
            }
            renderStockBadge(card.querySelector('[data-field="stock"]'), data.stock, 'product-card__stock');
        }
    }

    document.addEventListener('joma:langchange', function () {
        applyProductCardLanguage();
        render();
        if (isProductViewOpen() && currentProductData) openProductView(currentProductData.id);
        if (isCheckoutOpen()) { updateShippingUI(); updatePaymentUI(); }
    });

    applyProductCardLanguage();
    render();
})();
