// Pre-loader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Initialiser AOS après le chargement
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100,
                delay: 0
            });
        }, 500);
    }
});

// Initialisation AOS (fallback si le preloader n'existe pas)
if (document.readyState === 'complete') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        delay: 0
    });
}

// Menu hamburger
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const body = document.body;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
});

// Fermer le menu en cliquant sur un lien
const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Barre de recherche de produits
if (document.getElementById('product-search')) {
    const searchInput = document.getElementById('product-search');
    const searchClear = document.getElementById('search-clear');
    const searchButton = document.getElementById('search-button');
    const productsGrid = document.getElementById('products-grid');
    const productCards = productsGrid ? productsGrid.querySelectorAll('.product-card-shop') : [];
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Afficher/masquer le bouton clear
        if (searchTerm.length > 0) {
            searchClear.style.display = 'flex';
        } else {
            searchClear.style.display = 'none';
        }
        
        // Filtrer les produits
        let visibleCount = 0;
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name-shop');
            if (productName) {
                const name = productName.textContent.toLowerCase();
                if (name.includes(searchTerm)) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });
        
        // Afficher un message si aucun produit trouvé
        let noResults = productsGrid.querySelector('.no-results');
        if (visibleCount === 0 && searchTerm.length > 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = '<p>Aucun produit trouvé pour "' + searchTerm + '"</p>';
                productsGrid.appendChild(noResults);
            }
        } else {
            if (noResults) {
                noResults.remove();
            }
        }
    }
    
    searchInput.addEventListener('input', filterProducts);
    
    // Recherche au clic sur le bouton
    searchButton.addEventListener('click', () => {
        filterProducts();
        searchInput.focus();
    });
    
    // Recherche avec la touche Entrée
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterProducts();
        }
    });
    
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        filterProducts();
        searchInput.focus();
    });
}

// Page Détail Produit - Carrousel d'images
if (document.querySelector('.product-image-carousel')) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentImageIndex = 0;
    
    const images = Array.from(thumbnails).map(thumb => thumb.dataset.image);
    
    // Changer l'image principale au clic sur une miniature
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
            updateActiveThumbnail();
        });
    });
    
    // Navigation avec les boutons précédent/suivant
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateMainImage();
            updateActiveThumbnail();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateMainImage();
            updateActiveThumbnail();
        });
    }
    
    function updateMainImage() {
        if (mainImage) {
            mainImage.src = images[currentImageIndex];
            mainImage.alt = `Vue ${currentImageIndex + 1} du produit`;
        }
    }
    
    function updateActiveThumbnail() {
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
}

// Page Détail Produit - Contrôle de quantité
if (document.getElementById('product-quantity')) {
    const quantityInput = document.getElementById('product-quantity');
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');
    
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value) || 1;
            const maxValue = parseInt(quantityInput.max) || 10;
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    // Validation de la quantité
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value) || 1;
        const minValue = parseInt(quantityInput.min) || 1;
        const maxValue = parseInt(quantityInput.max) || 10;
        
        if (value < minValue) {
            quantityInput.value = minValue;
        } else if (value > maxValue) {
            quantityInput.value = maxValue;
        }
    });
}

// Page Détail Produit - Ajout au panier
if (document.getElementById('add-to-cart-btn')) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    
    addToCartBtn.addEventListener('click', () => {
        const productName = document.querySelector('.product-title').textContent;
        const productSize = document.getElementById('product-size').value;
        const productQuantity = parseInt(document.getElementById('product-quantity').value) || 1;
        const productPrice = document.querySelector('.current-price').textContent;
        
        // Animation du bouton
        addToCartBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addToCartBtn.style.transform = '';
        }, 150);
        
        // Mise à jour du compteur du panier
        if (cartCount) {
            let currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + productQuantity;
            
            // Animation du compteur
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = '';
            }, 300);
        }
        
        // Message de confirmation (vous pouvez remplacer par une notification plus élaborée)
        const originalText = addToCartBtn.querySelector('span').textContent;
        addToCartBtn.querySelector('span').textContent = 'Ajouté !';
        addToCartBtn.style.background = '#4caf50';
        
        setTimeout(() => {
            addToCartBtn.querySelector('span').textContent = originalText;
            addToCartBtn.style.background = '';
        }, 2000);
        
        // Ici, vous pouvez ajouter la logique pour sauvegarder dans le localStorage ou envoyer à un serveur
        console.log('Produit ajouté:', {
            name: productName,
            size: productSize,
            quantity: productQuantity,
            price: productPrice
        });
    });
}

