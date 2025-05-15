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
    
});