document.addEventListener('DOMContentLoaded', function() {

    cartBtn = document.querySelector('.cart-btn');
    cartOverlay = document.querySelector('.cart-overlay');
    closeCart = document.querySelector('.close-cart');
  
    cartBtn.addEventListener('click', () => {
        updateCartModal();
        cartOverlay.style.display = 'flex';
    });
  
    closeCart.addEventListener('click', () => {
        cartOverlay.style.display = 'none';
    });
  
    // 🔁 باقي كودك مثل checkout وهكذا...
  
    const sliderContainer = document.querySelector('.slider-container');
    const slides = [
        'images/slider1.jpg',
        'images/slider2.jpg',
        'images/slider3.jpg',
        'images/slider4.jpg',
        'images/slider5.jpg'
    ];
    
    let currentSlide = 0;
    
    // إنشاء الشرائح
    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = 'slide';
        slideElement.innerHTML = `<img src="${slide}" alt="صورة عرض ${index + 1}" loading="lazy">`;
        sliderContainer.appendChild(slideElement);
    });
    
    // أزرار التنقل
    const sliderNav = document.createElement('div');
    sliderNav.className = 'slider-nav';
    sliderNav.innerHTML = `
        <button class="prev-slide">&#10094;</button>
        <button class="next-slide">&#10095;</button>
    `;
    document.querySelector('.hero-slider').appendChild(sliderNav);
    
    // النقاط الدالة
    const sliderDots = document.createElement('div');
    sliderDots.className = 'slider-dots';
    slides.forEach((_, index) => {
        sliderDots.innerHTML += `<button data-index="${index}"></button>`;
    });
    document.querySelector('.hero-slider').appendChild(sliderDots);
    
    // تحديث الشريط
    function updateSlider() {
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        // تحديث النقاط النشطة
        document.querySelectorAll('.slider-dots button').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // التلقائي
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 3000);
    
    // الأحداث
    document.querySelector('.prev-slide').addEventListener('click', () => {
        clearInterval(slideInterval);
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 3000);
    });
    
    document.querySelector('.next-slide').addEventListener('click', () => {
        clearInterval(slideInterval);
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 3000);
    });
    
    // النقاط الدالة
    document.querySelectorAll('.slider-dots button').forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            currentSlide = parseInt(dot.getAttribute('data-index'));
            updateSlider();
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            }, 3000);
        });
    });
    
    // التكيف مع حجم الشاشة
    window.addEventListener('resize', updateSlider);
});

// متغيرات السلة
let cart = [];
let cartCount = document.querySelector('.cart-count');
let cartBtn = document.querySelector('.cart-btn');
let cartOverlay = document.querySelector('.cart-overlay');
let closeCart = document.querySelector('.close-cart');
let checkoutBtn = document.querySelector('.checkout-btn');
let checkoutOverlay = document.querySelector('.checkout-overlay');
let closeCheckout = document.querySelector('.close-checkout');
let checkoutForm = document.querySelector('.checkout-form');
let searchInput = document.getElementById('search-input');
let brandsContainer = document.getElementById('brands-container');
let brandsSection = document.getElementById('brands-section');
let brandsProductsContainer = document.getElementById('brands-products-container');

// متغيرات لتخزين البيانات
let brandsData = [];
let productsData = [];

// تحميل البيانات من ملف JSON
function loadData() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            brandsData = data.brands.map(brand => ({
                id: brand.id,
                nameAr: brand.nameAr,
                nameEn: brand.nameEn,
                logo: brand.logo
            }));
            
            productsData = [];
            data.brands.forEach(brand => {
                brand.perfumes.forEach(perfume => {
                    productsData.push({
                        id: perfume.id,
                        brandId: brand.id,
                        brandNameAr: brand.nameAr,
                        brandNameEn: brand.nameEn,
                        nameAr: perfume.nameAr,
                        nameEn: perfume.nameEn,
                        image: perfume.image,
                        prices: perfume.prices
                    });
                });
            });
            
            displayBrands();
            displayProducts(productsData);
            setupBrandsSlider();
        })
        .catch(error => console.error('Error loading data:', error));
}

