document.addEventListener('DOMContentLoaded', function() {
    // Initialize form with today's date
    const dateInput = document.getElementById('reportDate');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    
    // Character counter for description
    const descriptionInput = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    
    if (descriptionInput && charCount) {
        descriptionInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            // Change color when approaching limit
            if (currentLength > 100) {
                charCount.style.color = 'var(--warning-color)';
            } else if (currentLength > 110) {
                charCount.style.color = 'var(--error-color)';
            } else {
                charCount.style.color = '';
            }
        });
    }
    
    // Custom file input styling
    const fileInput = document.getElementById('mediaUpload');
    const fileButton = document.querySelector('.file-upload-btn');
    
    if (fileInput && fileButton) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileButton.textContent = `Selected: ${this.files[0].name}`;
            } else {
                fileButton.textContent = 'Choose Files';
            }
        });
    }
    
    // Form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Modal handling
    const okButton = document.getElementById('okButton');
    if (okButton) {
        okButton.addEventListener('click', function() {
            toggleModal('successModal', false);
            window.location.href = 'riwayatlaporan.html';
        });
    }
});

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const reporterName = formData.get('reporterName');
    const date = formData.get('reportDate');
    const category = formData.get('category');
    const description = formData.get('description');
    const file = document.getElementById('mediaUpload').files[0];
    
    // Validate form data
    if (!date) {
        showError('Tanggal harus diisi', document.getElementById('reportDate'));
        return;
    }
    
    if (!category) {
        showError('Kategori harus dipilih', document.getElementById('category'));
        return;
    }
    
    if (!description) {
        showError('Deskripsi harus diisi', document.getElementById('description'));
        return;
    }
    
    // Create report object
    const report = {
        id: Date.now().toString(),
        reporterName,
        date,
        category,
        description,
        imageUrl: file ? URL.createObjectURL(file) : null,
        status: 'Diproses',
        createdAt: new Date().toISOString()
    };
    
    // Save report to localStorage
    saveReport(report);
    
    // Show success modal
    toggleModal('successModal', true);
}

/**
 * Save report to localStorage
 * @param {Object} report - Report data
 */
function saveReport(report) {
    // Get existing reports
    let reports = getData('reports') || [];
    
    // Add new report
    reports.push(report);
    
    // Save reports
    storeData('reports', reports);
}