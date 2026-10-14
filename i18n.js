/* ============================================================
   JOMA ANIMALS — Traducción ES/CA
   Sitio bilingüe en el cliente (sin servidor/build): este archivo
   define los diccionarios y el motor que traduce todo lo marcado
   con data-i18n (texto), data-i18n-alt (atributo alt) y
   data-i18n-placeholder (placeholder de inputs).

   Por defecto se usa el idioma del navegador del visitante (catalán
   si su navegador/sistema está en catalán, castellano en cualquier
   otro caso) — no geolocalización por IP, para no depender de un
   servicio externo ni mandar la IP de nadie a ningún sitio. Una vez
   el visitante elige un idioma a mano, esa elección se recuerda
   (localStorage) y ya no se vuelve a inferir.

   Se carga ANTES que script.js: deja listo window.JomaI18n con la
   API que usan tanto este archivo como script.js (para los textos
   que arma dinámicamente: carrito, ficha de producto, etc.).
   ============================================================ */
(function () {
    'use strict';

    var STORAGE_KEY = 'joma-lang';
    var DEFAULT_LANG = 'es';

    var DICT = {
        es: {
            'skip.link': 'Saltar al contenido',

            'topbar.message': 'Productos seleccionados con mucho mimo',
            'topbar.hours1': 'L–V 9:30–13:00 · 16:30–20:00',
            'topbar.hours2': 'Sáb 9:30–13:00',

            'nav.logo.aria': 'Joma Animals — inicio',
            'nav.inicio': 'Inicio',
            'nav.tienda': 'Tienda',
            'nav.search.sr': 'Buscar productos',
            'nav.search.placeholder': 'Buscar productos...',
            'nav.cart.aria': 'Abrir carrito',
            'nav.cart.label': 'Carrito',
            'nav.whatsapp.aria': 'Escríbenos por WhatsApp',
            'nav.whatsapp.label': 'Escríbenos por WhatsApp',
            'nav.toggle.open': 'Abrir menú',
            'nav.toggle.close': 'Cerrar menú',
            'nav.menu.principal': 'Navegación principal',
            'nav.menu.movil': 'Navegación móvil',

            'lang.es': 'Castellano',
            'lang.ca': 'Català',

            'hero.badge': 'Bienestar que se nota',
            'hero.title1': '¡Más felices,',
            'hero.title2': 'más animales!',
            'hero.subtitle': 'Productos de calidad con ingredientes y materiales naturales, respetuosos con el medio ambiente que cuidan de quienes llenan tu casa de pelos y alegría.',
            'hero.cta.shop': 'Ver la tienda',
            'hero.cta.about': 'Conócenos',
            'hero.img.alt': 'Perro golden retriever y gato atigrado descansando juntos sobre una alfombra',

            'categories.badge': 'Todo para ellos',
            'categories.title': '¿Qué necesita tu compañero?',
            'cat.paseo': 'Paseo',
            'cat.encasa': 'En Casa',
            'cat.juguetes': 'Juguetes',
            'cat.cuidado': 'Cuidado',
            'cat.alimentacion': 'Alimentación',
            'cat.paseo.img': 'Cachorro con arnés listo para pasear',
            'cat.encasa.img': 'Gato durmiendo en una cama mullida',
            'cat.juguetes.img': 'Set de juguetes para mascotas: pulpo, pelota, cuerda y hueso',
            'cat.cuidado.img': 'Set de cuidado: cepillo, peine y cortaúñas',
            'cat.alimentacion.img': 'Tazón con comida para mascotas',

            'teaser.badge': 'La tienda',
            'teaser.title1': 'La mayor calidad',
            'teaser.title2': 'para tus pequeños compañeros de vida.',
            'teaser.subtitle': 'Alimentación, higiene, juguetes y mucho más: todo pensado para que tu compañero viva mejor, día a día.',

            'shop.search.sr': 'Buscar producto',
            'shop.search.placeholder': 'Buscar producto',
            'shop.categories.title': 'Categorías',
            'shop.forwho.title': 'Para quién',
            'filter.perros': 'Perros',
            'filter.gatos': 'Gatos',
            'filter.otros': 'Otros',
            'shop.onlyoffers': 'Solo ofertas',
            'shop.clearfilters': 'Limpiar filtros',
            'shop.empty.message': 'No encontramos productos que coincidan con tu búsqueda.',
            'shop.empty.clear': 'Limpiar filtros',
            'shop.tag.offer': 'Oferta',
            'shop.pagination.prev': 'Página anterior',
            'shop.pagination.next': 'Página siguiente',
            'shop.pagination.page': 'Página {n}',
            'stock.low': 'Pocas unidades',
            'stock.out': 'Agotado',

            'benefits.title1': 'Bienestar para todos,',
            'benefits.title2': 'con pelo o sin él',
            'benefits.subtitle': 'Todo lo que ponemos en la tienda se enfoca en la felicidad de tu compañero.',
            'benefit1.title': 'Naturales',
            'benefit1.text': 'Ingredientes buenos, fáciles de entender.',
            'benefit2.title': 'Sin cereales',
            'benefit2.text': 'Opciones para peludos con la tripa delicada.',
            'benefit3.title': 'Hipoalergénicos',
            'benefit3.text': 'Para pieles sensibles y estómagos exigentes.',

            'about.badge': 'Nuestra forma de hacer',
            'about.title1': 'Seleccionamos lo mejor.',
            'about.title2': 'Ellos ponen la alegría.',
            'about.text': 'Nuestro objetivo es el bienestar de los peludos (y no peludos). Elegimos selectivamente productos y artículos naturales, sin tóxicos ni adictivos, evitando así cualquier elemento perjudicial para su salud.',
            'about.feature1': 'Ingredientes orgánicos y de proximidad',
            'about.feature2': 'Estudio específico para cada animal',
            'about.feature3': 'Consejo cercano y honesto',

            'trust.eyebrow': 'Ven a vernos',
            'trust.title1': 'Tu petshop de confianza',
            'trust.title2': '¡más cerca que nunca!',
            'trust.weekday.title': 'Lunes a viernes',
            'trust.saturday.title': 'Sábados',
            'trust.address.title': 'Passeig Sant Cosme',
            'trust.address.text': 'Damià 7 · Sils',
            'trust.map.title': 'Mapa de ubicación de Joma Animals en Sils',

            'footer.explora': 'Explora',
            'footer.visitanos': 'Visítanos',
            'footer.legal': 'Legal',
            'footer.instagram.aria': 'Instagram de Joma Animals',

            'legal.tab.aviso': 'Aviso legal',
            'legal.tab.privacidad': 'Privacidad',
            'legal.tab.condiciones': 'Condiciones de compra',
            'legal.back': 'Volver al inicio',
            'legal.badge': 'Documento legal',
            'legal.aviso.title': 'Aviso legal',
            'legal.privacidad.title': 'Política de privacidad',
            'legal.condiciones.title': 'Condiciones de compra y devoluciones',

            'cart.badge': 'Casi es tuyo',
            'cart.title': 'Tu carrito',
            'cart.empty.subtitle': 'Tu carrito está vacío.',
            'cart.subtitle.one': ' producto esperando una nueva casa.',
            'cart.subtitle.many': ' productos esperando una nueva casa.',
            'cart.empty.message': 'Todavía no agregaste productos. Explora la tienda y encuentra algo para tu compañero.',
            'cart.back': 'Seguir comprando',
            'cart.summary.title': 'Resumen',
            'cart.subtotal': 'Subtotal',
            'cart.envio': 'Envío',
            'cart.envio.later': 'Calculado después',
            'cart.total': 'Total',
            'cart.checkout': 'Finalizar compra',
            'cart.note': 'Compra segura y preparada con cariño',
            'cart.item.remove.aria': 'Eliminar {name} del carrito',
            'cart.item.minus.aria': 'Quitar una unidad de {name}',
            'cart.item.plus.aria': 'Agregar una unidad de {name}',

            'pdp.back': 'Volver a la tienda',
            'pdp.img.prev': 'Foto anterior',
            'pdp.img.next': 'Foto siguiente',
            'pdp.qty.label': 'Cantidad',
            'pdp.qty.minus': 'Quitar una unidad',
            'pdp.qty.plus': 'Agregar una unidad',
            'pdp.add': 'Añadir al carrito',
            'pdp.add.outofstock': 'Agotado',
            'pdp.buy': 'Comprar ahora',
            'pdp.spec.category': 'Categoría',
            'pdp.spec.for': 'Para',
            'pdp.spec.pickup': 'Recogida',
            'pdp.spec.pickup.value': 'En tienda, Sils',
            'pdp.spec.shipping': 'Envío gratis',
            'pdp.spec.shipping.value': 'Desde 40 €',
            'pdp.related.title': 'También te puede interesar',
            'pdp.add.aria': 'Agregar {name} al carrito',

            'checkout.step1': '1. Datos',
            'checkout.step2': '2. Pago',
            'checkout.step3': '3. Listo',
            'checkout.datos.title': 'Tus datos',
            'checkout.nombre': 'Nombre *',
            'checkout.apellidos': 'Apellidos *',
            'checkout.email': 'Correo electrónico *',
            'checkout.telefono': 'Teléfono *',
            'checkout.howreceive': '¿Cómo lo recibes?',
            'checkout.ship.domicilio.title': 'Envío a domicilio',
            'checkout.ship.domicilio.text': '4,90 € · gratis desde 40 €',
            'checkout.ship.tienda.title': 'Recogida en tienda',
            'checkout.ship.tienda.text': 'Gratis · Passeig Sant Cosme, Damià 7, Sils',
            'checkout.direccion': 'Dirección *',
            'checkout.cp': 'Código postal *',
            'checkout.poblacion': 'Población *',
            'checkout.provincia': 'Provincia',
            'checkout.notas': 'Notas para la entrega',
            'checkout.continuar': 'Continuar al pago',
            'checkout.pago.title': 'Pago',
            'checkout.pago.intro': 'Elige cómo quieres pagar tu pedido.',
            'checkout.pay.card.title': 'Tarjeta de crédito o débito',
            'checkout.pay.card.text': 'Visa, Mastercard',
            'checkout.pay.transfer.title': 'Transferencia bancaria',
            'checkout.pay.transfer.text': 'Te mandamos los datos por correo',
            'checkout.pay.cod.title': 'Contra reembolso',
            'checkout.pay.cod.text': 'Pagas al recibir tu pedido',
            'checkout.back': 'Volver',
            'checkout.confirm': 'Confirmar pedido',
            'checkout.thanks.title': '¡Gracias por tu pedido!',
            'checkout.thanks.text': 'Te escribiremos a tu correo con los detalles y el seguimiento del envío.',
            'checkout.thanks.continue': 'Seguir comprando',
            'checkout.summary.title': 'Tu pedido',
            'checkout.subtotal': 'Subtotal',
            'checkout.envio': 'Envío',
            'checkout.total': 'Total',
            'checkout.envio.free': 'Gratis',

            'legal.aviso.updated': 'Última actualización: [fecha]',
            'legal.aviso.s1.title': '1. Datos identificativos',
            'legal.aviso.s1.intro': 'En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa de que este sitio web, <strong>Joma Animals</strong>, es operado por:',
            'legal.aviso.s1.li1': 'Razón social: [Razón social de la empresa]',
            'legal.aviso.s1.li2': 'NIF/CIF: [NIF/CIF]',
            'legal.aviso.s1.li3': 'Domicilio: Passeig Sant Cosme, Damià 7, 17410 Sils (Girona)',
            'legal.aviso.s1.li4': 'Correo de contacto: [correo de contacto]',
            'legal.aviso.s1.li5': 'Teléfono: [teléfono de contacto]',
            'legal.aviso.s1.li6': 'Inscripción registral: [datos de inscripción, si aplica]',
            'legal.aviso.s2.title': '2. Objeto y ámbito de aplicación',
            'legal.aviso.s2.text': 'Este aviso legal regula el uso del sitio web jomaanimals.[dominio] (en adelante, "el sitio web"), que Joma Animals pone a disposición de los usuarios para informar sobre sus productos y permitir su compra online. El acceso y uso del sitio web atribuye la condición de usuario e implica la aceptación de este aviso legal.',
            'legal.aviso.s3.title': '3. Condiciones de acceso y uso',
            'legal.aviso.s3.text': 'El usuario se compromete a hacer un uso adecuado y lícito del sitio web, de conformidad con la legislación vigente, la buena fe y el orden público. Queda prohibido el uso del sitio web con fines ilícitos o lesivos, o que de cualquier forma puedan causar perjuicio o impedir el normal funcionamiento del sitio web.',
            'legal.aviso.s4.title': '4. Propiedad intelectual e industrial',
            'legal.aviso.s4.text': 'Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño, código fuente) son propiedad de Joma Animals o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o comunicación pública sin autorización expresa.',
            'legal.aviso.s5.title': '5. Exclusión de responsabilidad',
            'legal.aviso.s5.text': 'Joma Animals no se hace responsable de los daños y perjuicios que pudieran derivarse de interferencias, interrupciones, virus informáticos o averías en el sitio web, ni de los contenidos de los sitios web a los que pueda enlazar.',
            'legal.aviso.s6.title': '6. Legislación aplicable y jurisdicción',
            'legal.aviso.s6.text': 'Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someterán a los juzgados y tribunales que correspondan conforme a derecho, sin perjuicio de los derechos que asistan a los consumidores como foro de su propio domicilio.',

            'legal.privacidad.updated': 'Última actualización: [fecha]',
            'legal.privacidad.s1.title': '1. Responsable del tratamiento',
            'legal.privacidad.s1.li1': 'Responsable: [Razón social de la empresa]',
            'legal.privacidad.s1.li2': 'NIF/CIF: [NIF/CIF]',
            'legal.privacidad.s1.li3': 'Domicilio: Passeig Sant Cosme, Damià 7, 17410 Sils (Girona)',
            'legal.privacidad.s1.li4': 'Correo de contacto para temas de privacidad: [correo de contacto]',
            'legal.privacidad.s2.title': '2. Finalidad del tratamiento',
            'legal.privacidad.s2.text': 'En Joma Animals tratamos los datos personales que nos facilitas para: gestionar tu pedido y su envío o recogida en tienda, atender tus consultas, y —solo si nos das tu consentimiento expreso— enviarte comunicaciones comerciales por correo electrónico.',
            'legal.privacidad.s3.title': '3. Legitimación',
            'legal.privacidad.s3.text': 'La base legal para el tratamiento de tus datos es la ejecución de la relación contractual (procesar y entregar tu pedido) y, en su caso, tu consentimiento explícito para el envío de comunicaciones comerciales.',
            'legal.privacidad.s4.title': '4. Destinatarios',
            'legal.privacidad.s4.text': 'Tus datos podrán ser comunicados a terceros estrictamente necesarios para prestar el servicio: empresas de transporte y logística, y proveedores de pasarela de pago. No se ceden datos a terceros con fines comerciales ajenos a Joma Animals.',
            'legal.privacidad.s5.title': '5. Derechos de las personas interesadas',
            'legal.privacidad.s5.text': 'Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos escribiendo a [correo de contacto], adjuntando una copia de tu documento de identidad. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es) si consideras que el tratamiento no se ajusta a la normativa.',
            'legal.privacidad.s6.title': '6. Plazo de conservación',
            'legal.privacidad.s6.text': 'Conservamos tus datos mientras exista una relación contractual y, posteriormente, durante los plazos legales de prescripción de responsabilidades (fiscales, contables) que resulten de aplicación.',
            'legal.privacidad.s7.title': '7. Procedencia de los datos',
            'legal.privacidad.s7.text': 'Los datos que tratamos proceden directamente de ti, a través de los formularios de compra y contacto del sitio web.',

            'legal.condiciones.updated': 'Última actualización: [fecha]',
            'legal.condiciones.s1.title': '1. Identificación del vendedor',
            'legal.condiciones.s1.text': 'Las ventas realizadas a través de este sitio web son efectuadas por [Razón social de la empresa], NIF/CIF [NIF/CIF], con domicilio en Passeig Sant Cosme, Damià 7, 17410 Sils (Girona).',
            'legal.condiciones.s2.title': '2. Proceso de compra',
            'legal.condiciones.s2.text': 'Para realizar un pedido, añade los productos al carrito, revisa tu pedido, introduce tus datos de contacto y entrega, elige la forma de pago y confirma la compra. Recibirás un correo electrónico confirmando los detalles de tu pedido.',
            'legal.condiciones.s3.title': '3. Precios e impuestos',
            'legal.condiciones.s3.text': 'Todos los precios mostrados en el sitio web incluyen el IVA aplicable. Los gastos de envío, cuando correspondan, se indican de forma separada antes de confirmar el pedido.',
            'legal.condiciones.s4.title': '4. Forma de pago',
            'legal.condiciones.s4.text': '[Describir aquí los métodos de pago habilitados cuando se integre la pasarela de pago real: tarjeta de crédito/débito, transferencia bancaria o contra reembolso, según corresponda.]',
            'legal.condiciones.s5.title': '5. Envío y recogida',
            'legal.condiciones.s5.text': 'Ofrecemos envío a domicilio (4,90 €, gratuito a partir de 40 € de compra) y recogida gratuita en nuestra tienda de Sils. Los plazos de entrega estimados son de [X] días laborables para envíos a domicilio.',
            'legal.condiciones.s6.title': '6. Derecho de desistimiento',
            'legal.condiciones.s6.text': 'De acuerdo con el Real Decreto Legislativo 1/2007, dispones de un plazo de <strong>14 días naturales</strong> desde la recepción del pedido para desistir de la compra sin necesidad de justificación. Para ejercer este derecho, contáctanos en [correo de contacto] indicando tu número de pedido. Los productos deben devolverse en su estado y embalaje originales.',
            'legal.condiciones.s7.title': '7. Procedimiento de devolución',
            'legal.condiciones.s7.text': 'Una vez recibida la solicitud de devolución, te indicaremos cómo hacernos llegar el producto. Los gastos de devolución corren por cuenta del cliente, salvo que el producto esté defectuoso o el envío haya sido un error nuestro. El reembolso se realizará por el mismo método de pago utilizado en la compra, en un plazo máximo de 14 días desde que recibamos el producto devuelto.',
            'legal.condiciones.s8.title': '8. Garantías',
            'legal.condiciones.s8.text': 'Todos los productos cuentan con la garantía legal de conformidad prevista en la normativa de consumidores. Si recibes un producto defectuoso, contáctanos y lo sustituiremos o repararemos sin coste alguno.'
        },

        ca: {
            'skip.link': 'Salta al contingut',

            'topbar.message': 'Productes seleccionats amb molta cura',
            'topbar.hours1': 'Dl–Dv 9:30–13:00 · 16:30–20:00',
            'topbar.hours2': 'Dis 9:30–13:00',

            'nav.logo.aria': 'Joma Animals — inici',
            'nav.inicio': 'Inici',
            'nav.tienda': 'Botiga',
            'nav.search.sr': 'Cercar productes',
            'nav.search.placeholder': 'Cerca productes...',
            'nav.cart.aria': 'Obre la cistella',
            'nav.cart.label': 'Cistella',
            'nav.whatsapp.aria': 'Escriu-nos per WhatsApp',
            'nav.whatsapp.label': 'Escriu-nos per WhatsApp',
            'nav.toggle.open': 'Obre el menú',
            'nav.toggle.close': 'Tanca el menú',
            'nav.menu.principal': 'Navegació principal',
            'nav.menu.movil': 'Navegació mòbil',

            'lang.es': 'Castellà',
            'lang.ca': 'Català',

            'hero.badge': 'Benestar que es nota',
            'hero.title1': 'Més feliços,',
            'hero.title2': 'més animals!',
            'hero.subtitle': "Productes de qualitat amb ingredients i materials naturals, respectuosos amb el medi ambient, que tenen cura de qui omple casa teva de pèl i alegria.",
            'hero.cta.shop': 'Veure la botiga',
            'hero.cta.about': 'Coneix-nos',
            'hero.img.alt': 'Gos golden retriever i gat atigrat descansant junts sobre una catifa',

            'categories.badge': 'Tot per a ells',
            'categories.title': 'Què necessita el teu company?',
            'cat.paseo': 'Passeig',
            'cat.encasa': 'A Casa',
            'cat.juguetes': 'Joguines',
            'cat.cuidado': 'Cura',
            'cat.alimentacion': 'Alimentació',
            'cat.paseo.img': 'Cadell amb arnès a punt per passejar',
            'cat.encasa.img': 'Gat dormint en un llit tou',
            'cat.juguetes.img': 'Set de joguines per a mascotes: pop, pilota, corda i os',
            'cat.cuidado.img': 'Set de cura: raspall, pinta i tallaungles',
            'cat.alimentacion.img': 'Bol amb menjar per a mascotes',

            'teaser.badge': 'La botiga',
            'teaser.title1': 'La millor qualitat',
            'teaser.title2': 'per als teus petits companys de vida.',
            'teaser.subtitle': 'Alimentació, higiene, joguines i molt més: tot pensat perquè el teu company visqui millor, dia a dia.',

            'shop.search.sr': 'Cercar producte',
            'shop.search.placeholder': 'Cerca producte',
            'shop.categories.title': 'Categories',
            'shop.forwho.title': 'Per a qui',
            'filter.perros': 'Gossos',
            'filter.gatos': 'Gats',
            'filter.otros': 'Altres',
            'shop.onlyoffers': 'Només ofertes',
            'shop.clearfilters': 'Neteja els filtres',
            'shop.empty.message': 'No hem trobat productes que coincideixin amb la teva cerca.',
            'shop.empty.clear': 'Neteja els filtres',
            'shop.tag.offer': 'Oferta',
            'shop.pagination.prev': 'Pàgina anterior',
            'shop.pagination.next': 'Pàgina següent',
            'shop.pagination.page': 'Pàgina {n}',
            'stock.low': 'Poques unitats',
            'stock.out': 'Esgotat',

            'benefits.title1': 'Benestar per a tots,',
            'benefits.title2': 'amb pèl o sense',
            'benefits.subtitle': 'Tot el que posem a la botiga se centra en la felicitat del teu company.',
            'benefit1.title': 'Naturals',
            'benefit1.text': "Ingredients bons, fàcils d'entendre.",
            'benefit2.title': 'Sense cereals',
            'benefit2.text': 'Opcions per a peluts amb la panxa delicada.',
            'benefit3.title': 'Hipoal·lergènics',
            'benefit3.text': 'Per a pells sensibles i estómacs exigents.',

            'about.badge': 'La nostra manera de fer',
            'about.title1': 'Seleccionem el millor.',
            'about.title2': "Ells hi posen l'alegria.",
            'about.text': "El nostre objectiu és el benestar dels peluts (i no peluts). Triem de manera selectiva productes i articles naturals, sense tòxics ni addictius, evitant així qualsevol element perjudicial per a la seva salut.",
            'about.feature1': 'Ingredients orgànics i de proximitat',
            'about.feature2': 'Estudi específic per a cada animal',
            'about.feature3': 'Consell proper i honest',

            'trust.eyebrow': "Vine a veure'ns",
            'trust.title1': 'La teva botiga de confiança',
            'trust.title2': 'més a prop que mai!',
            'trust.weekday.title': 'Dilluns a divendres',
            'trust.saturday.title': 'Dissabtes',
            'trust.address.title': 'Passeig Sant Cosme',
            'trust.address.text': 'Damià 7 · Sils',
            'trust.map.title': 'Mapa d\'ubicació de Joma Animals a Sils',

            'footer.explora': 'Explora',
            'footer.visitanos': "Visita'ns",
            'footer.legal': 'Legal',
            'footer.instagram.aria': 'Instagram de Joma Animals',

            'legal.tab.aviso': 'Avís legal',
            'legal.tab.privacidad': 'Privacitat',
            'legal.tab.condiciones': 'Condicions de compra',
            'legal.back': "Torna a l'inici",
            'legal.badge': 'Document legal',
            'legal.aviso.title': 'Avís legal',
            'legal.privacidad.title': 'Política de privacitat',
            'legal.condiciones.title': 'Condicions de compra i devolucions',

            'cart.badge': 'Gairebé és teu',
            'cart.title': 'La teva cistella',
            'cart.empty.subtitle': 'La teva cistella està buida.',
            'cart.subtitle.one': ' producte esperant una nova llar.',
            'cart.subtitle.many': ' productes esperant una nova llar.',
            'cart.empty.message': 'Encara no has afegit productes. Explora la botiga i troba alguna cosa per al teu company.',
            'cart.back': 'Continua comprant',
            'cart.summary.title': 'Resum',
            'cart.subtotal': 'Subtotal',
            'cart.envio': 'Enviament',
            'cart.envio.later': 'Es calcula després',
            'cart.total': 'Total',
            'cart.checkout': 'Finalitza la compra',
            'cart.note': 'Compra segura i preparada amb estima',
            'cart.item.remove.aria': 'Elimina {name} de la cistella',
            'cart.item.minus.aria': 'Treu una unitat de {name}',
            'cart.item.plus.aria': 'Afegeix una unitat de {name}',

            'pdp.back': 'Torna a la botiga',
            'pdp.img.prev': 'Foto anterior',
            'pdp.img.next': 'Foto següent',
            'pdp.qty.label': 'Quantitat',
            'pdp.qty.minus': 'Treu una unitat',
            'pdp.qty.plus': 'Afegeix una unitat',
            'pdp.add': 'Afegeix a la cistella',
            'pdp.add.outofstock': 'Esgotat',
            'pdp.buy': 'Compra ara',
            'pdp.spec.category': 'Categoria',
            'pdp.spec.for': 'Per a',
            'pdp.spec.pickup': 'Recollida',
            'pdp.spec.pickup.value': 'A la botiga, Sils',
            'pdp.spec.shipping': 'Enviament gratuït',
            'pdp.spec.shipping.value': 'Des de 40 €',
            'pdp.related.title': 'També et pot interessar',
            'pdp.add.aria': 'Afegeix {name} a la cistella',

            'checkout.step1': '1. Dades',
            'checkout.step2': '2. Pagament',
            'checkout.step3': '3. Llest',
            'checkout.datos.title': 'Les teves dades',
            'checkout.nombre': 'Nom *',
            'checkout.apellidos': 'Cognoms *',
            'checkout.email': 'Correu electrònic *',
            'checkout.telefono': 'Telèfon *',
            'checkout.howreceive': 'Com ho reps?',
            'checkout.ship.domicilio.title': 'Enviament a domicili',
            'checkout.ship.domicilio.text': '4,90 € · gratuït a partir de 40 €',
            'checkout.ship.tienda.title': 'Recollida a la botiga',
            'checkout.ship.tienda.text': 'Gratuïta · Passeig Sant Cosme, Damià 7, Sils',
            'checkout.direccion': 'Adreça *',
            'checkout.cp': 'Codi postal *',
            'checkout.poblacion': 'Població *',
            'checkout.provincia': 'Província',
            'checkout.notas': 'Notes per al lliurament',
            'checkout.continuar': 'Continua al pagament',
            'checkout.pago.title': 'Pagament',
            'checkout.pago.intro': 'Tria com vols pagar la teva comanda.',
            'checkout.pay.card.title': 'Targeta de crèdit o dèbit',
            'checkout.pay.card.text': 'Visa, Mastercard',
            'checkout.pay.transfer.title': 'Transferència bancària',
            'checkout.pay.transfer.text': "T'enviem les dades per correu",
            'checkout.pay.cod.title': 'Contra reemborsament',
            'checkout.pay.cod.text': 'Pagues en rebre la comanda',
            'checkout.back': 'Torna',
            'checkout.confirm': 'Confirma la comanda',
            'checkout.thanks.title': 'Gràcies per la teva comanda!',
            'checkout.thanks.text': "T'escriurem al correu amb els detalls i el seguiment de l'enviament.",
            'checkout.thanks.continue': 'Continua comprant',
            'checkout.summary.title': 'La teva comanda',
            'checkout.subtotal': 'Subtotal',
            'checkout.envio': 'Enviament',
            'checkout.total': 'Total',
            'checkout.envio.free': 'Gratuït',

            'legal.aviso.updated': 'Darrera actualització: [data]',
            'legal.aviso.s1.title': '1. Dades identificatives',
            'legal.aviso.s1.intro': "En compliment de l'article 10 de la Llei 34/2002, de Serveis de la Societat de la Informació i Comerç Electrònic (LSSI-CE), s'informa que aquest lloc web, <strong>Joma Animals</strong>, és operat per:",
            'legal.aviso.s1.li1': "Raó social: [Raó social de l'empresa]",
            'legal.aviso.s1.li2': 'NIF/CIF: [NIF/CIF]',
            'legal.aviso.s1.li3': 'Domicili: Passeig Sant Cosme, Damià 7, 17410 Sils (Girona)',
            'legal.aviso.s1.li4': 'Correu de contacte: [correu de contacte]',
            'legal.aviso.s1.li5': 'Telèfon: [telèfon de contacte]',
            'legal.aviso.s1.li6': "Inscripció registral: [dades d'inscripció, si escau]",
            'legal.aviso.s2.title': "2. Objecte i àmbit d'aplicació",
            'legal.aviso.s2.text': 'Aquest avís legal regula l\'ús del lloc web jomaanimals.[domini] (d\'ara endavant, "el lloc web"), que Joma Animals posa a disposició dels usuaris per informar sobre els seus productes i permetre\'n la compra en línia. L\'accés i l\'ús del lloc web atribueix la condició d\'usuari i implica l\'acceptació d\'aquest avís legal.',
            'legal.aviso.s3.title': "3. Condicions d'accés i ús",
            'legal.aviso.s3.text': "L'usuari es compromet a fer un ús adequat i lícit del lloc web, de conformitat amb la legislació vigent, la bona fe i l'ordre públic. Queda prohibit l'ús del lloc web amb finalitats il·lícites o lesives, o que de qualsevol manera puguin causar perjudici o impedir el funcionament normal del lloc web.",
            'legal.aviso.s4.title': "4. Propietat intel·lectual i industrial",
            'legal.aviso.s4.text': "Tots els continguts del lloc web (textos, imatges, logotips, disseny, codi font) són propietat de Joma Animals o de tercers que n'han autoritzat l'ús, i estan protegits per la normativa de propietat intel·lectual i industrial. Queda prohibida la seva reproducció, distribució o comunicació pública sense autorització expressa.",
            'legal.aviso.s5.title': '5. Exclusió de responsabilitat',
            'legal.aviso.s5.text': "Joma Animals no es fa responsable dels danys i perjudicis que puguin derivar-se d'interferències, interrupcions, virus informàtics o avaries en el lloc web, ni dels continguts dels llocs web als quals pugui enllaçar.",
            'legal.aviso.s6.title': '6. Legislació aplicable i jurisdicció',
            'legal.aviso.s6.text': 'Aquest avís legal es regeix per la legislació espanyola. Per a qualsevol controvèrsia, les parts se sotmetran als jutjats i tribunals que corresponguin conforme a dret, sense perjudici dels drets que assisteixin els consumidors com a fur del seu propi domicili.',

            'legal.privacidad.updated': 'Darrera actualització: [data]',
            'legal.privacidad.s1.title': '1. Responsable del tractament',
            'legal.privacidad.s1.li1': "Responsable: [Raó social de l'empresa]",
            'legal.privacidad.s1.li2': 'NIF/CIF: [NIF/CIF]',
            'legal.privacidad.s1.li3': 'Domicili: Passeig Sant Cosme, Damià 7, 17410 Sils (Girona)',
            'legal.privacidad.s1.li4': 'Correu de contacte per a temes de privacitat: [correu de contacte]',
            'legal.privacidad.s2.title': '2. Finalitat del tractament',
            'legal.privacidad.s2.text': "A Joma Animals tractem les dades personals que ens facilites per: gestionar la teva comanda i el seu enviament o recollida a la botiga, atendre les teves consultes i —només si ens dones el teu consentiment exprés— enviar-te comunicacions comercials per correu electrònic.",
            'legal.privacidad.s3.title': '3. Legitimació',
            'legal.privacidad.s3.text': "La base legal per al tractament de les teves dades és l'execució de la relació contractual (processar i lliurar la teva comanda) i, si escau, el teu consentiment explícit per a l'enviament de comunicacions comercials.",
            'legal.privacidad.s4.title': '4. Destinataris',
            'legal.privacidad.s4.text': "Les teves dades podran ser comunicades a tercers estrictament necessaris per prestar el servei: empreses de transport i logística, i proveïdors de passarel·la de pagament. No se cedeixen dades a tercers amb finalitats comercials alienes a Joma Animals.",
            'legal.privacidad.s5.title': '5. Drets de les persones interessades',
            'legal.privacidad.s5.text': "Pots exercir els teus drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat de les teves dades escrivint a [correu de contacte], adjuntant una còpia del teu document d'identitat. També tens dret a presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (aepd.es) si consideres que el tractament no s'ajusta a la normativa.",
            'legal.privacidad.s6.title': '6. Termini de conservació',
            'legal.privacidad.s6.text': 'Conservem les teves dades mentre existeixi una relació contractual i, posteriorment, durant els terminis legals de prescripció de responsabilitats (fiscals, comptables) que resultin d\'aplicació.',
            'legal.privacidad.s7.title': '7. Procedència de les dades',
            'legal.privacidad.s7.text': "Les dades que tractem procedeixen directament de tu, a través dels formularis de compra i contacte del lloc web.",

            'legal.condiciones.updated': 'Darrera actualització: [data]',
            'legal.condiciones.s1.title': '1. Identificació del venedor',
            'legal.condiciones.s1.text': "Les vendes realitzades a través d'aquest lloc web són efectuades per [Raó social de l'empresa], NIF/CIF [NIF/CIF], amb domicili a Passeig Sant Cosme, Damià 7, 17410 Sils (Girona).",
            'legal.condiciones.s2.title': '2. Procés de compra',
            'legal.condiciones.s2.text': "Per fer una comanda, afegeix els productes a la cistella, revisa la teva comanda, introdueix les teves dades de contacte i lliurament, tria la forma de pagament i confirma la compra. Rebràs un correu electrònic confirmant els detalls de la teva comanda.",
            'legal.condiciones.s3.title': '3. Preus i impostos',
            'legal.condiciones.s3.text': "Tots els preus mostrats al lloc web inclouen l'IVA aplicable. Les despeses d'enviament, quan correspongui, s'indiquen de forma separada abans de confirmar la comanda.",
            'legal.condiciones.s4.title': '4. Forma de pagament',
            'legal.condiciones.s4.text': "[Descriu aquí els mètodes de pagament habilitats quan s'integri la passarel·la de pagament real: targeta de crèdit/dèbit, transferència bancària o contra reemborsament, segons correspongui.]",
            'legal.condiciones.s5.title': '5. Enviament i recollida',
            'legal.condiciones.s5.text': 'Oferim enviament a domicili (4,90 €, gratuït a partir de 40 € de compra) i recollida gratuïta a la nostra botiga de Sils. Els terminis de lliurament estimats són de [X] dies laborables per a enviaments a domicili.',
            'legal.condiciones.s6.title': '6. Dret de desistiment',
            'legal.condiciones.s6.text': "D'acord amb el Reial decret legislatiu 1/2007, disposes d'un termini de <strong>14 dies naturals</strong> des de la recepció de la comanda per desistir de la compra sense necessitat de justificació. Per exercir aquest dret, contacta'ns a [correu de contacte] indicant el teu número de comanda. Els productes s'han de retornar en el seu estat i embalatge originals.",
            'legal.condiciones.s7.title': '7. Procediment de devolució',
            'legal.condiciones.s7.text': "Un cop rebuda la sol·licitud de devolució, t'indicarem com fer-nos arribar el producte. Les despeses de devolució corren a càrrec del client, llevat que el producte estigui defectuós o l'enviament hagi estat un error nostre. El reemborsament es realitzarà pel mateix mètode de pagament utilitzat en la compra, en un termini màxim de 14 dies des que rebem el producte retornat.",
            'legal.condiciones.s8.title': '8. Garanties',
            'legal.condiciones.s8.text': "Tots els productes compten amb la garantia legal de conformitat prevista a la normativa de consumidors. Si reps un producte defectuós, contacta'ns i el substituirem o repararem sense cap cost."
        }
    };

    /* ---------- Detección del idioma inicial ---------- */
    function detectInitialLang() {
        try {
            var saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved === 'es' || saved === 'ca') return saved;
        } catch (e) { /* localStorage no disponible: seguimos sin memoria */ }

        var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
        for (var i = 0; i < langs.length; i++) {
            if (/^ca\b/i.test(langs[i])) return 'ca';
        }
        return DEFAULT_LANG;
    }

    var currentLang = detectInitialLang();

    function t(key, vars) {
        var dict = DICT[currentLang] || DICT[DEFAULT_LANG];
        var str = (dict && dict[key] !== undefined) ? dict[key] : (DICT[DEFAULT_LANG][key] !== undefined ? DICT[DEFAULT_LANG][key] : key);
        if (vars) {
            for (var k in vars) {
                str = str.replace('{' + k + '}', vars[k]);
            }
        }
        return str;
    }

    function applyToDom() {
        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
        }
        var altNodes = document.querySelectorAll('[data-i18n-alt]');
        for (var j = 0; j < altNodes.length; j++) {
            altNodes[j].setAttribute('alt', t(altNodes[j].getAttribute('data-i18n-alt')));
        }
        var placeholderNodes = document.querySelectorAll('[data-i18n-placeholder]');
        for (var k = 0; k < placeholderNodes.length; k++) {
            placeholderNodes[k].setAttribute('placeholder', t(placeholderNodes[k].getAttribute('data-i18n-placeholder')));
        }
        var ariaNodes = document.querySelectorAll('[data-i18n-aria]');
        for (var m = 0; m < ariaNodes.length; m++) {
            ariaNodes[m].setAttribute('aria-label', t(ariaNodes[m].getAttribute('data-i18n-aria')));
        }
        var titleNodes = document.querySelectorAll('[data-i18n-title]');
        for (var n = 0; n < titleNodes.length; n++) {
            titleNodes[n].setAttribute('title', t(titleNodes[n].getAttribute('data-i18n-title')));
        }
        /* Para los pocos párrafos legales que llevan una palabra en
           <strong> en medio de la frase (ej. "14 días naturales") —
           el contenido es nuestro, de confianza, no de usuarios. */
        var htmlNodes = document.querySelectorAll('[data-i18n-html]');
        for (var h = 0; h < htmlNodes.length; h++) {
            htmlNodes[h].innerHTML = t(htmlNodes[h].getAttribute('data-i18n-html'));
        }
        document.documentElement.setAttribute('lang', currentLang);

        var buttons = document.querySelectorAll('.lang-switch__btn');
        for (var b = 0; b < buttons.length; b++) {
            buttons[b].classList.toggle('is-active', buttons[b].getAttribute('data-lang') === currentLang);
        }
    }

    function setLang(lang) {
        if (lang !== 'es' && lang !== 'ca') return;
        currentLang = lang;
        try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* sin memoria persistente, sigue funcionando en la sesión actual */ }
        applyToDom();
        if (window.JomaI18n && typeof window.JomaI18n.onChange === 'function') {
            window.JomaI18n.onChange(lang);
        }
        document.dispatchEvent(new CustomEvent('joma:langchange', { detail: { lang: lang } }));
    }

    /* API pública: la usa este archivo y también script.js (para
       traducir los textos que arma dinámicamente: carrito, ficha de
       producto, productos relacionados...). */
    window.JomaI18n = {
        t: t,
        getLang: function () { return currentLang; },
        setLang: setLang,
        onChange: null /* script.js puede engancharse aquí si lo necesita */
    };

    document.documentElement.setAttribute('lang', currentLang);

    document.addEventListener('DOMContentLoaded', function () {
        applyToDom();

        var switchButtons = document.querySelectorAll('.lang-switch__btn');
        for (var i = 0; i < switchButtons.length; i++) {
            switchButtons[i].addEventListener('click', function () {
                setLang(this.getAttribute('data-lang'));
            });
        }
    });
})();
