document.addEventListener("DOMContentLoaded", function () {
  // CONSTANTS
  const STORAGE_KEYS = {
    CONTACT_INFO: "luminous_contact_info",
    BIO: "luminous_bio",
    PROFILE_IMAGE: "luminous_profile_image",
    FAQS: "luminous_faqs"
  };

  // DEFAULT FAQS
  const DEFAULT_FAQS = [
    {
      question: "How can I download?",
      answer: "Once your payment has been processes your will be prompted to to a download page where there will be a \"Download\" button. An email will also be sent to your email with the download link. If you have created an account you can also see your past purchases on your My Account Page where can also download. If any issues arise email admin@luminouslens.com."
    },
    {
      question: "Do you take clients photographs?",
      answer: "I do take client photographs on a case by case basis given my availability. Please email me at luna@luminouslens.com to inquire about any personal photography sessions."
    },
    {
      question: "I don't like the photo I purchased, can I return it?",
      answer: "Unfortunately given the nature of the digital downloads, I am unable to process refunds on purchases. Please note all sales are final."
    },
    {
      question: "I cannot find the picture in my email, what should I do?",
      answer: "Sometimes the downloaded pictures end up in the junk folder, checking that would. If you still cannot find the picture we can send the picture to your email!"
    }
  ];

  // Load components
  loadComponent("header-container", "components/header.html")
    .then(() => loadComponent("footer-container", "components/footer.html"))
    .then(() => loadComponent("modals-container", "components/modals.html"))
    .then(() => loadComponent("page-container", "components/about-page.html"))
    .then(() => {
      // Initialize content and add event listeners after all components are loaded
      initializeApp();
    });

  // Function to load HTML components
  function loadComponent(containerId, componentPath) {
    return fetch(componentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load component: ${componentPath}`);
        }
        return response.text();
      })
      .then(html => {
        document.getElementById(containerId).innerHTML = html;
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Initialize app after components are loaded
  function initializeApp() {
    addEventListeners();
    initContactInfo();
    initProfileImage();
    initBio();
  }

  // Show page function
  function showPage(pageId) {
    // First, clear the page container to avoid conflicts
    document.getElementById("page-container").innerHTML = "";
    
    // Load the new page
    loadComponent("page-container", `components/${pageId}-page.html`)
      .then(() => {
        // After loading the page, initialize its content
        if (pageId === 'about') {
          initContactInfo();
          initBio();
          initProfileImage();
        } else if (pageId === 'faq') {
          initFAQs();
        }
        
        // Reattach event listeners for the loaded page
        addEventListeners();
      });
  }

  // Modal functionality
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      document.querySelectorAll(".modal").forEach(m => {
        m.classList.remove("active");
      });
      modal.classList.add("active");
    }
  }

  function hideAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
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
    
    let faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) || DEFAULT_FAQS;
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

  // Load contact info from storage
  function initContactInfo() {
    const phoneInput = document.getElementById("phone");
    const photographerEmailInput = document.getElementById("photographer-email");
    const adminEmailInput = document.getElementById("admin-email");
    const studioAddressInput = document.getElementById("studio-address");
    
    if (!phoneInput || !photographerEmailInput || !adminEmailInput || !studioAddressInput) return;
    
    const contactInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_INFO)) || {};
    
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
    
    if (!phoneInput || !photographerEmailInput || !adminEmailInput || !studioAddressInput) return;
    
    const contactInfo = {
      phone: phoneInput.value,
      photographerEmail: photographerEmailInput.value,
      adminEmail: adminEmailInput.value,
      studioAddress: studioAddressInput.value
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
  }

  // Edit FAQ
  function editFAQ(index) {
    // First, load the edit-qa page
    loadComponent("page-container", "components/edit-qa-page.html")
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
        const faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) || DEFAULT_FAQS;
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
    loadComponent("page-container", "components/edit-qa-page.html")
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
    
    const faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) || DEFAULT_FAQS;
    
    if (index >= 0) {
      // Edit existing FAQ
      faqs[index] = { question, answer };
    } else {
      // Add new FAQ
      faqs.push({ question, answer });
    }
    
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    
    showPage("faq");
    setTimeout(() => {
      showModal("save-confirmation");
    }, 500); // Increased timeout to ensure page loads first
  }

  // Remove FAQ
  function removeFAQ(index) {
    const faqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAQS)) || DEFAULT_FAQS;
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
    newSaveButton.addEventListener("click", function() {
      removeFAQ(index);
    });
    
    showModal("remove-confirmation");
  }

  // Process File (for both drag-and-drop and file input)
  function processFile(file) {
    if (file.type.match('image.*')) {
      const reader = new FileReader();
      const uploadedImage = document.getElementById("uploaded-image");
      const uploadInstructions = document.querySelector(".upload-instructions");
      const imageContainer = document.getElementById("image-container");
      
      if (!uploadedImage || !uploadInstructions || !imageContainer) {
        console.error("Image upload elements not found");
        return;
      }
      
      reader.onload = function(e) {
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

  // Add event listeners
  function addEventListeners() {
    // Navigation
    const navAbout = document.getElementById("nav-about");
    const navFaq = document.getElementById("nav-faq");
    const navShop = document.getElementById("nav-shop");
    const navLogo = document.getElementById("logo");
    const navFeature = document.getElementById("nav-feature");
    
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
        showPage("home");
      });
    }
    
    if (navFeature) {
      navFeature.addEventListener("click", function (e) {
        e.preventDefault();
        showPage("home");
      });
    }

    if (navLogo) {
      navLogo.addEventListener("click", function (e) {
        e.preventDefault();
        showPage("home");
      });
    }

    // Modal close buttons
    document.querySelectorAll(".ok-button, .cancel-button").forEach(function (btn) {
      btn.addEventListener("click", hideAllModals);
    });

    // Save changes in About page
    const saveChangesBtn = document.querySelector(".save-changes");
    const phoneInput = document.getElementById("phone");
    const photographerEmailInput = document.getElementById("photographer-email");
    const adminEmailInput = document.getElementById("admin-email");
    const studioAddressInput = document.getElementById("studio-address");
    
    if (saveChangesBtn && phoneInput && photographerEmailInput && adminEmailInput && studioAddressInput) {
      saveChangesBtn.addEventListener("click", function () {
        const phone = phoneInput.value;
        const photographerEmail = photographerEmailInput.value;
        const adminEmail = adminEmailInput.value;
        const studioAddress = studioAddressInput.value;

        if (!phone || !photographerEmail || !adminEmail || !studioAddress) {
          showModal("unsaved-changes");
        } else {
          saveContactInfo();
          saveBio();
          showModal("save-confirmation");
        }
      });
    }

    // Handle unsaved changes modal save button
    const unsavedChangesSaveBtn = document.querySelector("#unsaved-changes .save-button");
    if (unsavedChangesSaveBtn) {
      unsavedChangesSaveBtn.addEventListener("click", function() {
        saveContactInfo();
        saveBio();
        hideAllModals();
        showModal("save-confirmation");
      });
    }

    // Handle cancel button in About page
    const cancelBtn = document.querySelector(".cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function() {
        initContactInfo();
        initBio();
      });
    }

    // Save confirmation OK button
    const okButton = document.querySelector(".ok-button");
    if (okButton) {
      okButton.addEventListener("click", hideAllModals);
    }

    // Image upload handling
    const imageContainer = document.getElementById("image-container");
    const fileInput = document.getElementById("file-input");
    const addPhotoBtn = document.getElementById("add-photo");
    const removePhotoBtn = document.getElementById("remove-photo");
    
    if (imageContainer && fileInput) {
      // Click to select image
      imageContainer.addEventListener("click", function() {
        fileInput.click();
      });
      
      // Keyboard accessibility
      imageContainer.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fileInput.click();
        }
      });
      
      // Drag and drop events
      imageContainer.addEventListener("dragover", function(e) {
        e.preventDefault();
        imageContainer.classList.add("drag-over");
      });
      
      imageContainer.addEventListener("dragleave", function() {
        imageContainer.classList.remove("drag-over");
      });
      
      imageContainer.addEventListener("drop", function(e) {
        e.preventDefault();
        imageContainer.classList.remove("drag-over");
        
        if (e.dataTransfer.files.length) {
          const file = e.dataTransfer.files[0];
          processFile(file);
        }
      });
    }

    // File input change
    if (fileInput) {
      fileInput.addEventListener("change", function() {
        if (fileInput.files && fileInput.files[0]) {
          processFile(fileInput.files[0]);
        }
      });
    }

    // Add photo button
    if (addPhotoBtn && fileInput) {
      addPhotoBtn.addEventListener("click", function() {
        fileInput.click();
      });
    }

    // Remove photo button
    if (removePhotoBtn) {
      removePhotoBtn.addEventListener("click", function() {
        const fileInput = document.getElementById("file-input");
        const uploadedImage = document.getElementById("uploaded-image");
        const uploadInstructions = document.querySelector(".upload-instructions");
        const imageContainer = document.getElementById("image-container");
        
        if (!fileInput || !uploadedImage || !uploadInstructions || !imageContainer) return;
        
        fileInput.value = "";
        uploadedImage.classList.add("hidden");
        uploadInstructions.classList.remove("hidden");
        imageContainer.classList.add("upload-placeholder");
        clearProfileImage();
      });
    }

    // FAQ management
    const addNewBtn = document.querySelector(".add-new");
    const newQaContainer = document.querySelector(".new-qa-container");
    
    if (addNewBtn) {
      addNewBtn.addEventListener("click", addNewFAQ);
    }
    
    if (newQaContainer) {
      newQaContainer.addEventListener("click", addNewFAQ);
    }
    
    // Save FAQ button
    const saveQaBtn = document.querySelector(".save-qa");
    if (saveQaBtn) {
      saveQaBtn.addEventListener("click", saveFAQ);
    }
    
    // Cancel FAQ button
    const cancelQaBtn = document.querySelector(".cancel-qa");
    if (cancelQaBtn) {
      cancelQaBtn.addEventListener("click", function() {
        showPage("faq");
      });
    }
  }
});
