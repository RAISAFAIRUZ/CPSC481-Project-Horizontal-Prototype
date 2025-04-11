document.addEventListener("DOMContentLoaded", function () {
    initPaymentPage();
    var checkoutButton = document.getElementById('checkout-button');
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.shop-now')) { showPage('shop'); }
        if (event.target.matches('.view-button')) {
            const category = event.target.dataset.category;
            sessionStorage.setItem("selectedCategory", category);
            showProductListPage(category);
        }

        if (event.target.matches('.view-details')) {
            const productId = event.target.dataset.productId;
            sessionStorage.setItem("view_product_id", productId);
            showPage('product-detail');
        }
    });
});
document.addEventListener("click", function (event) {
    console.log(event.target.id); // This will log the ID of the clicked element
    if (event.target.id === "checkout-button") {
        console.log("Checkout button clicked (event delegation)!"); // Add this line
        showPaymentPage();
    }
    if (event.target.id === "order-confirm") {
        console.log("Checkout button clicked (event delegation)!"); // Add this line
        // showOrderConfirmationPage();
        processPayment();
    }
    if (event.target.id === "add-new" || event.target.id === "new-qa-container") {
        console.log("Checkout but.ton clicked (event delegation)!"); // Add this line
        // showOrderConfirmationPage();
        addNewFAQ()
    }
    if (event.target.id === "save-qa") {
        saveFAQ()
    }
    if (event.target.id === "cancel-qa") {
        showPage("faq");
    }
});

window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'Are you sure you want to leave? Ensure your progress is saved.';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
});

// Ensure showPaymentPage is at the top level (global scope)
function showPaymentPage() {
    console.log("Navigating to payment page");
    console.log("showPaymentPage function called");
    showPage("payment");
}

function showOrderConfirmationPage() {
    const lastOrderItems = JSON.parse(sessionStorage.getItem("last_order_items"));
    if (lastOrderItems && lastOrderItems.length > 0) {
        const firstItem = lastOrderItems[0];  // Example: Use the first item for display
        document.getElementById("confirmation-image").src = firstItem.imageUrl;
        document.getElementById("confirmation-title").textContent = firstItem.name;
        document.getElementById("confirmation-price").textContent = `$${firstItem.price.toFixed(2)}`;
        // Further actions
    } else {
        alert('No items found for confirmation.');
        showPage('home');  // Redirect if no items
    }
}

// CONSTANTS
const STORAGE_KEYS = {
    CONTACT_INFO: "luminous_contact_info",
    BIO: "luminous_bio",
    PROFILE_IMAGE: "luminous_profile_image",
    FAQS: "luminous_faqs",
    CART_ITEMS: "luminous_cart_items",
};

// DEFAULT FAQS
const DEFAULT_FAQS = [
    {
        question: "How can I download?",
        answer:
            'Once your payment has been processes your will be prompted to to a download page where there will be a "Download" button. An email will also be sent to your email with the download link. If you have created an account you can also see your past purchases on your My Account Page where can also download. If any issues arise email admin@luminouslens.com.',
    },
    {
        question: "Do you take clients photographs?",
        answer:
            "I do take client photographs on a case by case basis given my availability. Please email me at luna@luminouslens.com to inquire about any personal photography sessions.",
    },
    {
        question: "I don't like the photo I purchased, can I return it?",
        answer:
            "Unfortunately given the nature of the digital downloads, I am unable to process refunds on purchases. Please note all sales are final.",
    },
    {
        question: "I cannot find the picture in my email, what should I do?",
        answer:
            "Sometimes the downloaded pictures end up in the junk folder, checking that would. If you still cannot find the picture we can send the picture to your email!",
    },
];

