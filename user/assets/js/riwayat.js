document.addEventListener('DOMContentLoaded', function() {
    loadReportHistory();
});

/**
 * Load report history from localStorage and display on the page
 */
function loadReportHistory() {
    // Get reports from localStorage
    let reports = getData('reports') || [];
    
    // Sort reports by date (newest first)
    reports.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get history container
    const historyContainer = document.querySelector('.history-list');
    if (!historyContainer) return;
    
    // Clear the container
    historyContainer.innerHTML = '';
    
    // If there are no reports, show a message
    if (reports.length === 0) {
        const noReportsMessage = document.createElement('div');
        noReportsMessage.className = 'no-reports';
        noReportsMessage.style.textAlign = 'center';
        noReportsMessage.style.padding = '30px';
        noReportsMessage.style.backgroundColor = 'white';
        noReportsMessage.style.borderRadius = 'var(--border-radius)';
        noReportsMessage.style.boxShadow = 'var(--shadow)';
        
        const messageText = document.createElement('p');
        messageText.textContent = 'Belum ada riwayat laporan.';
        messageText.style.fontSize = '1.1rem';
        messageText.style.color = 'var(--text-light)';
        
        noReportsMessage.appendChild(messageText);
        historyContainer.appendChild(noReportsMessage);
        return;
    }
    
    // Add each report to the history list
    reports.forEach(report => {
        const historyItem = createHistoryItem(report);
        historyContainer.appendChild(historyItem);
    });
}

/**
 * Create a history item element
 * @param {Object} report - Report data
 * @returns {HTMLElement} History item element
 */
function createHistoryItem(report) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.setAttribute('data-id', report.id);
    
    // Image section
    const historyImage = document.createElement('div');
    historyImage.className = 'history-image';
    
    const image = document.createElement('img');
    image.src = report.imageUrl || 'assets/img/report-image.jpg';
    image.alt = 'Report Image';
    
    historyImage.appendChild(image);
    
    // Details section
    const historyDetails = document.createElement('div');
    historyDetails.className = 'history-details';
    
    // Date row
    const dateRow = document.createElement('div');
    dateRow.className = 'detail-row';
    
    const dateLabel = document.createElement('div');
    dateLabel.className = 'detail-label';
    dateLabel.textContent = 'Tanggal';
    
    const dateValue = document.createElement('div');
    dateValue.className = 'detail-value';
    dateValue.textContent = `: ${formatDate(new Date(report.date))}`;
    
    dateRow.appendChild(dateLabel);
    dateRow.appendChild(dateValue);
    
    // Category row
    const categoryRow = document.createElement('div');
    categoryRow.className = 'detail-row';
    
    const categoryLabel = document.createElement('div');
    categoryLabel.className = 'detail-label';
    categoryLabel.textContent = 'Kategori';
    
    const categoryValue = document.createElement('div');
    categoryValue.className = 'detail-value';
    categoryValue.textContent = `: ${report.category}`;
    
    categoryRow.appendChild(categoryLabel);
    categoryRow.appendChild(categoryValue);
    
    // Description row
    const descriptionRow = document.createElement('div');
    descriptionRow.className = 'detail-row';
    
    const descriptionLabel = document.createElement('div');
    descriptionLabel.className = 'detail-label';
    descriptionLabel.textContent = 'Deskripsi';
    
    const descriptionValue = document.createElement('div');
    descriptionValue.className = 'detail-value';
    descriptionValue.textContent = `: ${report.description}`;
    
    descriptionRow.appendChild(descriptionLabel);
    descriptionRow.appendChild(descriptionValue);
    
    // Status row
    const statusRow = document.createElement('div');
    statusRow.className = 'detail-row';
    
    const statusLabel = document.createElement('div');
    statusLabel.className = 'detail-label';
    statusLabel.textContent = 'Status';
    
    const statusValue = document.createElement('div');
    statusValue.className = 'detail-value';
    statusValue.textContent = `: ${report.status || 'Diproses'}`;
    statusValue.style.fontWeight = 'bold';
    
    // Set status color
    if (report.status === 'Ditangani') {
        statusValue.style.color = 'var(--success-color)';
    } else if (report.status === 'Ditolak') {
        statusValue.style.color = 'var(--error-color)';
    } else {
        statusValue.style.color = 'var(--primary-color)';
    }
    
    statusRow.appendChild(statusLabel);
    statusRow.appendChild(statusValue);
    
    // Add all rows to details
    historyDetails.appendChild(dateRow);
    historyDetails.appendChild(categoryRow);
    historyDetails.appendChild(descriptionRow);
    historyDetails.appendChild(statusRow);
    
    // Add image and details to history item
    historyItem.appendChild(historyImage);
    historyItem.appendChild(historyDetails);
    
    return historyItem;
}

/**
 * Update report status
 * @param {string} reportId - Report ID
 * @param {string} status - New status
 */
function updateReportStatus(reportId, status) {
    // Get reports from localStorage
    let reports = getData('reports') || [];
    
    // Find the report
    const reportIndex = reports.findIndex(report => report.id === reportId);
    if (reportIndex === -1) return;
    
    // Update status
    reports[reportIndex].status = status;
    
    // Save reports
    storeData('reports', reports);
    
    // Reload history
    loadReportHistory();
}