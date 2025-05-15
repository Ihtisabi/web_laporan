document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    // Toggle sidebar on hamburger menu click
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        
        // Hide the menu toggle icon when sidebar is active
        if (sidebar.classList.contains('active')) {
            menuToggle.style.visibility = 'hidden';
        } else {
            menuToggle.style.visibility = 'visible';
        }
    });
    
    // Close sidebar when clicking on overlay
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        menuToggle.style.visibility = 'visible';
    });
    
    // Close sidebar when window is resized to desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            menuToggle.style.visibility = 'visible';
        }
        
        // Ensure the sidebar height is always full height
        adjustSidebarHeight();
    });
    
    // Close sidebar when clicking on menu items (for mobile)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                menuToggle.style.visibility = 'visible';
            }
        });
    });
    
    // Function to adjust sidebar height
    function adjustSidebarHeight() {
        const mainContainerHeight = document.querySelector('.main-container').offsetHeight;
        const windowHeight = window.innerHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        // Set sidebar height to either the main container height or viewport height minus header
        const sidebarHeight = Math.max(mainContainerHeight, windowHeight - headerHeight);
        sidebar.style.height = sidebarHeight + 'px';
    }
    
    // Initial adjustment
    adjustSidebarHeight();
    
    // Re-adjust on window resize
    window.addEventListener('resize', adjustSidebarHeight);
    
    // Re-adjust when content changes (might affect height)
    const observer = new MutationObserver(adjustSidebarHeight);
    observer.observe(document.querySelector('.main-content'), {
        childList: true,
        subtree: true
    });

    // Function to handle responsive table behavior
    function setupResponsiveTable() {
        const tableRows = document.querySelectorAll('.data-table-container tbody tr:not(.action-row)');
        
        // First, clean up any existing action rows to prevent duplication
        const existingActionRows = document.querySelectorAll('.action-row');
        existingActionRows.forEach(row => row.remove());
        
        // For each data row, create a corresponding action row
        tableRows.forEach(row => {
            // Get the action buttons from the last cell
            const actionCell = row.querySelector('td:last-child');
            if (!actionCell) return; // Skip if no action cell
            
            const actionButtons = actionCell.querySelector('.action-buttons');
            if (!actionButtons) return; // Skip if no buttons
            
            // Create a new row for actions
            const actionRow = document.createElement('tr');
            actionRow.className = 'action-row';
            actionRow.style.display = window.innerWidth <= 992 ? 'table-row' : 'none';
            
            // Create a cell that spans all columns
            const actionCell2 = document.createElement('td');
            actionCell2.colSpan = 5; // span all visible columns
            
            // Create a container for the buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'action-buttons-responsive';
            
            // Clone the buttons
            buttonContainer.innerHTML = actionButtons.innerHTML;
            
            // Add the buttons to the cell
            actionCell2.appendChild(buttonContainer);
            
            // Add the cell to the row
            actionRow.appendChild(actionCell2);
            
            // Insert the action row after the current row
            row.parentNode.insertBefore(actionRow, row.nextSibling);
        });
    }
    
    // Run once on page load
    setupResponsiveTable();
    
    // Also run when window is resized
    window.addEventListener('resize', function() {
        const actionRows = document.querySelectorAll('.action-row');
        
        // Show/hide action rows based on window width
        actionRows.forEach(row => {
            row.style.display = window.innerWidth <= 992 ? 'table-row' : 'none';
        });
        
        // Show/hide the regular action column
        const actionCells = document.querySelectorAll('th:nth-child(6), td:nth-child(6)');
        actionCells.forEach(cell => {
            cell.style.display = window.innerWidth <= 992 ? 'none' : 'table-cell';
        });
    });
    
    // Pagination functionality
    const tableRows = document.querySelectorAll('.data-table-container tbody tr:not(.action-row)');
    const rowsPerPage = 10; // Maximum 10 items per page
    let currentPage = 1;
    const totalPages = Math.ceil(tableRows.length / rowsPerPage);
    
    // Pagination buttons
    const prevButton = document.querySelector('.pagination-btn:first-child');
    const nextButton = document.querySelector('.pagination-btn:last-child');
    const pageNumbersContainer = document.getElementById('page-numbers');
    
    // Function to display rows for current page
    function displayRows() {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        
        // Hide all rows first
        tableRows.forEach((row, index) => {
            row.style.display = 'none';
            
            // If there's an action row after this row, hide it too
            const nextRow = row.nextElementSibling;
            if (nextRow && nextRow.classList.contains('action-row')) {
                nextRow.style.display = 'none';
            }
        });
        
        // Show only rows for current page
        for (let i = startIndex; i < endIndex && i < tableRows.length; i++) {
            tableRows[i].style.display = 'table-row';
            
            // If there's an action row after this row, show it too if necessary
            const nextRow = tableRows[i].nextElementSibling;
            if (nextRow && nextRow.classList.contains('action-row')) {
                nextRow.style.display = window.innerWidth <= 992 ? 'table-row' : 'none';
            }
        }
        
        // Update page number display
        updatePageNumbers();
        
        // Disable/enable prev/next buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        
        // Visual indication for disabled buttons
        prevButton.style.opacity = currentPage === 1 ? '0.5' : '1';
        nextButton.style.opacity = currentPage === totalPages ? '0.5' : '1';
    }
    
    // Update page numbers display
    function updatePageNumbers() {
        if (pageNumbersContainer) {
            pageNumbersContainer.innerHTML = '';
            
            // Create page number buttons
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'pagination-btn page-number';
                if (i === currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.textContent = i;
                
                pageBtn.addEventListener('click', function() {
                    currentPage = i;
                    displayRows();
                });
                
                pageNumbersContainer.appendChild(pageBtn);
            }
        }
        
        // Update page info text
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) {
            pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
        }
    }
    
    // Event listeners for pagination buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayRows();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                displayRows();
            }
        });
    }
    
    // Initialize pagination
    displayRows();
});

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const detailModal = document.getElementById('detailModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // Get all detail, accept and delete buttons
    const detailButtons = document.querySelectorAll('.btn-detail');
    const acceptButtons = document.querySelectorAll('.btn-accept');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    // Function to open detail modal
    function openDetailModal(rowData) {
        // Populate modal with data
        document.getElementById('nama').value = rowData.nama;
        document.getElementById('tanggal').value = rowData.tanggal;
        document.getElementById('kategori').value = rowData.kategori;
        document.querySelector('.desc-container p').textContent = rowData.deskripsi;
        
        // Show the modal
        detailModal.style.display = 'block';
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close detail modal
    function closeDetailModal() {
        detailModal.style.display = 'none';
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }
    
    // Function to open delete confirmation modal
    function openDeleteModal(rowId) {
        // Store the row ID for deletion (could be used later with AJAX)
        deleteModal.dataset.rowId = rowId;
        
        // Show the modal
        deleteModal.style.display = 'block';
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close delete modal
    function closeDeleteModal() {
        deleteModal.style.display = 'none';
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }
    
    // Handle status update (accept button)
    function handleStatusUpdate(rowElement) {
        // Get the row data
        const rowId = rowElement.querySelector('td:first-child').textContent;
        const statusButton = rowElement.querySelector('.btn-accept');
        
        // Toggle button text and classes
        if (statusButton.textContent === "Menunggu") {
            statusButton.textContent = "Diterima";
            statusButton.classList.remove('btn-waiting');
            statusButton.classList.add('btn-accepted');
        } else {
            statusButton.textContent = "Menunggu";
            statusButton.classList.remove('btn-accepted');
            statusButton.classList.add('btn-waiting');
        }
        
        // Here you would typically make an AJAX call to update the server
        console.log(`Status updated for row ${rowId} to ${statusButton.textContent}`);
        
        // You can add logic to send the status update to the server
        // Example: sendStatusUpdate(rowId, statusButton.textContent === "Diterima");
    }
    
    // Handle row deletion
    function handleDelete(rowId) {
        // Find the row with the matching ID
        const rows = document.querySelectorAll('tbody tr');
        let rowToDelete = null;
        
        rows.forEach(row => {
            const id = row.querySelector('td:first-child').textContent;
            if (id === rowId) {
                rowToDelete = row;
            }
        });
        
        if (rowToDelete) {
            // Check if there's an action row that follows
            const nextRow = rowToDelete.nextElementSibling;
            if (nextRow && nextRow.classList.contains('action-row')) {
                nextRow.remove();
            }
            
            // Remove the row
            rowToDelete.remove();
            
            // Here you would typically make an AJAX call to delete from the server
            console.log(`Row ${rowId} deleted`);
            
            // Update pagination if needed
            if (typeof displayRows === 'function') {
                displayRows();
            }
        }
        
        // Close the modal
        closeDeleteModal();
    }
    
    // Add event listeners to all detail buttons
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the parent row
            const row = this.closest('tr');
            
            // Extract data from the row
            const rowData = {
                nama: row.querySelector('td:nth-child(2)').textContent,
                kategori: row.querySelector('td:nth-child(3)').textContent,
                deskripsi: row.querySelector('td:nth-child(4)').textContent,
                tanggal: row.querySelector('td:nth-child(5)').textContent
            };
            
            // Open the modal with this data
            openDetailModal(rowData);
        });
    });
    
    // Add event listeners to all accept buttons
    acceptButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            handleStatusUpdate(row);
        });
    });
    
    // Add event listeners to all delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const rowId = row.querySelector('td:first-child').textContent;
            openDeleteModal(rowId);
        });
    });
    
    // Close modals with close buttons
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDetailModal);
    }
    
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', closeDetailModal);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    // Handle delete confirmation
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const rowId = deleteModal.dataset.rowId;
            handleDelete(rowId);
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === detailModal) {
            closeDetailModal();
        } else if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });
    
    // Handle escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDetailModal();
            closeDeleteModal();
        }
    });
});