const PRODUCTS = [
    {
        id: "1",
        name: "Hawaii Waterfall",
        price: 19.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LgArvZLks4juAOMNxBWGK8XvibkhVUtaEP0w6",
        category: "Ocean",
        description: "This photo shows a beautiful waterfall in Hawaii with trees and a rainbow. It looks peaceful and full of natural beauty. ",
        location: "Hawaii",
        size: "1000 x1000",
        motivation:
            "Pure example of how calm and magical nature can be.",
        tags: ["Hawaii", "Waterfall", "Rainbow", "Sky", "Trees"],
    },
    {
        id: "2",
        name: "Dubai Island",
        price: 3.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LH6FzmLdjNGPfSm1Z4Du3O8czT2dxgBqivK5t",
        category: "Tropical",
        description: "This is a top-down photo of a man-made island in Dubai. You can see clean water and beautiful buildings.",
        location: "Dubai",
        size: "1000 x1000",
        motivation:
            "This picutre was taken to show Dubai's creative city planning.",
        tags: ["Dubai", "Ocean", "Island", "CityView", "Modern", "Travel"],
    },
    {
        id: "3",
        name: "Burj Khalifa",
        price: 29.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L5XPzmUqniWv0ZODU3oygjPBI9fbmYd7TRlM8",
        category: "City Life",
        description: "This photo shows the tallest building in the world with palm trees around. It shines bright and looks powerful.",
        location: "Dubai",
        size: "1000 x1000",
        motivation:
            "This photo was taken to capture the beauty and height of Burj Khalifa.",
        tags: ["Dubai", "BurjKhalifa", "NightLights", "CityLife", "Skyscraper"],
    },
    {
        id: "4",
        name: "Mexico Ruins",
        price: 14.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LRAaaDkqG7UIWClin6VxJfpZbK1YD0qkX2PHO",
        category: "Ocean",
        description: "These are old rocks and ruins by the ocean in Mexico. Just an another peaceful view. ",
        location: "Mexico",
        size: "1000 x1000",
        motivation:
            "This photo was taken to capture the history and nature of Mexico",
        tags: ["Hawaii", "Mountain", "Rainbow"],
    },
    {
        id: "5",
        name: "Night in Banff",
        price: 14.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L2hqpA5S3b5SvR4ueOxJnZqadDKrBwk97zyF6",
        category: "Tropical",
        description: "A calm lake reflects tall mountains under a starry night. It feels cold, peaceful, and magical.",
        location: "Banff",
        size: "1000 x1000",
        motivation:
            "This photo was taken to show the quiet beauty of Banff at night",
        tags: ["Banff", "Mountains", "NightSky", "Stars", "LakeView", "NatureLovers"],
    },
    {
        id: "6",
        name: "Banff Mountain",
        price: 14.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LfVxG2bLIzWDFBPM5LU2vH4VkgtTQ3ocdwrJ7",
        category: "Mountains",
        description: "Clear water and sharp mountains under a blue sky. You can see the reflection of trees and peaks.",
        location: "Banff",
        size: "1000 x1000",
        motivation:
            "This picture was taken to show the fresh and clean nature of Banff.",
        tags: ["Banff", "Mountains", "Reflection", "Nature", "Travel", "Peaceful"],
    },
    {
        id: "7",
        name: "Hawaii Sunset",
        price: 14.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L5XLVXSmniWv0ZODU3oygjPBI9fbmYd7TRlM8",
        category: "Ocean",
        description: "The sun is setting behind palm trees over the ocean. The light turns the water golden.",
        location: "Hawaii",
        size: "1000 x1000",
        motivation:
            "This photo was taken to capture a relaxing sunset in Hawaii. ",
        tags: ["Hawaii", "Sunset", "PalmTrees", "OceanView", "Relaxing", "Tropical"],
    },
    {
        id: "8",
        name: "Calgary",
        price: 14.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L0DHtL7YUtk4RJrOelXfSDTdq1NMpy8Khzc0W",
        category: "City Life",
        description: "A colorful night fair with a big Ferris wheel and tents.",
        location: "Calgary",
        size: "1000 x1000",
        motivation:
            "This photo shows the fun and joy of Calgary's night life.",
        tags: ["CityLife", "Carnival", "FerrisWheel", "Calgary", "Nightfun", "Canada"],
    },
    {
        id: "9",
        name: "Hawaii Waters",
        price: 14.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L69DKHJe3qvscJQPF8DmC1p9UXbhgoTft7l2V",
        category: "Ocean",
        description: "Soft ocean waves touch the beach under a cloudy sky. You can see two small islands in the distance.",
        location: "Hawaii",
        size: "1000 x1000",
        motivation:
            "This photo was taken to show the calm waters of Hawaii.",
        tags: ["Beach", "Hawaii", "Ocean", "IslandView", "Relax", "WaterLovers"],
    },
    {
        id: "10",
        name: "Purple Sunset",
        price: 14.99,
        imageUrl:
            "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LIh7fIIsVG0KYBnNJ8MvCuPtyckWR3DLZrHfl",
        category: "Mountains",
        description: "The sky turns purple and pinks as the sun sets. Palm trees and waves complete the peaceful scene.",
        location: "Diu",
        size: "1000 x1000",
        motivation:
            "This picture was taken to show the colors of a tropical sunset.",
        tags: ["Sunset", "PurpleSky", "Tropical", "PalmTrees", "Ocean", "RelaxingView"],
    }


];

function initApp() {
    document.body.addEventListener('click', function (event) {
        if (event.target.matches('.view-button')) {
            const category = event.target.dataset.category;
            sessionStorage.setItem("selectedCategory", category);
            showProductListPage(category);
        } else if (event.target.matches('.view-details')) {
            const productId = event.target.dataset.productId;
            sessionStorage.setItem("view_product_id", productId);
            showPage('product-detail');
        } else if (event.target.matches('#checkout-button')) {
            showPaymentPage();
        }
        // Other conditional handlers for different clicks can be added here
    });

    loadInitialComponents();  // Load header, footer, etc.
}

function loadInitialComponents() {
    // This function would load components like header and footer
    loadComponent("header-container", "components/header.html")
        .then(() => loadComponent("footer-container", "components/footer.html"))
        .then(() => {
            // More initialization can follow after components are loaded
            initShopPage();  // Ensure this is called after relevant components are loaded
        });
}

