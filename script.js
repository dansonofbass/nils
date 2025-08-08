// Global variables
let selectedColor = '#f7f7f7';
let selectedDesign = 'custom';
let selectedSize = null;
let customDesign = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupTShirtImageUpload();
    
    // Setup color palette functionality
    const paletteBtns = document.querySelectorAll('.palette-color');
    const tshirtSVG = document.getElementById('mainTshirtSVG');
    
    function setTshirtColor(color) {
        const tshirtPath = tshirtSVG.querySelector('#path3072');
        if (tshirtPath) {
            tshirtPath.setAttribute('fill', color);
        }
        // Update global selected color
        selectedColor = color;
        
        // Update visual selection
        paletteBtns.forEach(btn => btn.classList.remove('selected'));
        const btn = Array.from(paletteBtns).find(b => b.dataset.color.toLowerCase() === color.toLowerCase());
        if (btn) btn.classList.add('selected');
        
        // Update order summary
        updateOrderSummary();
    }
    
    paletteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setTshirtColor(this.dataset.color);
        });
    });
    
    // Set initial color
    setTshirtColor(selectedColor);
});

function initializeApp() {
    // Set up event listeners
    setupNavigation();
    setupFileUpload();
    initializeSizeSelection();
    
    // Initialize with default values
    updateOrderSummary();
}

// File upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('designFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = function(e) {
            customDesign = e.target.result;
            updateOrderSummary();
        };
        reader.readAsText(file);
    } else {
        alert('لطفاً یک فایل SVG انتخاب کنید.');
        event.target.value = '';
    }
}