// عرض البراندات
function displayBrands() {
    brandsContainer.innerHTML = '';
    
    brandsData.forEach(brand => {
        const brandCard = document.createElement('div');
        brandCard.className = 'brand-card';
        brandCard.dataset.brandId = brand.id;
        
        brandCard.innerHTML = `
            <div class="brand-logo">
                <img src="${brand.logo}" alt="${brand.nameAr}" loading="lazy">
            </div>
            <div class="brand-info">
                <h3>${brand.nameAr}</h3>
                <p>${brand.nameEn}</p>
            </div>
        `;
        
        brandsContainer.appendChild(brandCard);
        
        brandCard.addEventListener('click', () => {
            const brandSection = document.getElementById(brand.id);
            if (brandSection) {
                brandSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// عرض المنتجات
function displayProducts(products) {
    brandsProductsContainer.innerHTML = '';
    
    // تجميع المنتجات حسب البراند
    const productsByBrand = {};
    products.forEach(product => {
        if (!productsByBrand[product.brandId]) {
            productsByBrand[product.brandId] = [];
        }
        productsByBrand[product.brandId].push(product);
    });
    
    // إنشاء أقسام لكل براند
    for (const brandId in productsByBrand) {
        const brand = brandsData.find(b => b.id === brandId);
        if (!brand) continue;
        
        const brandSection = document.createElement('section');
        brandSection.className = 'brand-section';
        brandSection.id = brandId;
        
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = `عطور ${brand.nameAr}`;
        
        const productsContainer = document.createElement('div');
        productsContainer.className = 'products-container';
        productsContainer.dataset.brand = brandId;
        
        brandSection.appendChild(sectionTitle);
        brandSection.appendChild(productsContainer);
        brandsProductsContainer.appendChild(brandSection);
        
        // عرض منتجات هذا البراند
        productsByBrand[brandId].forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    }
}

// دالة مساعدة لإنشاء بطاقة المنتج
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    let priceOptions = '';
    for (const size in product.prices) {
        const price = product.prices[size];
        priceOptions += `
            <option value="${size}|${price}">${size} مل - ${price} دينار</option>
        `;
    }
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.nameAr}" loading="lazy">
        </div>
        <div class="product-info">
            <h3>${product.nameAr} <span class="english-name">${product.nameEn}</span></h3>
            <p>${product.brandNameAr} <span class="english-name">${product.brandNameEn}</span></p>
            <select class="size-select">
                ${priceOptions}
            </select>
            <div class="quantity-controls">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">1</span>
                <button class="quantity-btn plus">+</button>
            </div>
            <button class="add-to-cart">أضف إلى السلة</button>
            <button class="details-btn">تفاصيل العطر</button>
        </div>
    `;
    
    // إضافة حدث لزر التفاصيل
    const detailsBtn = productCard.querySelector('.details-btn');
    detailsBtn.addEventListener('click', () => {
        openPerfumeDetails(product.id, product);
    });
    
    // بقية الأحداث الأصلية
    const addToCartBtn = productCard.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const sizeSelect = productCard.querySelector('.size-select');
        const [size, price] = sizeSelect.value.split('|');
        const quantity = parseInt(productCard.querySelector('.quantity').textContent);
        
        addToCart({
            id: product.id,
            name: `${product.nameAr} - ${product.brandNameAr}`,
            size: size.replace('ml', ''),
            price: parseInt(price),
            quantity: quantity
        });
    });
    
    const minusBtn = productCard.querySelector('.minus');
    const plusBtn = productCard.querySelector('.plus');
    const quantityDisplay = productCard.querySelector('.quantity');
    
    minusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityDisplay.textContent);
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityDisplay.textContent);
        quantity++;
        quantityDisplay.textContent = quantity;
    });
    
    return productCard;
}

// إضافة منتج إلى السلة
function addToCart(product) {
    const existingItem = cart.find(item => 
        item.id === product.id && item.size === product.size
    );
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    updateCartCount();
    
    // إظهار تنبيه بإضافة المنتج
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = '✅ تم إضافة المنتج إلى السلة';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// دالة مساعدة للحصول على صورة المنتج
function getProductImage(productId) {
    const product = productsData.find(p => p.id === productId);
    return product ? product.image : '';
}

// حساب المجموع الكلي
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// تحديث عداد السلة
function updateCartCount() {
    let count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// دالة لتفعيل سحب الماوس أو اللمس
function setupBrandsSlider() {
    const slider = document.querySelector('.brands-slider');
    const container = document.querySelector('.brands-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    // سحب بالماوس
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // سرعة السحب
        slider.scrollLeft = scrollLeft - walk;
    });

    // السحب بالإصبع على الأجهزة اللمسية
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchend', () => {
        isDown = false;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// البحث عن المنتجات
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredProducts = productsData.filter(product => 
        product.nameAr.toLowerCase().includes(searchTerm) || 
        product.nameEn.toLowerCase().includes(searchTerm) ||
        product.brandNameAr.toLowerCase().includes(searchTerm) ||
        product.brandNameEn.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
});

// إدارة عرض/إخفاء الأسئلة الشائعة
document.addEventListener('DOMContentLoaded', function() {
    const faqToggleBtn = document.querySelector('.faq-toggle-btn');
    const faqContent = document.querySelector('.faq-content');
    
    if (faqToggleBtn && faqContent) {
        faqToggleBtn.addEventListener('click', () => {
            if (faqContent.style.display === 'none') {
                faqContent.style.display = 'block';
                faqToggleBtn.textContent = 'إخفاء الأسئلة الشائعة';
            } else {
                faqContent.style.display = 'none';
                faqToggleBtn.textContent = 'الأسئلة الشائعة';
            }
        });
    }
});

// بيانات تفاصيل العطور
const perfumeDetails = {
    "hacivat": {
        features: "عطر خشبي بلوطي مع لمسات من الأناناس والبرغموت، يعطي إحساساً بالأناقة والقوة.",
        country: "تركيا",
        season: "جميع الفصول",
        gender: "رجال"
    },
    "ani-x": {
        features: "مزيج من الفانيليا والزنجبيل مع لمسات من خشب الصندل، عطر دافئ وجذاب.",
        country: "تركيا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين"
    },
    "dzairo": {
        features: "عطر زهري مع لمسات من البرغموت والفلفل الوردي، أنثوي وجريء.",
        country: "تركيا",
        season: "الربيع، الصيف",
        gender: "نساء"
    },
    "ani": {
        features: "عطر خشبي فانيليا مع لمسات من الزنجبيل، دافئ ومثير.",
        country: "تركيا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين"
    },
    "purpose-50": {
        features: "عطر خشبي توابل مع لمسات من الفلفل الأسود والعنبر، قوي وثابت.",
        country: "عمان",
        season: "الشتاء، الخريف",
        gender: "رجال"
    },
    "jubilation-40": {
        features: "عطر فاخر يجمع بين الفواكه والتوابل والخشب، كلاسيكي وأنيق.",
        country: "عمان",
        season: "جميع الفصول",
        gender: "رجال"
    },
    "reflection-45": {
        features: "عطر زهري نقي مع لمسات من الياسمين والمسك، أنيق وحديث.",
        country: "عمان",
        season: "الربيع، الصيف",
        gender: "رجال"
    },
    "beach-hut": {
        features: "عطر نباتي منعش مع لمسات من النعناع وأوراق التبغ، منعش ومثير.",
        country: "عمان",
        season: "الصيف",
        gender: "كلا الجنسين"
    },
    "tobacco": {
        features: "عطر خشبي دافئ مع لمسات من التبغ والفانيليا، كلاسيكي وجذاب.",
        country: "تركيا",
        season: "الشتاء، الخريف",
        gender: "رجال"
    },
    "oud": {
        features: "عطر خشبي عنبري مع لمسات من العود والورد، فاخر ومميز.",
        country: "عمان",
        season: "جميع الفصول",
        gender: "كلا الجنسين"
    },
    "rose": {
        features: "عطر زهري ناعم مع لمسات من الورد والمسك، أنثوي ورومانسي.",
        country: "تركيا",
        season: "الربيع، الصيف",
        gender: "نساء"
    },
    "citrus": {
        features: "عطر حمضي منعش مع لمسات من البرغموت والليمون، منعش ونشط.",
        country: "عمان",
        season: "الصيف",
        gender: "كلا الجنسين"
    },
    "vanilla": {
        features: "عطر حلو دافئ مع لمسات من الفانيليا والكهرمان، مريح وجذاب.",
        country: "تركيا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين"
    },
    "spicy": {
        features: "عطر توابل قوي مع لمسات من الفلفل والقرنفل، حار ومثير.",
        country: "عمان",
        season: "الشتاء",
        gender: "رجال"
    },
    "floral": {
        features: "عطر زهري معطر مع لمسات من الياسمين والزنبق، أنثوي وأنيق.",
        country: "تركيا",
        season: "الربيع",
        gender: "نساء"
    },
    "aquatic": {
        features: "عطر مائي منعش مع لمسات من الأعشاب البحرية، منعش وحيوي.",
        country: "عمان",
        season: "الصيف",
        gender: "كلا الجنسين"
    },
    "woody": {
        features: "عطر خشبي عميق مع لمسات من الصندل والباتشولي، قوي وثابت.",
        country: "تركيا",
        season: "جميع الفصول",
        gender: "رجال"
    },
    "fresh": {
        features: "عطر منعش مع لمسات من النعناع والخيار، منعش ونقي.",
        country: "عمان",
        season: "الصيف",
        gender: "كلا الجنسين"
    },
    "oriental": {
        features: "عطر شرقي غني مع لمسات من العنبر والمسك، غامض وجذاب.",
        country: "تركيا",
        season: "الشتاء",
        gender: "كلا الجنسين"
    },
    "fruity": {
        features: "عطر فواكه منعش مع لمسات من التوت والتفاح، حلو ومنعش.",
        country: "عمان",
        season: "الصيف",
        gender: "نساء"
    },
    "guidance-46": {
        features: "عطر شرقي خشبي فاخر، يجمع بين روائح اللوز الحلو، الباتشولي، والمسك. يتميز بقوة ثبات عالية تدوم لأكثر من 12 ساعة. مناسب للاستخدام المسائي والمناسبات الخاصة.",
        country: "عمان",
        season: "الشتاء، الخريف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: زهر البرتقال، الياسمين | القاعدة: اللوز، الباتشولي، المسك"
    },
    "purpose": {
        features: "عطر خشبي توابل قوي، يجمع بين الفلفل الأسود، جوزة الطيب، والعود. يعطي إحساسًا بالثقة والقوة، مع ثبات ممتاز يصل إلى 10 ساعات.",
        country: "عمان",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الفلفل الأسود، جوزة الطيب | القاعدة: العود، العنبر"
    },
    "matsukita": {
        features: "عطر نادر وفاخر من مجموعة Private Collection، يجمع بين روائح خشب السرو، المسك الأبيض، والفانيليا. يتميز بأناقته وثباته الطويل الذي يصل إلى 15 ساعة.",
        country: "المملكة المتحدة",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين",
        concentration: "Extrait de Parfum",
        notes: "القلب: خشب السرو، البرغموت | القاعدة: المسك الأبيض، الفانيليا"
    },
    "blonde-amber": {
        features: "عطر عنبري زهري فاخر، يمتزج فيه العنبر مع روائح الورد والفانيليا. أنثوي وجذاب مع ثبات يصل إلى 12 ساعة. من أفضل عطور السيدات الفاخرة.",
        country: "المملكة المتحدة",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Extrait de Parfum",
        notes: "القلب: الورد، الياسمين | القاعدة: العنبر، الفانيليا، المسك"
    },
    "afternoon-swim": {
        features: "عطر منعش للغاية، يجمع بين الحمضيات والنوتات المائية. مثالي للصيف مع ثبات متوسط (4-6 ساعات). يعطي إحساسًا بالانتعاش والحيوية.",
        country: "فرنسا",
        season: "الصيف",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: "القلب: البرتقال، الليمون | القاعدة: الزنجبيل، العنبر"
    },
    "imagination": {
        features: "عطر حمضي خشبي مميز، يجمع بين الشاي الأسود، البرغموت، والمسك. أنيق وعصري مع ثبات جيد (6-8 ساعات). مناسب للاستخدام اليومي.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الشاي الأسود، البرغموت | القاعدة: المسك، العنبر"
    },
    "city-of-stars": {
        features: "عطر زهري فواكهي، يجمع بين الكمثرى، الفانيليا، والياسمين. أنثوي ورومانسي مع ثبات يصل إلى 8 ساعات. مناسب للمواعيد والمناسبات.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الكمثرى، الياسمين | القاعدة: الفانيليا، المسك"
    },
    "limmensite": {
        features: "عطر مائي خشبي قوي، يجمع بين الزنجبيل، العنبر، والأعشاب البحرية. عصري وجذاب مع ثبات يصل إلى 10 ساعة. من أفضل عطور لويس فيتون للرجال.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الزنجبيل، العنبر | القاعدة: خشب الأرز، المسك"
    },
    "symphony": {
        features: "عطر شرقي فاخر، يجمع بين الكرز، الورد، والعود. قوي وثابت (12+ ساعة). مناسب للمناسبات الخاصة والسهرات.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين",
        concentration: "Extrait de Parfum",
        notes: "القلب: الكرز، الورد | القاعدة: العود، العنبر"
    },
    "elixir": {
        features: "عطر حار خشبي، يجمع بين الفانيليا، التبغ، والباتشولي. قوي جدًا مع ثبات يصل إلى 24 ساعة. من أقوى عطور جان بول غوتييه.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: الفانيليا، التبغ | القاعدة: الباتشولي، المسك"
    },
    "le-beau": {
        features: "عطر استوائي منعش، يجمع بين جوز الهند، البرغموت، والباتشولي. مثالي للصيف مع ثبات متوسط (6 ساعات).",
        country: "فرنسا",
        season: "الصيف",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: "القلب: جوز الهند، البرغموت | القاعدة: الباتشولي، العنبر"
    },
    "le-beau-paradise-garden": {
        features: "نسخة محدثة من Le Beau، تضيف روائح الأناناس والياسمين. منعش وحلو مع ثبات جيد (7 ساعات).",
        country: "فرنسا",
        season: "الصيف",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: "القلب: الأناناس، الياسمين | القاعدة: جوز الهند، العنبر"
    },
    "ultra-male": {
        features: "عطر فواكهي حار، يجمع بين الكمثرى، الفانيليا، واللافندر. قوي وجذاب مع ثبات يصل إلى 10 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: "القلب: الكمثرى، اللافندر | القاعدة: الفانيليا، المسك"
    },
    "le-male": {
        features: "عطر كلاسيكي من عام 1995، يجمع بين اللافندر، القرفة، والفانيليا. أيقوني مع ثبات جيد (8 ساعات).",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: "القلب: اللافندر، القرفة | القاعدة: الفانيليا، العنبر"
    },
    "elixir-absolu": {
        features: "نسخة مكثفة من Elixir، تجمع بين العسل، التبغ، والباتشولي. قوي جدًا مع ثبات يصل إلى 36 ساعة.",
        country: "فرنسا",
        season: "الشتاء",
        gender: "رجالي",
        concentration: "Extrait de Parfum",
        notes: "القلب: العسل، التبغ | القاعدة: الباتشولي، المسك"
    },
    "la-belle": {
        features: "عطر شرقي فواكهي، يجمع بين الكمثرى، الفانيليا، والورد. أنثوي وجذاب مع ثبات يصل إلى 12 ساعة.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الكمثرى، الورد | القاعدة: الفانيليا، العنبر"
    },
    "la-belle-paradise-garden": {
        features: "نسخة محدثة من La Belle، تضيف روائح المانجو والياسمين. حلو وجذاب مع ثبات يصل إلى 10 ساعات.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: المانجو، الياسمين | القاعدة: الفانيليا، المسك"
    },
    "anka": {
        features: "عطر خشبي زهري، يجمع بين الورد، الباتشولي، والفانيليا. أنيق وعصري مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الورد، الباتشولي | القاعدة: الفانيليا، المسك"
    },
    "sole-patchouli": {
        features: "عطر باتشولي مميز، يجمع بين الباتشولي، البرغموت، والمسك. قوي وثابت (10 ساعات). مناسب لمحبي الروائح العميقة.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: الباتشولي، البرغموت | القاعدة: المسك، العنبر"
    },
    "toni-iommi": {
        features: "عطر خشبي حار، مستوحى من موسيقى الروك، يجمع بين الجلد، التبغ، والعود. قوي جدًا مع ثبات يصل إلى 14 ساعة.",
        country: "إيطاليا",
        season: "الشتاء",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الجلد، التبغ | القاعدة: العود، المسك"
    },
    "more-than-wings": {
        features: "عطر زهري فواكهي، يجمع بين التوت، الياسمين، والفانيليا. أنثوي ورومانسي مع ثبات يصل إلى 8 ساعات.",
        country: "إيطاليا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: التوت، الياسمين | القاعدة: الفانيليا، المسك"
    },
    "accento-overdose": {
        features: "عطر زهري خشبي قوي، يجمع بين الورد، الباتشولي، والعنبر. فاخر وثابت (12 ساعة). مناسب للسهرات.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: الورد، الباتشولي | القاعدة: العنبر، المسك"
    },
    "40-knots": {
        features: "عطر بحري خشبي، يجمع بين الملح، العنبر، وخشب الأرز. منعش وحيوي مع ثبات جيد (8 ساعات).",
        country: "إيطاليا",
        season: "الصيف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الملح، العنبر | القاعدة: خشب الأرز، المسك"
    },
    "italica-casamorati": {
        features: "عطر حلو حليبي، يجمع بين الحليب، الفانيليا، والسكر البني. دافئ ومريح مع ثبات يصل إلى 10 ساعات.",
        country: "إيطاليا",
        season: "الشتاء",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: الحليب، الفانيليا | القاعدة: السكر البني، المسك"
    },
    "memorize": {
        features: "عطر شرقي خشبي، يجمع بين العود، الورد، والتوابل. فاخر وثابت (14 ساعة). مناسب للمناسبات الخاصة.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: العود، الورد | القاعدة: التوابل، المسك"
    },
    "alexandria": {
        features: "عطر شرقي فاخر، يجمع بين العود، الفانيليا، والورد. قوي وثابت (16 ساعة). من أشهر عطور زيرجوف.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين",
        concentration: "Extrait de Parfum",
        notes: "القلب: العود، الفانيليا | القاعدة: الورد، المسك"
    },
    "renaissance": {
        features: "عطر حمضي زهري، يجمع بين البرغموت، الياسمين، وخشب الصندل. منعش وأنيق مع ثبات جيد (7 ساعات).",
        country: "إيطاليا",
        season: "الربيع، الصيف",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: البرغموت، الياسمين | القاعدة: خشب الصندل، المسك"
    },
    "naxos": {
        features: "عطر تبغ فانيليا، يجمع بين التبغ، العسل، والفانيليا. دافئ وجذاب مع ثبات يصل إلى 12 ساعة.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: التبغ، العسل | القاعدة: الفانيليا، المسك"
    },
    "erba-pura": {
        features: "عطر فواكهي مسكي، يجمع بين الفواكه الاستوائية، الفانيليا، والمسك. حلو وجذاب مع ثبات يصل إلى 10 ساعات.",
        country: "إيطاليا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الفواكه الاستوائية، الفانيليا | القاعدة: المسك، العنبر"
    },
    "torino-21": {
        features: "عطر حمضي عشبي، يجمع بين النعناع، البرغموت، وخشب الأرز. منعش وحيوي مع ثبات جيد (6 ساعات).",
        country: "إيطاليا",
        season: "الصيف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: النعناع، البرغموت | القاعدة: خشب الأرز، المسك"
    },
    "stronger-with-you-tobacco": {
        features: "عطر تبغ فانيليا، يجمع بين التبغ، الفانيليا، والكهرمان. دافئ وجذاب مع ثبات يصل إلى 10 ساعات.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: التبغ، الفانيليا | القاعدة: الكهرمان، المسك"
    },
    "stronger-with-you-intensely": {
        features: "نسخة مكثفة من Stronger With You، تضيف روائح الكستناء والتوابل. قوي وثابت (12 ساعة).",
        country: "إيطاليا",
        season: "الشتاء",
        gender: "رجالي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: الكستناء، التوابل | القاعدة: الفانيليا، المسك"
    },
    "my-way-intense": {
        features: "عطر زهري فواكهي، يجمع بين البرتقال، الياسمين، والفانيليا. أنثوي وجذاب مع ثبات يصل إلى 8 ساعات.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: البرتقال، الياسمين | القاعدة: الفانيليا، المسك"
    },
    "eau-de-parfum": {
        features: "عطر زهري خشبي، يجمع بين الورد، الباتشولي، والمسك. كلاسيكي وأنيق مع ثبات جيد (7 ساعات).",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الورد، الباتشولي | القاعدة: المسك، العنبر"
    },
    "si-red-edp": {
        features: "عطر فواكهي زهري، يجمع بين الكشمش الأسود، الورد، والأمبروكسان. أنثوي وجذاب مع ثبات يصل إلى 8 ساعات.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الكشمش الأسود، الورد | القاعدة: الأمبروكسان، المسك"
    },
    "aqua-di-gio-elixir": {
        features: "عطر مائي خشبي، يجمع بين العنبر، خشب الأرز، والمسك. قوي وثابت (10 ساعات). نسخة مكثفة من أكوا دي جيو الكلاسيكي.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: العنبر، خشب الأرز | القاعدة: المسك، العنبر"
    },
    "haltane": {
        features: "عطر خشبي عنبري، يجمع بين العود، الفانيليا، والورد. فاخر وثابت (14 ساعة). من أحدث إصدارات دي مارلي.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: العود، الفانيليا | القاعدة: الورد، المسك"
    },
    "the-rebel": {
        features: "عطر خشبي توابل، يجمع بين الفلفل الأسود، خشب الصندل، والمسك. قوي وجذاب مع ثبات يصل إلى 12 ساعة.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الفلفل الأسود، خشب الصندل | القاعدة: المسك، العنبر"
    },
    "layton": {
        features: "عطر خشبي فواكهي، يجمع بين التفاح، الفانيليا، والباتشولي. كلاسيكي عصري مع ثبات يصل إلى 10 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: التفاح، الفانيليا | القاعدة: الباتشولي، المسك"
    },
    "delina-exclusive": {
        features: "عطر زهري فاخر، يجمع بين الورد، الزنبق، والفانيليا. أنثوي ورومانسي مع ثبات يصل إلى 12 ساعة.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الورد، الزنبق | القاعدة: الفانيليا، المسك"
    },
    "valaya": {
        features: "عطر مسكي زهري، يجمع بين المسك الأبيض، البرغموت، والفانيليا. ناعم وجذاب مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: المسك الأبيض، البرغموت | القاعدة: الفانيليا، العنبر"
    },
    "percival": {
        features: "عطر فواكهي مائي، يجمع بين التفاح، البرغموت، والمسك. منعش وحيوي مع ثبات جيد (7 ساعات).",
        country: "فرنسا",
        season: "الصيف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: التفاح، البرغموت | القاعدة: المسك، العنبر"
    },
    "pegasus": {
        features: "عطر خشبي حليبي، يجمع بين اللوز، خشب الصندل، والفانيليا. فريد من نوعه مع ثبات يصل إلى 10 ساعات.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: اللوز، خشب الصندل | القاعدة: الفانيليا، المسك"
    },
    "layton-exclusif": {
        features: "نسخة مكثفة من Layton، تضيف روائح العود والتوابل. قوي وثابت (14 ساعة). مناسب للمناسبات الخاصة.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: العود، التوابل | القاعدة: الفانيليا، المسك"
    },
    "stronger-with-you-absolutely": {
        features: "عطر خشبي توابل مكثف، يجمع بين الفلفل الأسود، جوزة الطيب، والفانيليا مع لمسات من العنبر والمسك. يتميز بقوة ثبات عالية تصل إلى 12 ساعة. النسخة المطلقة من Stronger With You تتميز بعمق أكبر وكثافة أعلى في التركيبة.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: الفلفل الأسود، جوزة الطيب | القاعدة: الفانيليا، العنبر، المسك"
    },
    "hibiscus-mahajadja": {
        features: "عطر زهري استوائي فاخر، يجمع بين أزهار الكركديه، الفانيليا، وجوز الهند. يتميز برائحة أنثوية جريئة مع ثبات يصل إلى 10 ساعات. مناسب للسهرات والمناسبات الخاصة.",
        country: "فرنسا",
        season: "الصيف، الربيع",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: زهر الكركديه، الياسمين | القاعدة: الفانيليا، جوز الهند، المسك"
    },
    "oud-maracuja": {
        features: "عطر شرقي فريد من نوعه، يدمج بين العود الفاخر وفاكهة الماراكوجا الاستوائية. يعطي إحساسًا بالغموض والأناقة مع ثبات قوي يصل إلى 12 ساعة.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: الماراكوجا، البرغموت | القاعدة: العود، العنبر، الفانيليا"
    },
    "guilty-elixir": {
        features: "عطر شرقي خشبي مكثف، يجمع بين العود، الفانيليا، والورد. يتميز بعمق وجاذبية مع ثبات يصل إلى 14 ساعة. النسخة المطلقة من Gucci Guilty تتميز بكثافة أعلى ورائحة أكثر ثباتًا.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: العود، الورد | القاعدة: الفانيليا، المسك، العنبر"
    },
    "oud-intense": {
        features: "عطر خشبي شرقي قوي، يبرز فيه العود مع لمسات من الورد والمسك. يتميز برائحة فاخرة وثبات يصل إلى 12 ساعة. مناسب للاستخدام المسائي.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: العود، الورد | القاعدة: المسك، العنبر، خشب الصندل"
    },
    "homme-parfum": {
        features: "عطر خشبي زهري فاخر، يجمع بين خشب الأرز، الأوريس، والمسك. يتميز بأناقته وثباته الذي يصل إلى 10 ساعات. من أفضل عطور ديور للرجال.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: خشب الأرز، الأوريس | القاعدة: المسك، العنبر"
    },
    "fahrenheit-parfum": {
        features: "عطر خشبي توابل قوي، يجمع بين خشب الصندل، الفلفل الأسود، والفانيليا. يتميز برائحته الحارة والجذابة مع ثبات يصل إلى 12 ساعة.",
        country: "فرنسا",
        season: "الشتاء",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: خشب الصندل، الفلفل الأسود | القاعدة: الفانيليا، المسك"
    },
    "homme-intense": {
        features: "عطر زهري خشبي، يجمع بين الأوريس، الياسمين، والمسك. أنيق وعصري مع ثبات يصل إلى 8 ساعات. مناسب للاستخدام اليومي والمسائي.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الأوريس، الياسمين | القاعدة: المسك، العنبر"
    },
    "miss-dior": {
        features: "عطر زهري فواكهي أنثوي، يجمع بين البرتقال، الورد، والفانيليا. يتميز برائحته الرومانسية والجذابة مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: البرتقال، الورد | القاعدة: الفانيليا، المسك"
    },
    "miss-dior-eau": {
        features: "عطر زهري منعش، يجمع بين الياسمين، الورد، والفانيليا. أخف من النسخة الأصلية وأكثر انعاشًا مع ثبات يصل إلى 6 ساعات.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Toilette",
        notes: "القلب: الياسمين، الورد | القاعدة: الفانيليا، المسك"
    },
    "miss-dior-blooming": {
        features: "عطر زهري فواكهي، يجمع بين الفراولة، الورد، والفانيليا. أنثوي وحلو مع ثبات يصل إلى 7 ساعات. مناسب للاستخدام اليومي.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الفراولة، الورد | القاعدة: الفانيليا، المسك"
    },
    "jadore": {
        features: "عطر زهري أنيق، يجمع بين الياسمين، الورد، والفانيليا. أيقونة أنثوية من ديور مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الياسمين، الورد | القاعدة: الفانيليا، المسك"
    },
    "sauvage-forte": {
        features: "نسخة مكثفة من Sauvage، تجمع بين الحمضيات، الفلفل الأسود، والمسك. قوي وجذاب مع ثبات يصل إلى 10 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الحمضيات، الفلفل الأسود | القاعدة: المسك، العنبر"
    },
    "sauvage-elixir": {
        features: "عطر خشبي توابل مكثف، يجمع بين العود، الفلفل الأسود، والفانيليا. قوي جدًا مع ثبات يصل إلى 24 ساعة. النسخة الأقوى من سلسلة Sauvage.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: العود، الفلفل الأسود | القاعدة: الفانيليا، المسك"
    },
    "sauvage-parfum": {
        features: "عطر خشبي شرقي، يجمع بين خشب الأرز، العنبر، والمسك. أنيق وثابت مع ثبات يصل إلى 12 ساعة.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: خشب الأرز، العنبر | القاعدة: المسك، الفانيليا"
    },
    "born-in-roma": {
        features: "عطر زهري خشبي، يجمع بين البرغموت، الياسمين، والفانيليا. أنثوي وجذاب مع ثبات يصل إلى 8 ساعات. مستوحى من أناقة روما.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: البرغموت، الياسمين | القاعدة: الفانيليا، المسك"
    },
    "megamare": {
        features: "عطر مائي قوي جدًا، يجمع بين الأعشاب البحرية، العنبر، والمسك. يتميز بقوة ثبات غير عادية تصل إلى 24 ساعة. مناسب لمحبي الروائح القوية.",
        country: "إيطاليا",
        season: "الصيف",
        gender: "كلا الجنسين",
        concentration: "Extrait de Parfum",
        notes: "القلب: الأعشاب البحرية، العنبر | القاعدة: المسك، خشب الأرز"
    },
    "terroni": {
        features: "عطر ترابي خشبي، يجمع بين التبغ، الباتشولي، والفانيليا. دافئ وغامض مع ثبات يصل إلى 12 ساعة. مستوحى من تربة إيطاليا الجنوبية.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: التبغ، الباتشولي | القاعدة: الفانيليا، المسك"
    },
    "bergamask": {
        features: "عطر حمضي خشبي، يجمع بين البرغموت، خشب الصندل، والمسك. منعش وأنيق مع ثبات يصل إلى 8 ساعات. مستوحى من منطقة كالابريا الإيطالية.",
        country: "إيطاليا",
        season: "الربيع، الصيف",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: البرغموت، خشب الصندل | القاعدة: المسك، العنبر"
    },
    "the-one": {
        features: "عطر شرقي خشبي، يجمع بين التبغ، العنبر، والفانيليا. دافئ وجذاب مع ثبات يصل إلى 8 ساعات. من أشهر عطور دولتشي آند غابانا للرجال.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: التبغ، العنبر | القاعدة: الفانيليا، المسك"
    },
    "devotion-intense": {
        features: "عطر حلو شرقي، يجمع بين الليمون، الفانيليا، والمسك. أنثوي وجذاب مع ثبات يصل إلى 10 ساعات. النسخة المكثفة من Devotion.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "نسائي",
        concentration: "Eau de Parfum Intense",
        notes: "القلب: الليمون، الفانيليا | القاعدة: المسك، العنبر"
    },
    "k-parfum": {
        features: "عطر خشبي توابل، يجمع بين الفلفل الأسود، خشب الصندل، والفانيليا. قوي وثابت مع ثبات يصل إلى 10 ساعات. النسخة المطلقة من K.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: الفلفل الأسود، خشب الصندل | القاعدة: الفانيليا، المسك"
    },
    "k-eau": {
        features: "عطر حمضي خشبي، يجمع بين البرغموت، خشب الأرز، والمسك. منعش وأنيق مع ثبات يصل إلى 6 ساعات. النسخة الأخف من K.",
        country: "إيطاليا",
        season: "الربيع، الصيف",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: "القلب: البرغموت، خشب الأرز | القاعدة: المسك، العنبر"
    },
    "midnight-roses": {
        features: "عطر زهري فواكهي، يجمع بين التوت، الورد، والفانيليا. أنثوي ورومانسي مع ثبات يصل إلى 8 ساعات. مناسب للسهرات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: التوت، الورد | القاعدة: الفانيليا، المسك"
    },
    "her-limited": {
        features: "عطر فواكهي زهري، يجمع بين الفراولة، الفانيليا، والمسك. حلو وجذاب مع ثبات يصل إلى 8 ساعات. نسخة محدودة من Burberry Her.",
        country: "المملكة المتحدة",
        season: "جميع الفصول",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الفراولة، الفانيليا | القاعدة: المسك، العنبر"
    },
    "ombre-leather-edp": {
        features: "عطر جلدي خشبي، يجمع بين جلد الغزال، خشب الصندل، والفانيليا. قوي وثابت مع ثبات يصل إلى 10 ساعات. من أشهر عطور توم فورد للرجال.",
        country: "الولايات المتحدة",
        season: "الشتاء، الخريف",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: "القلب: جلد الغزال، خشب الصندل | القاعدة: الفانيليا، المسك"
    },
    "ombre-leather-parfum": {
        features: "نسخة مكثفة من Ombre Leather، تجمع بين الجلد، العود، والفانيليا. قوي جدًا مع ثبات يصل إلى 14 ساعة. النسخة الأقوى من السلسلة.",
        country: "الولايات المتحدة",
        season: "الشتاء",
        gender: "رجالي",
        concentration: "Parfum",
        notes: "القلب: الجلد، العود | القاعدة: الفانيليا، المسك"
    },
    "black-orchid": {
        features: "عطر شرقي غامض، يجمع بين الترفل الأسود، الفانيليا، والباتشولي. فريد من نوعه مع ثبات يصل إلى 12 ساعة. أيقونة من توم فورد.",
        country: "الولايات المتحدة",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: الترفل الأسود، الفانيليا | القاعدة: الباتشولي، المسك"
    },
    "blanche-bete": {
        features: "عطر نسائي فاخر يجمع بين روائح الفانيليا والمسك الأبيض مع لمسات من جوز الهند، يعطي إحساساً بالأنوثة والجاذبية.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "libre-platinum": {
        features: "عطر زهري خشبي يجمع بين روائح اللافندر والبرتقال مع لمسات من الفانيليا، أنيق وعصري.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "la-belle-paradise-garden": {
        features: "عطر فواكهي زهري يجمع بين الكمثرى والفانيليا مع لمسات من الياسمين، حلو وجذاب.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي"
    },
    "la-belle": {
        features: "عطر شرقي فواكهي يجمع بين الكمثرى والفانيليا والورد، أنثوي ورومانسي.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "eau-de-parfum-giorgio-armani": {
        features: "عطر زهري خشبي يجمع بين الورد والباتشولي والمسك، كلاسيكي وأنيق.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "miss-dior": {
        features: "عطر زهري فواكهي يجمع بين البرتقال والورد والفانيليا، أيقونة أنثوية من ديور.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "miss-dior-eau": {
        features: "نسخة أخف من Miss Dior، تجمع بين الياسمين والورد والفانيليا، منعشة ورومانسية.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي"
    },
    "miss-dior-blooming": {
        features: "عطر زهري فواكهي يجمع بين الفراولة والورد والفانيليا، أنثوي وحلو.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي"
    },
    "my-way-intense": {
        features: "عطر زهري فواكهي يجمع بين البرتقال والياسمين والفانيليا، أنثوي وجذاب.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "versace-crystal-noir": {
        features: "عطر زهري خشبي يجمع بين الجاردينيا وجوز الهند والمسك، غامض وجذاب.",
        country: "إيطاليا",
        season: "الشتاء، الخريف",
        gender: "نسائي"
    },
    "ariana-grande": {
        features: "عطر حلو فواكهي يجمع بين الكمثرى والفانيليا والمسك، حلو وجذاب.",
        country: "الولايات المتحدة",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "so-scandal": {
        features: "عطر زهري شرقي يجمع بين الجاردينيا والفانيليا والمسك، جريء وجذاب.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "نسائي"
    },
    "burberry-her-limited": {
        features: "عطر فواكهي زهري يجمع بين الفراولة والفانيليا والمسك، أنثوي وحلو.",
        country: "المملكة المتحدة",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "valentino-born-in-roma": {
        features: "عطر زهري خشبي يجمع بين البرغموت والياسمين والفانيليا، أنيق وعصري.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "212-sexy": {
        features: "عطر زهري فواكهي يجمع بين البرتقال والفانيليا والمسك، جذاب وأنثوي.",
        country: "إسبانيا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "jadore-eau-de-parfum": {
        features: "عطر زهري أنيق يجمع بين الياسمين والورد والفانيليا، أيقونة أنثوية من لانكوم.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "midnight-roses": {
        features: "عطر زهري فواكهي يجمع بين التوت والورد والفانيليا، أنثوي ورومانسي.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "poudre-narciso": {
        features: "عطر مسكي زهري يجمع بين المسك الأبيض والياسمين والفانيليا، ناعم وجذاب.",
        country: "إسبانيا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "billi-eilish": {
        features: "عطر شرقي حلو يجمع بين الفانيليا والكاكاو والمسك، دافئ وجذاب.",
        country: "الولايات المتحدة",
        season: "الشتاء، الخريف",
        gender: "نسائي"
    },
    "signature-roberto-cavalli": {
        features: "عطر زهري فواكهي يجمع بين البرتقال والياسمين والفانيليا، أنثوي وجذاب.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "delina-exclusive": {
        features: "عطر زهري فاخر يجمع بين الورد والزنبق والفانيليا، أنثوي ورومانسي.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "valaya": {
        features: "عطر مسكي زهري يجمع بين المسك الأبيض والبرغموت والفانيليا، ناعم وجذاب.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي"
    },
    "palatine": {
        features: "عطر زهري خشبي يجمع بين الورد والباتشولي والمسك، فاخر وأنيق.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "erba-pura": {
        features: "عطر فواكهي مسكي يجمع بين الفواكه الاستوائية والفانيليا والمسك، حلو وجذاب.",
        country: "إيطاليا",
        season: "الربيع، الصيف",
        gender: "نسائي"
    },
    "hibiscus-mahajadja": {
        features: "عطر زهري استوائي فاخر يجمع بين أزهار الكركديه والفانيليا وجوز الهند، جريء وجذاب.",
        country: "فرنسا",
        season: "الصيف، الربيع",
        gender: "نسائي"
    },
    "sora": {
        features: "عطر زهري منعش يجمع بين الياسمين والبرغموت والمسك، أنيق وحيوي.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي"
    },
    "ellora": {
        features: "عطر شرقي خشبي يجمع بين العود والورد والفانيليا، غامض وجذاب.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "نسائي"
    },
    "baccarat-rouge-540": {
        features: "عطر خشبي عنبري فاخر يجمع بين العنبر وخشب الأرز والمسك، فريد من نوعه.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "نسائي"
    },
    "symphony": {
        features: "عطر شرقي فاخر يجمع بين الكرز والورد والعود، قوي وثابت.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "نسائي"
    },
    "prada-homme-intense": {
        features: "عطر خشبي زهري للرجال، يجمع بين الأوريس، خشب الصندل، والمسك. أنيق وثابت مع ثبات يصل إلى 10 ساعات.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "رجالي"
    },
    "arena-garden": {
        features: "عطر زهري استوائي، يجمع بين أزهار الكركديه، جوز الهند، والفانيليا. أنثوي وجذاب مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "الصيف",
        gender: "نسائي"
    },
    "spicebomb-extreme": {
        features: "عطر توابل خشبي قوي، يجمع بين الفلفل الأسود، الفانيليا، والتبغ. دافئ ومثير مع ثبات يصل إلى 12 ساعة.",
        country: "فرنسا",
        season: "الشتاء",
        gender: "رجالي"
    },
    "azzaro-most-wanted": {
        features: "عطر خشبي عنبري، يجمع بين العنبر، الفانيليا، والمسك. جذاب وثابت مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي"
    },
    "thomas-kosmal-no4": {
        features: "عطر خشبي شرقي، يجمع بين العود، الورد، والتوابل. فاخر وغامض مع ثبات يصل إلى 10 ساعات.",
        country: "فرنسا",
        season: "الشتاء",
        gender: "كلا الجنسين"
    },
    "1-million-parfum": {
        features: "عطر فواكهي توابل، يجمع بين العنب، الفلفل الوردي، والفانيليا. جذاب وثابت مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي"
    },
    "chopard-black-incense": {
        features: "عطر خشبي عنبري، يجمع بين البخور، العود، والفانيليا. غامض وفاخر مع ثبات يصل إلى 12 ساعة.",
        country: "سويسرا",
        season: "الشتاء",
        gender: "رجالي"
    },
    "club-de-nuit-oud": {
        features: "عطر شرقي خشبي، يجمع بين العود، الورد، والتوابل. قوي وثابت مع ثبات يصل إلى 14 ساعة.",
        country: "الإمارات",
        season: "الشتاء",
        gender: "رجالي"
    },
    "club-de-nuit-limited": {
        features: "عطر شرقي خشبي، يجمع بين العود، الفانيليا، والمسك. نسخة محدودة من كلوب دي نوي تتميز بعمق أكبر.",
        country: "الإمارات",
        season: "الشتاء",
        gender: "رجالي"
    },
    "liquid-brown": {
        features: "عطر خشبي حار، يجمع بين التبغ، الفانيليا، والمسك. دافئ وجذاب مع ثبات يصل إلى 8 ساعات.",
        country: "فرنسا",
        season: "الشتاء",
        gender: "رجالي"
    },
    "angels-share": {
        features: "عطر شرقي خشبي يجمع بين رائحة الكونياك والفانيليا والبلوط، يعطي إحساساً بالدفء والرفاهية.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "كلا الجنسين"
    },
    "tygar": {
        features: "عطر حمضي خشبي يجمع بين الجريب فروت والمسك والعنبر، منعش وقوي مع ثبات ممتاز.",
        country: "إيطاليا",
        season: "جميع الفصول",
        gender: "رجالي"
    },
    "santal-33": {
        features: "عطر خشبي جذاب يجمع بين خشب الصندل والجلد والمسك، أيقوني وعصري.",
        country: "الولايات المتحدة",
        season: "جميع الفصول",
        gender: "كلا الجنسين"
    },
    "sora": {
        features: "عطر زهري منعش يجمع بين الياسمين والبرغموت والمسك، أنيق وحيوي.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي"
    },
    "ellora": {
        features: "عطر شرقي خشبي يجمع بين العود والورد والفانيليا، غامض وجذاب.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "نسائي"
    },
    "baccarat-rouge-540": {
        features: "عطر خشبي عنبري فاخر يجمع بين العنبر وخشب الأرز والمسك، فريد من نوعه.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "كلا الجنسين"
    },
    "promise": {
        features: "عطر شرقي خشبي قوي يجمع بين العود والورد والتوابل، فاخر وثابت.",
        country: "فرنسا",
        season: "الشتاء، الخريف",
        gender: "رجالي"
    },
    "bleu-de-chanel-parfum": {
        features: "عطر خشبي توابل أنيق يجمع بين الحمضيات واللبان والفانيليا، كلاسيكي عصري.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "رجالي"
    },
    "experimentum": {
        features: "عطر تجريبي يجمع بين روائح غير متوقعة من التوابل والفواكه والخشب، فريد وجريء.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "كلا الجنسين"
    },
    "montabaco-cuba": {
        features: "عطر تبغ خشبي يجمع بين أوراق التبغ وخشب الصندل والفانيليا، دافئ وجذاب.",
        country: "المملكة المتحدة",
        season: "الشتاء، الخريف",
        gender: "رجالي"
    },
    "gris-charnel": {
        features: "عطر خشبي زهري يجمع بين التين والورد والمسك، أنيق وعميق.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "كلا الجنسين"
    },
    "tilia": {
        features: "عطر زهري حلو يجمع بين الزهور الصفراء والبيضاء مع لمسات من العسل والعشب، يعطي إحساساً بالنعومة والأنوثة.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: "القلب: الزهور الصفراء، الزهور البيضاء | القاعدة: العسل، العشب"
    },
    "ganymede": {
        features: "عطر معدني فريد يجمع بين الجلود والعود مع لمسات من المسك والروائح الزهرية الفاكهية، يعطي إحساساً بالدفء والنعومة.",
        country: "فرنسا",
        season: "جميع الفصول",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: الجلود، العود | القاعدة: المسك، الروائح الزهرية الفاكهية"
    },
    "aldebaran": {
        features: "عطر منعش حيوي يجمع بين مسك الروم والزهور البيضاء مع لمسات من الروائح العشبية والتابلي المنعش، يعطي إحساساً بالحيوية والانتعاش.",
        country: "فرنسا",
        season: "الربيع، الصيف",
        gender: "كلا الجنسين",
        concentration: "Eau de Parfum",
        notes: "القلب: مسك الروم، الزهور البيضاء | القاعدة: الروائح العشبية، التابلي المنعش"
    }
};

// عناصر نافذة التفاصيل
const detailsOverlay = document.querySelector('.perfume-details-overlay');
const detailsModal = document.querySelector('.perfume-details-modal');
const closeDetailsBtn = document.querySelector('.close-details');

// فتح نافذة التفاصيل
function openPerfumeDetails(perfumeId, perfumeData) {
    const details = perfumeDetails[perfumeId] || {
        features: "لا توجد معلومات متاحة حالياً.",
        country: "غير محدد",
        season: "جميع الفصول",
        gender: "كلا الجنسين"
    };
    
    document.getElementById('detail-perfume-image').src = perfumeData.image;
    document.getElementById('detail-perfume-name-ar').textContent = perfumeData.nameAr;
    document.getElementById('detail-perfume-name-en').textContent = perfumeData.nameEn;
    document.getElementById('detail-perfume-brand').textContent = perfumeData.brandNameAr;
    document.getElementById('detail-features').textContent = details.features;
    document.getElementById('detail-country').textContent = details.country;
    document.getElementById('detail-season').textContent = details.season;
    document.getElementById('detail-gender').textContent = details.gender;
    
    detailsOverlay.style.display = 'flex';
}

// إغلاق نافذة التفاصيل
closeDetailsBtn.addEventListener('click', () => {
    detailsOverlay.style.display = 'none';
});

detailsOverlay.addEventListener('click', (e) => {
    if (e.target === detailsOverlay) {
        detailsOverlay.style.display = 'none';
    }
});

// إنشاء جزيئات ذهبية متحركة
function createGoldParticles() {
    const brandsSection = document.querySelector('.brands-section');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('gold-particle');
        
        // وضع عشوائي للجزيئات
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 10;
        
        particle.style.left = `${left}%`;
        particle.style.bottom = `-10px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        brandsSection.appendChild(particle);
    }
}

// تحديث عرض السلة مع التحسينات الجديدة
function updateCartModal() {
    let cartItems = document.querySelector('.cart-items');
    let cartTotal = document.querySelector('.cart-total span');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فارغة</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    // زر إلغاء جميع الطلبات
    const clearAllBtn = document.createElement('button');
    clearAllBtn.className = 'clear-all-btn';
    clearAllBtn.innerHTML = '🗑️ إلغاء جميع الطلبات';
    clearAllBtn.addEventListener('click', () => {
        cart = [];
        updateCartCount();
        updateCartModal();
    });
    cartItems.appendChild(clearAllBtn);
    
    // عرض العناصر في السلة
    cart.forEach((item, index) => {
        let cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${getProductImage(item.id)}" alt="${item.name}" loading="lazy">
            </div>
            <div class="item-details">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size} مل × ${item.quantity}</p>
                    <p class="item-price">${item.price * item.quantity} دينار</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item-btn">❌ إلغاء هذا الطلب</button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        
        // أحداث الأزرار
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const quantityDisplay = cartItem.querySelector('.quantity');
        const removeBtn = cartItem.querySelector('.remove-item-btn');
        
        minusBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                quantityDisplay.textContent = item.quantity;
                updateCartModal();
            } else {
                cart.splice(index, 1);
                updateCartCount();
                updateCartModal();
            }
        });
        
        plusBtn.addEventListener('click', () => {
            item.quantity++;
            quantityDisplay.textContent = item.quantity;
            updateCartModal();
        });
        
        removeBtn.addEventListener('click', () => {
            cart.splice(index, 1);
            updateCartCount();
            updateCartModal();
        });
    });
    
    cartTotal.textContent = calculateTotal();
}