// Load components
loadComponent("header-container", "components/header.html")
    .then(() => loadComponent("footer-container", "components/footer.html"))
    .then(() => loadComponent("modals-container", "components/modals.html"))
    .then(() => loadComponent("page-container", "components/home-page.html"))
    .then(() => {
        // Initialize content and add event listeners after all components are loaded
        initializeApp();
    });

// Function to load HTML components
function loadComponent(containerId, componentPath) {
    return fetch(componentPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            return response.text();
        })
        .then((html) => {
            document.getElementById(containerId).innerHTML = html;
            addEventListeners();
        })
        .catch((error) => {
            console.error(error);
        });
}

// Initialize app after components are loaded
function initializeApp() {
    addEventListeners();
    initContactInfo();
    initProfileImage();
    initBio();
    updateCartTotal(); // Update cart count when app initializes
}

// Show page function
function showPage(pageId) {
    // First, clear the page container to avoid conflicts
    document.getElementById("page-container").innerHTML = "";

    // Load the new page
    loadComponent("page-container", `components/${pageId}-page.html`)
        .then(() => {
            // After loading the page, initialize its content
            if (pageId === "about") {
                initContactInfo();
                initBio();
                initProfileImage();
            } else if (pageId === "faq") {
                initFAQs();
            } else if (pageId === "shop") {
                initShopPage();
            } else if (pageId === "product-detail") {
                const productId = sessionStorage.getItem("view_product_id");
                if (productId) {
                    initProductDetailPage(productId);
                }
            } else if (pageId === "product-list") {
                initProductListPage();
            } else if (pageId === "cart") {
                initCartPage();
            } else if (pageId === "payment") {
                initPaymentPage();
            } else if (pageId === "order-confirmation") {
                initOrderConfirmationPage();
            }

            // Reattach event listeners for the loaded page
            addEventListeners();
        })
        .catch((error) => {
            console.error("Error loading page:", error);
        });
}

// Modal functionality
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        document.querySelectorAll(".modal").forEach((m) => {
            m.classList.remove("active");
        });
        modal.classList.add("active");
    }
}

function hideAllModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("active");
    });
}

// Load FAQs from storage or use defaults
function initFAQs() {
    const faqList = document.getElementById("faq-list");
    if (!faqList) {
        console.error("FAQ list element not found");
        return;
    }

    let faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) ||
        DEFAULT_FAQS;
    renderFAQs(faqs);
}

// Render FAQs to the page
function renderFAQs(faqs) {
    const faqList = document.getElementById("faq-list");
    if (!faqList) {
        console.error("FAQ list element not found");
        return;
    }

    faqList.innerHTML = "";

    faqs.forEach((faq, index) => {
        const faqItem = document.createElement("div");
        faqItem.className = "faq-item";
        faqItem.dataset.index = index;

        faqItem.innerHTML = `
    <h3>${faq.question}</h3>
    <p>${faq.answer}</p>
    <div class="faq-buttons">
    <button class="edit-faq">EDIT</button>
    <button class="remove-faq">REMOVE</button>
    </div>
    `;

        faqList.appendChild(faqItem);

        // Add event listeners for edit and remove buttons
        const editBtn = faqItem.querySelector(".edit-faq");
        const removeBtn = faqItem.querySelector(".remove-faq");

        editBtn.addEventListener("click", () => {
            editFAQ(index);
        });

        removeBtn.addEventListener("click", () => {
            confirmRemoveFAQ(index);
        });
    });
}