// Size selection functionality
function selectSize(size) {
    selectedSize = size;
    
    // Remove selected class from all size cards
    document.querySelectorAll('.size-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked size card
    document.querySelector(`[data-size="${size}"]`).classList.add('selected');
    
    // Handle new size selection panel
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked size option
    const selectedOption = document.querySelector(`.size-option[data-size="${size}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        
        // Trigger axis animation
        animateAxisLines(selectedOption);
    }
    
    updateOrderSummary();
}

// Animate axis lines when size is selected
function animateAxisLines(selectedOption) {
    const shoulderWidth = selectedOption.dataset.shoulder;
    const height = selectedOption.dataset.height;
    const size = selectedOption.dataset.size;
    
    // Update size info display
    updateSizeInfoDisplay(size, shoulderWidth, height);
    
    // Show visual indicators on t-shirt preview
    showTshirtSizeIndicators(shoulderWidth, height);
}

// Update size info display
function updateSizeInfoDisplay(size, shoulderWidth, height) {
    const sizeInfoText = document.getElementById('sizeInfoText');
    if (sizeInfoText) {
        sizeInfoText.textContent = `سایز ${size} - عرض شانه: ${shoulderWidth}cm - ارتفاع: ${height}cm`;
    }
}

// Show size indicators on t-shirt preview
function showTshirtSizeIndicators(shoulderWidth, height) {
    const tshirtContainer = document.querySelector('.tshirt-svg-large-wrapper');
    
    // Remove existing indicators
    const existingIndicators = tshirtContainer.querySelectorAll('.size-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // Create shoulder width indicator (X-axis) - positioned above t-shirt
    const shoulderIndicator = document.createElement('div');
    shoulderIndicator.className = 'size-indicator shoulder-indicator';
    shoulderIndicator.innerHTML = `
        <div class="axis-line x-axis-line"></div>
        <div class="scale-marks x-scale-marks"></div>
    `;
    
    // Create height indicator (Y-axis) - positioned on left side
    const heightIndicator = document.createElement('div');
    heightIndicator.className = 'size-indicator height-indicator';
    heightIndicator.innerHTML = `
        <div class="axis-line y-axis-line"></div>
        <div class="scale-marks y-scale-marks"></div>
    `;
    
    tshirtContainer.appendChild(shoulderIndicator);
    tshirtContainer.appendChild(heightIndicator);
    
    // Create scale marks
    createScaleMarks(shoulderIndicator.querySelector('.x-scale-marks'), shoulderWidth, 'x');
    createScaleMarks(heightIndicator.querySelector('.y-scale-marks'), height, 'y');
    
    // Animate indicators
    setTimeout(() => {
        shoulderIndicator.classList.add('show');
        heightIndicator.classList.add('show');
    }, 100);
}

// Create scale marks with 10cm intervals
function createScaleMarks(container, maxValue, axis) {
    const max = parseInt(maxValue);
    const interval = 20; // 10cm intervals
    
    for (let i = 0; i <= max; i += interval) {
        const mark = document.createElement('div');
        mark.className = `scale-mark ${axis}-mark`;
        mark.style.left = axis === 'x' ? `${(i / max) * 100}%` : '0';
        mark.style.top = axis === 'y' ? `${(i / max) * 100}%` : '0';
        
        // Add measurement label
        const label = document.createElement('div');
        label.className = 'scale-label';
        label.textContent = `${i}cm`;
        
        mark.appendChild(label);
        container.appendChild(mark);
    }
}

// Animate value changes
function animateValue(element, newValue) {
    element.style.transform = 'scale(1.2)';
    element.style.color = '#ff6b6b';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        element.style.color = '#ffffff';
    }, 150);
}

// Initialize size selection panel
function initializeSizeSelection() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const size = this.dataset.size;
            selectSize(size);
        });
    });
}

// Update order summary
function updateOrderSummary() {
    const colorText = getColorName(selectedColor);
    const designText = getDesignName(selectedDesign);
    const sizeText = selectedSize || 'انتخاب نشده';
    
    document.getElementById('selectedColor').textContent = colorText;
    document.getElementById('selectedDesign').textContent = designText;
    document.getElementById('selectedSize').textContent = sizeText;
}

function getColorName(color) {
    const colorNames = {
        '#fafafa': 'سفید روشن',
        '#3d3d3d': 'خاکستری تیره',
        '#3a61e0': 'آبی',
        '#c71e1e': 'قرمز',
        '#0f0f0f': 'مشکی',
        '#f7f7f7': 'سفید'
    };
    return colorNames[color] || color;
}

function getDesignName(design) {
    const designNames = {
        'circle': 'دایره',
        'star': 'ستاره',
        'heart': 'قلب',
        'custom': 'فایل سفارشی'
    };
    return designNames[design] || design;
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation highlighting with scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 200; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Order submission
function submitOrder(event) {
    event.preventDefault();
    
    // Validate required fields
    if (!selectedSize) {
        alert('لطفاً سایز تیشرت را انتخاب کنید.');
        return;
    }
    
    // Get form data
    const formData = new FormData(event.target);
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        notes: formData.get('notes'),
        tshirt: {
            color: selectedColor,
            design: selectedDesign,
            size: selectedSize,
            customDesign: customDesign
        },
        orderNumber: generateOrderNumber()
    };
    
    // Simulate order submission
    console.log('Order submitted:', orderData);
    
    // Show success modal
    showSuccessModal(orderData.orderNumber);
    
    // Reset form
    event.target.reset();
    
    // Reset selections
    selectedSize = null;
    document.querySelectorAll('.size-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// Generate order number
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TS${timestamp}${random}`;
}

// Show success modal
function showSuccessModal(orderNumber) {
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('successModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add smooth scrolling to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.size-card, .design-panel, .order-details, .order-form, .contact-item').forEach(el => {
    observer.observe(el);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .size-card, .design-panel, .order-details, .order-form, .contact-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    body.loaded .hero-content {
        animation: fadeInUp 1s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .uploaded-image-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #ff6b6b;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
    }
    
    .uploaded-image-handle.resize {
        bottom: -10px;
        right: -10px;
    }
    
    .uploaded-image-handle.rotate {
        top: -10px;
        right: -10px;
    }
`;
document.head.appendChild(style);

// --- Uploaded Image on TShirt ---
function setupTShirtImageUpload() {
    const input = document.getElementById('tshirtImageUpload');
    if (!input) return;
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const layer = document.getElementById('uploadedImageLayer');
        if (!layer) return;
        
        // Clear existing images
        layer.innerHTML = '';
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                let img;
                if (file.type === 'image/svg+xml') {
                    img = document.createElement('div');
                    img.innerHTML = ev.target.result;
                    img = img.firstElementChild;
                } else {
                    img = document.createElement('img');
                    img.src = ev.target.result;
                }
                
                // Set initial styles
                img.style.maxWidth = '120px';
                img.style.maxHeight = '120px';
                img.style.position = 'absolute';
                img.style.left = '50%';
                img.style.top = '50%';
                img.style.transform = 'translate(-50%, -50%)';
                img.style.cursor = 'move';
                img.style.zIndex = '100';
                
                // Make layer interactive
                layer.style.pointerEvents = 'auto';
                
                layer.appendChild(img);
                makeImageDraggableResizableRotatable(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

function makeImageDraggableResizableRotatable(img) {
    let isDragging = false, startX, startY, origX, origY;
    let isResizing = false, startW, startH;
    let isRotating = false, startAngle, centerX, centerY, startRotate;
    
    // Get SVG container for boundaries
    const svg = document.getElementById('mainTshirtSVG');
    const svgRect = svg.getBoundingClientRect();
    
    // Drag functionality
    img.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('uploaded-image-handle')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = img.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;
        document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newLeft = origX + dx;
            let newTop = origY + dy;
            
            // Boundary constraints
            const imgRect = img.getBoundingClientRect();
            const minX = svgRect.left;
            const maxX = svgRect.right - imgRect.width;
            const minY = svgRect.top;
            const maxY = svgRect.bottom - imgRect.height;
            
            newLeft = Math.max(minX, Math.min(maxX, newLeft));
            newTop = Math.max(minY, Math.min(maxY, newTop));
            
            img.style.left = (newLeft - svgRect.left) + 'px';
            img.style.top = (newTop - svgRect.top) + 'px';
            img.style.transform = 'none';
        }
        
        if (isResizing) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newW = Math.max(40, startW + dx);
            let newH = Math.max(40, startH + dy);
            
            // Max size constraints
            const maxW = svgRect.width * 0.8;
            const maxH = svgRect.height * 0.8;
            newW = Math.min(newW, maxW);
            newH = Math.min(newH, maxH);
            
            img.style.width = newW + 'px';
            img.style.height = newH + 'px';
        }
        
        if (isRotating) {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
            const currentTransform = img.style.transform.replace('translate(-50%, -50%)', '');
            img.style.transform = `translate(-50%, -50%) rotate(${startRotate + angle - startAngle}deg)`;
        }
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        isResizing = false;
        isRotating = false;
        document.body.style.userSelect = '';
    });
    
    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'uploaded-image-handle resize';
    img.parentElement.appendChild(resizeHandle);
    
    resizeHandle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startW = img.offsetWidth;
        startH = img.offsetHeight;
        document.body.style.userSelect = 'none';
    });
    
    // Create rotate handle
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'uploaded-image-handle rotate';
    img.parentElement.appendChild(rotateHandle);
    
    rotateHandle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        isRotating = true;
        const rect = img.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        const match = img.style.transform.match(/rotate\(([-\d.]+)deg\)/);
        startRotate = match ? parseFloat(match[1]) : 0;
        document.body.style.userSelect = 'none';
    });
}