// إرسال الطلب عبر واتساب
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // جمع البيانات مع التحقق من وجودها
    const name = checkoutForm.elements[0].value;
    const phone = checkoutForm.elements[1].value;
    const city = checkoutForm.elements[2].value;
    const landmark = checkoutForm.elements[3].value;
    const address = checkoutForm.elements[4].value;

    // تنظيف رقم الهاتف وإزالة أي أحرف غير رقمية
    const cleanPhone = phone.replace(/\D/g, '');
    
    // التحقق من صحة رقم الهاتف
    if (!cleanPhone || cleanPhone.length < 8) {
        alert('الرجاء إدخال رقم هاتف صحيح (8 أرقام على الأقل)');
        return;
    }

    // إنشاء رسالة واتساب
    let message = `طلب جديد من PERFORMANIA - AKRAM%0A%0A`;
    message += `👤 *الاسم:* ${name}%0A`;
    message += `📱 *رقم الهاتف:* ${phone}%0A`;
    message += `📍 *المحافظة:* ${city}%0A`;
    message += `🗺️ *أقرب نقطة دالة:* ${landmark}%0A`;
    message += `🏠 *العنوان التفصيلي:* ${address}%0A%0A`;
    message += `🛒 *الطلبات:*%0A`;

    if (cart.length === 0) {
        message += `- لا توجد عناصر في السلة%0A`;
    } else {
        cart.forEach(item => {
            message += `- ${item.name} (${item.size} مل) × ${item.quantity}: ${item.price * item.quantity} دينار%0A`;
        });
    }

    message += `%0A💰 *المجموع:* ${calculateTotal()} دينار`;

    // إنشاء رابط واتساب مع الرقم الصحيح (بدون تكرار رمز الدولة)
    const whatsappUrl = `https://wa.me/9647870272308?text=${message}`;
    
    // فتح الرابط في نافذة جديدة
    window.open(whatsappUrl, '_blank');

    // إعادة تعيين السلة والنموذج
    cart = [];
    updateCartCount();
    checkoutOverlay.style.display = 'none';
    checkoutForm.reset();
    
    // إظهار تنبيه بالإرسال الناجح
    alert('تم إرسال طلبك بنجاح! سنتصل بك قريباً لتأكيد التفاصيل.');
});

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء خيارات المحافظات
    const governorates = [
        "بغداد", "نينوى", "البصرة", "أربيل", "الأنبار", "كربلاء", 
        "النجف", "ذي قار", "ديالى", "صلاح الدين", "السليمانية", 
        "واسط", "بابل", "القادسية", "كركوك", "ميسان", "دهوك", "المثنى"
    ];
    
    const citySelect = checkoutForm.querySelector('select');
    governorates.forEach(gov => {
        const option = document.createElement('option');
        option.value = gov;
        option.textContent = gov;
        citySelect.appendChild(option);
    });
    
    // تحميل البيانات
    loadData();
    
    // إنشاء الجزيئات الذهبية
    createGoldParticles();
    setInterval(() => {
        const particles = document.querySelectorAll('.gold-particle');
        particles.forEach(p => p.remove());
        createGoldParticles();
    }, 15000);
});