/* // Load contact info from storage
 function initContactInfo() {
     const phoneInput = document.getElementById("phone");
     const photographerEmailInput = document.getElementById("photographer-email");
     const adminEmailInput = document.getElementById("admin-email");
     const studioAddressInput = document.getElementById("studio-address");
 
     if (!phoneInput || !photographerEmailInput || !adminEmailInput ||
         !studioAddressInput) return;
 
     const contactInfo = JSON.parse(
         localStorage.getItem(STORAGE_KEYS.CONTACT_INFO),
     ) || {};
 
     phoneInput.value = contactInfo.phone || "";
     photographerEmailInput.value = contactInfo.photographerEmail || "";
     adminEmailInput.value = contactInfo.adminEmail || "";
     studioAddressInput.value = contactInfo.studioAddress || "";
 }
 
 // Load bio from storage
 function initBio() {
     const bioTextarea = document.getElementById("photographer-bio");
     if (!bioTextarea) return;
 
     const bio = localStorage.getItem(STORAGE_KEYS.BIO);
     if (bio) {
         bioTextarea.value = bio;
     }
 }
 
 // Load profile image from storage
 function initProfileImage() {
     const uploadedImage = document.getElementById("uploaded-image");
     const imageContainer = document.getElementById("image-container");
     const uploadInstructions = document.querySelector(".upload-instructions");
 
     if (!uploadedImage || !imageContainer || !uploadInstructions) return;
 
     const imageData = localStorage.getItem(STORAGE_KEYS.PROFILE_IMAGE);
     if (imageData) {
         uploadedImage.src = imageData;
         uploadedImage.classList.remove("hidden");
         uploadInstructions.classList.add("hidden");
         imageContainer.classList.remove("upload-placeholder");
     }
 }
 
 // Save contact info to storage
 function saveContactInfo() {
     const phoneInput = document.getElementById("phone");
     const photographerEmailInput = document.getElementById("photographer-email");
     const adminEmailInput = document.getElementById("admin-email");
     const studioAddressInput = document.getElementById("studio-address");
 
     if (!phoneInput || !photographerEmailInput || !adminEmailInput ||
         !studioAddressInput) return;
 
     const contactInfo = {
         phone: phoneInput.value,
         photographerEmail: photographerEmailInput.value,
         adminEmail: adminEmailInput.value,
         studioAddress: studioAddressInput.value,
     };
 
     localStorage.setItem(STORAGE_KEYS.CONTACT_INFO, JSON.stringify(contactInfo));
 }
 
 // Save bio to storage
 function saveBio() {
     const bioTextarea = document.getElementById("photographer-bio");
     if (!bioTextarea) return;
 
     localStorage.setItem(STORAGE_KEYS.BIO, bioTextarea.value);
 }
 
 // Save profile image to storage
 function saveProfileImage(dataUrl) {
     localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE, dataUrl);
 }
 
 // Clear profile image from storage
 function clearProfileImage() {
     localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
 }*/

// Edit FAQ
function editFAQ(index) {
    // First, load the edit-qa page
    loadComponent("page-container", "components/admineditqa.html")
        .then(() => {
            // Then find the form elements
            const questionInput = document.getElementById("question-input");
            const answerInput = document.getElementById("answer-input");
            const qaIndexInput = document.getElementById("qa-index");

            if (!questionInput || !answerInput || !qaIndexInput) {
                console.error("Form elements not found in edit-qa page");
                return;
            }

            // Get the FAQs and populate the form
            const faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) ||
                DEFAULT_FAQS;
            const faq = faqs[index];

            questionInput.value = faq.question;
            answerInput.value = faq.answer;
            qaIndexInput.value = index;

            // Reattach event listeners
            addEventListeners();
        });
}

// Add new FAQ
function addNewFAQ() {
    loadComponent("page-container", "components/admineditqa.html")
        .then(() => {
            const questionInput = document.getElementById("question-input");
            const answerInput = document.getElementById("answer-input");
            const qaIndexInput = document.getElementById("qa-index");

            if (!questionInput || !answerInput || !qaIndexInput) {
                console.error("Form elements not found in edit-qa page");
                return;
            }

            questionInput.value = "";
            answerInput.value = "";
            qaIndexInput.value = "-1";

            // Reattach event listeners
            addEventListeners();
        });
}

// Save FAQ
function saveFAQ() {
    const questionInput = document.getElementById("question-input");
    const answerInput = document.getElementById("answer-input");
    const qaIndexInput = document.getElementById("qa-index");

    if (!questionInput || !answerInput || !qaIndexInput) {
        console.error("Form elements not found");
        return;
    }

    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const index = parseInt(qaIndexInput.value);

    if (!question || !answer) {
        alert("Both question and answer are required!");
        return;
    }

    let faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) ||
        DEFAULT_FAQS;

    if (index >= 0) {
        // Edit existing FAQ
        faqs[index] = {
            question,
            answer,
        };
    } else {
        // Add new FAQ
        faqs.push({
            question,
            answer,
        });
    }

    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));

    showPage("faq");
    setTimeout(() => {
        showModal("save-confirmation");
    }, 500); // Increased timeout to ensure page loads first
}

// Remove FAQ
function removeFAQ(index) {
    const faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) ||
        DEFAULT_FAQS;
    faqs.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    renderFAQs(faqs);
    hideAllModals();
    showModal("save-confirmation");
}

// Confirm remove FAQ
function confirmRemoveFAQ(index) {
    const removeConfirmation = document.getElementById("remove-confirmation");
    if (!removeConfirmation) return;

    const saveButton = removeConfirmation.querySelector(".save-button");

    // Remove any existing event listeners to prevent multiple bindings
    const newSaveButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newSaveButton, saveButton);

    // Set up a new event handler
    newSaveButton.addEventListener("click", function () {
        removeFAQ(index);
    });

    showModal("remove-confirmation");
}
// Save confirmation OK button
const okButton = document.querySelector(".ok-button");
if (okButton) {
    okButton.addEventListener("click", hideAllModals);
}

// Process File (for both drag-and-drop and file input)
function processFile(file) {
    if (file.type.match("image.*")) {
        const reader = new FileReader();
        const uploadedImage = document.getElementById("uploaded-image");
        const uploadInstructions = document.querySelector(".upload-instructions");
        const imageContainer = document.getElementById("image-container");

        if (!uploadedImage || !uploadInstructions || !imageContainer) {
            console.error("Image upload elements not found");
            return;
        }

        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            uploadedImage.classList.remove("hidden");
            uploadInstructions.classList.add("hidden");
            imageContainer.classList.remove("upload-placeholder");

            // Save to local storage
            saveProfileImage(e.target.result);
        };

        reader.readAsDataURL(file);
    } else {
        alert("Please select an image file (PNG, JPG, or JPEG).");
    }
}

