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
    toggle.addEventListener('click', function () {
        var isOpen = navbar.classList.toggle('is-menu-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    /* Cierra el menú móvil al tocar un enlace */
    var mobileLinks = document.querySelectorAll('.navbar__mobile-menu .navbar__link, .navbar__mobile-menu .navbar__cart');
    for (var i = 0; i < mobileLinks.length; i++) {
        mobileLinks[i].addEventListener('click', function () {
            navbar.classList.remove('is-menu-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menú');
        });
    }
})();

/* ============================================================
   TIENDA — limpiar filtros
   (Los checkboxes todavía no filtran el grid: por ahora es un
   boceto visual. Esto solo resetea su estado.)
   ============================================================ */
(function () {
    'use strict';

    var clearBtn = document.getElementById('clearFiltersBtn');
    if (!clearBtn) return;

    clearBtn.addEventListener('click', function () {
        var checkboxes = document.querySelectorAll('.shop__sidebar input[type="checkbox"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        var search = document.getElementById('shopSearch');
        if (search) search.value = '';
    });
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
   CARRITO
   Estado persistido en localStorage. El botón "Carrito" del navbar
   (desktop y móvil) abre la vista de página completa #cartView;
   el botón "+" de cada producto en la tienda lo agrega/suma.
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
    var addButtons = document.querySelectorAll('.product-card__add');
    var navbar = document.getElementById('navbar');
    var navToggle = document.querySelector('.navbar__toggle');
    var mainEl = document.getElementById('main');

    var cart = loadCart();

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
        for (var i = 0; i < cart.length; i++) sum += cart[i].qty * cart[i].price;
        return sum;
    }

    /* ---------- Mutaciones ---------- */
    function addToCart(data) {
        var item = findItem(data.id);
        if (item) {
            item.qty += 1;
        } else {
            cart.push({
                id: data.id,
                name: data.name,
                category: data.category,
                subtitle: data.subtitle,
                price: parseFloat(data.price) || 0,
                image: data.image,
                media: data.media,
                qty: 1
            });
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
        var el = document.createElement('article');
        el.className = 'cart-item';
        el.setAttribute('data-id', item.id);
        el.innerHTML =
            '<div class="cart-item__media ' + item.media + '"><img src="' + item.image + '" alt=""></div>' +
            '<div class="cart-item__info">' +
                '<p class="cart-item__eyebrow">' + item.category + '</p>' +
                '<h3 class="cart-item__name">' + item.name + '</h3>' +
                '<p class="cart-item__subtitle">' + item.subtitle + '</p>' +
            '</div>' +
            '<div class="cart-item__qty">' +
                '<button type="button" class="cart-item__qty-btn" data-action="decrease" aria-label="Quitar una unidad de ' + item.name + '">−</button>' +
                '<span class="cart-item__qty-value">' + item.qty + '</span>' +
                '<button type="button" class="cart-item__qty-btn" data-action="increase" aria-label="Agregar una unidad de ' + item.name + '">+</button>' +
            '</div>' +
            '<p class="cart-item__price">' + formatPrice(item.price * item.qty) + '</p>' +
            '<button type="button" class="cart-item__remove" aria-label="Eliminar ' + item.name + ' del carrito">' +
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
                ? 'Tu carrito está vacío.'
                : count + (count === 1 ? ' producto esperando una nueva casa.' : ' productos esperando una nueva casa.');
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

    /* ---------- Abrir / cerrar la vista ----------
       El carrito reemplaza el contenido de <main> (navbar y footer
       siguen visibles, como el resto de la página) en vez de taparlo
       todo con un overlay. */
    function openCart() {
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
        if (e.key === 'Escape' && isCartOpen()) closeCart();
    });

    /* Cualquier enlace ancla (navbar, footer, "Seguir comprando"...)
       cierra el carrito primero, para que el destino —que vive dentro
       de <main>— ya esté visible cuando el navegador salte a él. */
    document.addEventListener('click', function (e) {
        if (!isCartOpen()) return;
        var link = e.target.closest('a[href^="#"]');
        if (link) closeCart();
    });

    /* ---------- Botones "+" de la tienda ---------- */
    for (var a = 0; a < addButtons.length; a++) {
        addButtons[a].addEventListener('click', function () {
            var card = this.closest('.product-card');
            if (!card) return;
            addToCart({
                id: card.getAttribute('data-id'),
                name: card.getAttribute('data-name'),
                category: card.getAttribute('data-category'),
                subtitle: card.getAttribute('data-subtitle'),
                price: card.getAttribute('data-price'),
                image: card.getAttribute('data-image'),
                media: card.getAttribute('data-media')
            });
        });
    }

    render();
})();