//Shop Page Functions
function initShopPage() {
    // Get the existing shop page element
    const shopPage = document.getElementById("shop-page");
    if (!shopPage) {
        console.error("Shop page element not found");
        return;
    }

    // Update the search placeholder text to match your HTML
    const searchInput = shopPage.querySelector("#search-input");
    const searchButton = shopPage.querySelector("#search-button");

    if (searchInput && searchButton) {
        searchButton.addEventListener("click", () => {
            const searchTerm = searchInput.value.toLowerCase();
            sessionStorage.setItem("searchTerm", searchTerm);
            showProductListPage("search", searchTerm);
        });

        // Add event listener for Enter key in search input
        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const searchTerm = searchInput.value.toLowerCase();
                sessionStorage.setItem("searchTerm", searchTerm);
                showProductListPage("search", searchTerm);
            }
        });
    }



    const categories = [
        {
            name: "City life",
            category: "City Life",
            imageUrl: "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L0DHtL7YUtk4RJrOelXfSDTdq1NMpy8Khzc0W",
        },
        {
            name: "Tropical",
            category: "Tropical",
            imageUrl: "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L69DKHJe3qvscJQPF8DmC1p9UXbhgoTft7l2V",
        },
        {
            name: "Mountains",
            category: "Mountains",
            imageUrl: "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LfVxG2bLIzWDFBPM5LU2vH4VkgtTQ3ocdwrJ7",
        },
        {
            name: "Ocean",
            category: "Ocean",
            imageUrl: "https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LIh7fIIsVG0KYBnNJ8MvCuPtyckWR3DLZrHfl",
        },
    ];

    // Find existing category section container
    let categorySection = shopPage.querySelector(".category-section");
    if (!categorySection) {
        categorySection = document.createElement("div");
        categorySection.classList.add("category-section");
        shopPage.appendChild(categorySection);
    } else {
        // Clear existing content if present
        categorySection.innerHTML = '';
    }

    // Add category sections
    categories.forEach((cat, index) => {
        const catElement = document.createElement("div");
        catElement.classList.add("category-item");
        const categorySection = document.createElement("div");
        categorySection.classList.add("category-section");
        if (index % 2 !== 0) {
            categorySection.classList.add("reverse");
        } // Alternate layout

        categorySection.innerHTML = `
    <div class="category-content">
    <h2>${cat.name}</h2>
    <p>Photography from ${cat.name}</p>
    <button class="view-button" data-category="${cat.category}">View</button>
    </div>
    <div class="category-image">
    <img src="${cat.imageUrl}" alt="${cat.name}">
    </div>
         
    `;
        shopPage.appendChild(categorySection);

        // Attach event listener to the 'View' button
        const viewButton = categorySection.querySelector(".view-button");
        viewButton.addEventListener("click", () => {
            sessionStorage.setItem("selectedCategory", cat.category);
            showProductListPage(cat.category);
        });
    });

    // Shop All section
    // Create shop all section with gallery
    const shopAllSection = document.createElement("div");
    shopAllSection.classList.add("shop-all-section");
    shopAllSection.innerHTML = `
    <div class="shop-all-container" style="display: flex; align-items: center; width:100%;">
    <div class="shop-all-content" style="flex:3; padding-right:40px;">
    <h2>Shop All</h2>
    <p>Shop from our full library of stunning photography. Explore our complete collection of high-quality images from destinations around the world.</p>
    <button class="view-button" data-category="all">View</button>
    </div>
   
    <div class="shop-all-gallery" style="flex:2; display: flex;">
    <div class="gallery-row" style="margin-right:10px;">
    <div class="gallery-image"><img src="https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LXFIRZLD1eUgWtTMDAXrbSHY7pKkVBwIoi4RQ" alt="Gallery1"></div>
    <div style="margin-top:10px;" class="gallery-image"><img src="https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7L753RDiCahmHMfJoBkqvygZpwG0OeFblI3UP2" alt="Gallery2"></div>
    </div>
    <div class="gallery-row">
    <div class="gallery-image"><img src="https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7Lif3KXTwB73lLPbKRpe0mSMutaO5XkfDJVsYC" alt="Gallery3"></div>
    <div style="margin-top:10px;" class="gallery-image"><img src="https://w8olmmxvkm.ufs.sh/f/O1k8BV0YGt7LfVxG2bLIzWDFBPM5LU2vH4VkgtTQ3ocdwrJ7" alt="Gallery4"></div>
    </div>
    </div>
    </div>
    `;

    // Add click events to gallery images and view button
    shopAllSection.querySelectorAll('.gallery-image img').forEach(img => {
        img.addEventListener('click', () => showImagePreview(img.src));
    });

    const shopAllButton = shopAllSection.querySelector(".view-button");
    shopAllButton.addEventListener("click", () => {
        sessionStorage.setItem("selectedCategory", "all");
        showProductListPage("all");
    });

    // Add the section to the page
    shopPage.appendChild(shopAllSection);
}

function showProductListPage(category, searchTerm = "") {
    sessionStorage.setItem("currentCategory", category);
    sessionStorage.setItem("currentSearchTerm", searchTerm);
    showPage("product-list");
}
//end

//Product List Page Functions
function renderProductList(products) {
    const productListContainer = document.getElementById("product-list");
    productListContainer.innerHTML = "";

    products.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button class="view-details" data-product-id="${product.id}">View Details</button>
    `;

        const viewDetailsButton = productItem.querySelector(".view-details");
        viewDetailsButton.addEventListener("click", () => {
            sessionStorage.setItem("view_product_id", product.id);
            showPage("product-detail");
        });

        productListContainer.appendChild(productItem);
    });
}

function initProductListPage() {
    const category = sessionStorage.getItem("currentCategory");
    const searchTerm = sessionStorage.getItem("currentSearchTerm");

    let filteredProducts = [];
    if (category === "all") {
        filteredProducts = PRODUCTS;
    } else if (category === "search" && searchTerm) {
        // Search by both product name and tags
        filteredProducts = PRODUCTS.filter((product) => {
            // Check if product name contains search term
            const nameMatch = product.name.toLowerCase().includes(searchTerm);

            // Check if any tag contains search term
            const tagMatch = product.tags && product.tags.some(tag =>
                tag.toLowerCase().includes(searchTerm)
            );

            // Return true if either name or tag matches
            return nameMatch || tagMatch;
        });
    } else {
        filteredProducts = PRODUCTS.filter(
            (product) => product.category.toLowerCase() === category.toLowerCase(),
        );

    }

    renderProductList(filteredProducts);
}
//end

//Product Detail Page Functions
function initProductDetailPage(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);

    if (!product) {
        console.error("Product not found");
        return;
    }

    const productMainImage = document.getElementById("product-main-image");
    const productTitle = document.getElementById("product-title");
    const productLocation = document.getElementById("product-location");
    const productPrice = document.getElementById("product-price");
    const productDescriptionText = document.getElementById(
        "product-description-text",
    );
    const productSize = document.getElementById("product-size");
    const productMotivationText = document.getElementById(
        "product-motivation-text",
    );
    const productTags = document.getElementById("product-tags");

    productMainImage.src = product.imageUrl;
    productMainImage.alt = product.name;
    productTitle.textContent = product.name;
    productLocation.textContent = product.location;
    productPrice.textContent = `$${product.price.toFixed(2)}`;
    productDescriptionText.textContent = product.description;
    productSize.textContent = `Size: ${product.size}`;
    productMotivationText.textContent = product.motivation;

    // Add tags
    productTags.innerHTML = "";
    product.tags.forEach((tag) => {
        const tagElement = document.createElement("a");
        tagElement.textContent = `#${tag}`;
        tagElement.href = "#"; // Or link to a search page
        productTags.appendChild(tagElement);
    });
    const previewButton = document.getElementById("preview-button");
    const addToCartButton = document.getElementById("add-to-cart-button");
    if (previewButton) {
        previewButton.addEventListener("click", () => {
            // Show the preview with the product's image URL
            console.log("Preview button clicked", product.imageUrl);
            showImagePreview(product.imageUrl);
        });
    }

    if (addToCartButton) {
        addToCartButton.addEventListener("click", () => {
            addToCart(product);
            showModal("save-confirmation"); // Or a more appropriate modal
        });
    }

    // Related Products: Show all products except the current one
    const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3,); //max3

    const relatedProductsContainer = document.getElementById("product-grid");
    renderRelatedProducts(relatedProducts, relatedProductsContainer);
}
function showImagePreview(imageUrl) {
    // Create the modal elements if they don't exist
    let modal = document.getElementById("image-preview-modal");
    let overlay = document.getElementById("modal-overlay");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "image-preview-modal";
        modal.className = "modal";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        const closeButton = document.createElement("span");
        closeButton.className = "close-button";
        closeButton.innerHTML = "&times;";
        closeButton.addEventListener("click", hideImagePreview);

        const previewImage = document.createElement("img");
        previewImage.id = "preview-image";

        modalContent.appendChild(closeButton);
        modalContent.appendChild(previewImage);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "modal-overlay";
        overlay.addEventListener("click", hideImagePreview);
        document.body.appendChild(overlay);
    }

    const previewImage = document.getElementById("preview-image");
    previewImage.src = imageUrl;

    modal.classList.add("active");
    overlay.classList.add("active");
}

function hideImagePreview() {
    const modal = document.getElementById("image-preview-modal");
    const overlay = document.getElementById("modal-overlay");

    if (modal) modal.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
}



function renderRelatedProducts(products, container) {
    console.log("renderRelatedProducts called with:", products, container);
    container.innerHTML = ""; // Clear existing content

    if (products.length === 0) {
        container.textContent = "No related products found.";
        return;
    }

    products.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("related-product-item");
        productItem.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button class="view-details" data-product-id="${product.id}">View Details</button>
    `;

        const viewDetailsButton = productItem.querySelector(".view-details");
        viewDetailsButton.addEventListener("click", () => {
            sessionStorage.setItem("view_product_id", product.id);
            showPage("product-detail");
        });

        container.appendChild(productItem);
    });
}

//end

//Cart Page Functions
function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_ITEMS)) ||
        [];

    // Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex((item) =>
        item.id === product.id
    );

    if (existingItemIndex > -1) {
        // If it exists, increase the quantity (assuming you want quantity support)
        cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
    } else {
        // If it doesn't exist, add it to the cart
        cartItems.push({
            ...product,
            quantity: 1, // Initialize quantity to1
        });
    }

    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
    updateCartTotal();
}

function addCartEventListeners() {
    // Add listeners that are specific to elements in the cart page
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function (event) {
            const productId = event.target.dataset.productId;
            removeFromCart(productId);
            initCartPage(); // Refresh the cart page to reflect the removal
        });
    });
}

function removeFromCart(productId) {
    let cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_ITEMS)) ||
        [];
    cartItems = cartItems.filter((item) => item.id !== productId);
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
    initCartPage(); // Re-render the cart page
    updateCartTotal();
    renderCartItems(cartItems);
}

function updateCartTotal() {
    let cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_ITEMS)) || [];
    const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

    localStorage.setItem('subtotal', total);

    // Check if elements exist before updating them
    const cartTotalElement = document.getElementById("cart-total");
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;  // Correct'; /---------------------------------------------------------------/
    }

    const paymentTotalElement = document.getElementById("payment-total");
    if (paymentTotalElement) {
        paymentTotalElement.textContent = `$${total.toFixed(2)}`;  // Correct; /----------------------------------------------------------------------/
    }

    // Update cart count in header
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        // Calculate total quantity of items in cart
        const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
        cartCountElement.textContent = totalQuantity;
    }
}



function renderCartItems(cartItems) {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsContainer.textContent = "Your cart is empty.";
        return;
    }

    cartItems.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class = "cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="size"> Size: ${item.size}</p>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            
                <button class="remove-from-cart" data-product-id="${item.id}">Remove</button>
    `;

        const removeFromCartButton = cartItem.querySelector(".remove-from-cart");
        removeFromCartButton.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItemsContainer.appendChild(cartItem);
    });
}


function initCartPage() {
    let cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_ITEMS)) || [];
    renderCartItems(cartItems);
    updateCartTotal();
    addEventListeners();

}

//end

function initPaymentPage() {
    const subtotal = localStorage.getItem('subtotal') || '0.00';  // Retrieve the stored subtotal
    const subtotalElement = document.getElementById("payment-total");  // Assuming this is the element ID
    if (subtotalElement) {
        subtotalElement.textContent = `$${parseFloat(subtotal).toFixed(2)}`;
    }
    const checkoutButton = document.querySelector(".checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            const paymentForm = document.getElementById("payment-form");
            if (paymentForm.checkValidity() && validateCardDetails()) {
                console.log("Processing payment");
                processPayment();
            } else {
                paymentForm.reportValidity();
            }
        });
    }
}

function validateCardDetails() {
    return validateCardNumber() && validateExpiryDate() && validateCVV();
}

function validateCardNumber() {
    const cardNumberInput = document.getElementById('card-number');
    const cardNumber = cardNumberInput.value;
    if (!/^[1-9]\d{15}$/.test(cardNumber)) {
        alert('Card number must be 16 digits and cannot start with 0.');
        cardNumberInput.focus();
        return false;
    }
    return true;
}

function validateExpiryDate() {
    const expiryInput = document.getElementById('exp-date');
    const expiryDate = expiryInput.value;
    const regex = /^(0[1-9]|1[0-2])\/(20(2[5-9]|[3-9][0-9]))$/;
    if (!regex.test(expiryDate)) {
        alert('Invalid expiry date. Use MM/YYYY format and a valid year.');
        expiryInput.focus();
        return false;
    }
    return true;
}

function validateCVV() {
    const cvvInput = document.getElementById('cvv');
    const cvvValue = cvvInput.value;
    if (!/^\d{3}$/.test(cvvValue)) {
        alert('CVV must be 3 digits.');
        cvvInput.focus();
        return false;
    }
    return true;
}

function processPayment() {
    // Simulated process for storing and moving to the order confirmation
    const cartItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_ITEMS)) || [];
    if (cartItems.length > 0) {
        sessionStorage.setItem("last_order_items", JSON.stringify(cartItems));
        localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
        setTimeout(() => {
            showPage("order-confirmation");

        }, 1500);
    } else {
        alert('Your cart is empty')
    }
}



//end


//Order Confirmation Page Functions
function initOrderConfirmationPage() {
    // Get product info from sessionStorage instead of localStorage
    const cartItems = JSON.parse(sessionStorage.getItem("last_order_items")) || [];

    // Pick any one product
    const product = cartItems && cartItems.length > 0 ? cartItems[0] : null;

    if (product) {
        document.getElementById("confirmation-image").src = product.imageUrl;
        document.getElementById("confirmation-image").alt = product.name;
        document.getElementById("confirmation-title").textContent = product.name;
        document.getElementById("confirmation-price").textContent = `$${product.price.toFixed(2)}`;

        document.getElementById("download-button").addEventListener("click", () => {
            // Redirect to a download URL or trigger a download
            window.location.href = product.imageUrl;
        });

        document.getElementById("signup-button").addEventListener("click", () => {
            // Redirect to a sign up URL or display sign up form
            alert('Sign up now');
        });
    } else {
        // Handle edge case where order is not placed
        alert('No order to confirm.');
        showPage('home');
    }
}

//end

//Add event listeners
function addEventListeners() {
    // Navigation
    const navAbout = document.getElementById("nav-about");
    const navFaq = document.getElementById("nav-faq");
    const navShop = document.getElementById("nav-shop");
    const navFeature = document.getElementById("nav-feature");
    const navCart = document.getElementById("nav-cart");
    const navLogo = document.getElementById("logo");
    const shopNowButton = document.querySelector(".shop-now");
    const checkoutButton = document.getElementById("checkout-button");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Checkout button clicked");
            showPaymentPage;
        });
    }

    if (navAbout) {
        navAbout.addEventListener("click", function (e) {
            e.preventDefault();
            showPage("about");
        });
    }

    if (navFaq) {
        navFaq.addEventListener("click", function (e) {
            e.preventDefault();
            showPage("faq");
        });
    }

    if (navShop) {
        navShop.addEventListener("click", function (e) {
            e.preventDefault();
            showPage("shop");
        });
    }

    if (navFeature) {
        navFeature.addEventListener("click", function (e) {
            e.preventDefault();
            showPage("home"); // You'll need to create a feature-page.html
        });
    }

    if (navCart) {
        navCart.addEventListener("click", function (e) {
            e.preventDefault();
            showPage("cart");
        });
    }

    if (navLogo) {
        navLogo.addEventListener("click", function (e) {
            e.preventDefault();
            showPage("home");
        });
    }

    if (shopNowButton) {
        shopNowButton.addEventListener("click", function (e) {
            e.preventDefault();
            showPage("shop");
        });
    }

    // Modal close buttons
    document.querySelectorAll(".ok-button, .cancel-button").forEach(function (
        btn,
    ) {
        btn.addEventListener("click", hideAllModals);
    });

    // Save changes in About page
    const saveChangesBtn = document.querySelector(".save-changes");
    const phoneInput = document.getElementById("phone");
    const photographerEmailInput = document.getElementById("photographer-email");
    const adminEmailInput = document.getElementById("admin-email");
    const studioAddressInput = document.getElementById("studio-address");

    if (
        saveChangesBtn && phoneInput && photographerEmailInput && adminEmailInput &&
        studioAddressInput
    ) {
        saveChangesBtn.addEventListener("click", function () {
            const phone = phoneInput.value;
            const photographerEmail = photographerEmailInput.value;
            const adminEmail = adminEmailInput.value;
            const studioAddress = studioAddressInput.value;

            if (!phone || !photographerEmail || !adminEmail || !studioAddress) {
                showModal("unsaved-changes");
            } else {
                saveContactInfo(); saveBio(); showModal("save-confirmation");
            }
        });
    }
    // Handle unsaved changes modal save button
    const unsavedChangesSaveBtn = document.querySelector(
        "#unsaved-changes .save-button",
    );
    if (unsavedChangesSaveBtn) {
        unsavedChangesSaveBtn.addEventListener("click", function () {
            saveContactInfo();
            saveBio();
            hideAllModals();
            showModal("save-confirmation");
        });
    }

    // Handle cancel button in About page
    const cancelBtn = document.querySelector(".cancel");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            initContactInfo();
            initBio();
        });
    }

    // Save confirmation OK button
    const okButton = document.querySelector(".ok-button");
    if (okButton) {
        okButton.addEventListener("click", hideAllModals);
    }
}

// Attach listeners for other pages too 
// Remove this entire nested DOMContentLoaded event listener

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.shop-now')) { showPage('shop'); }
        if (event.target.matches('.view-button')) {
            const category = event.target.dataset.category;
            sessionStorage.setItem("selectedCategory", category);
            showProductListPage(category);
        }

        if (event.target.matches('.view-details')) {
            const productId = event.target.dataset.productId;
            sessionStorage.setItem("view_product_id", productId);
            showPage('product-detail');
        }
    });
});

window.addEventListener("popstate", function () {
    history.back(); // This lets the browser go back to the previous page
});