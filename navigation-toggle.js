// Navigation toggle system - shared across all pages
(function() {
    'use strict';
    
    // Cookie utilities
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        // Set cookie with path=/ to work across all pages, and SameSite=Lax for cross-page compatibility
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Check if shooter mode is enabled (default: true)
    function isShooterModeEnabled() {
        const saved = getCookie('shooterMode');
        return saved === null ? true : saved === 'true';
    }
    
    // Toggle shooter mode
    function toggleShooterMode() {
        const current = isShooterModeEnabled();
        const newValue = !current;
        setCookie('shooterMode', newValue.toString(), 365);
        updateToggleButton();
        return newValue;
    }
    
    // Create toggle button
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'navToggleBtn';
        button.innerHTML = isShooterModeEnabled() ? '🎯 Shooter Mode' : '🖱️ Click Mode';
        button.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            z-index: 99999 !important;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.9) !important;
            border: 2px solid #00ff00;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const newMode = toggleShooterMode();
            button.innerHTML = newMode ? '🎯 Shooter Mode' : '🖱️ Click Mode';
            button.style.borderColor = newMode ? '#00ff00' : '#0088ff';
            button.style.color = newMode ? '#00ff00' : '#0088ff';
            button.style.boxShadow = newMode ? '0 0 10px rgba(0, 255, 0, 0.5)' : '0 0 10px rgba(0, 136, 255, 0.5)';
            
            // Reload page to apply changes
            setTimeout(() => {
                window.location.reload();
            }, 100);
        });
        
        return button;
    }
    
    // Update toggle button appearance
    function updateToggleButton() {
        const button = document.getElementById('navToggleBtn');
        if (button) {
            const enabled = isShooterModeEnabled();
            button.innerHTML = enabled ? '🎯 Shooter Mode' : '🖱️ Click Mode';
            button.style.borderColor = enabled ? '#00ff00' : '#0088ff';
            button.style.color = enabled ? '#00ff00' : '#0088ff';
            button.style.boxShadow = enabled ? '0 0 10px rgba(0, 255, 0, 0.5)' : '0 0 10px rgba(0, 136, 255, 0.5)';
        }
    }
    
    // Show toggle button after first click attempt
    function showToggleOnClickAttempt() {
        let shown = false;
        document.addEventListener('click', function(e) {
            if (shown) return;
            
            // Check if clicking on a nav button
            const navButton = e.target.closest('.nav-button');
            if (navButton && isShooterModeEnabled()) {
                shown = true;
                
                // Show toggle button if not already visible
                if (!document.getElementById('navToggleBtn')) {
                    document.body.appendChild(createToggleButton());
                }
            }
        }, { once: false });
    }
    
    // Always show toggle button on pages with nav buttons
    function checkForNavButtons() {
        const navButtons = document.querySelectorAll('.nav-button');
        if (navButtons.length > 0 && !document.getElementById('navToggleBtn')) {
            document.body.appendChild(createToggleButton());
        }
    }
    
    // Always show toggle button immediately on all pages
    function showToggleButton() {
        if (!document.getElementById('navToggleBtn')) {
            // Always show toggle button on all pages
            const button = createToggleButton();
            document.body.appendChild(button);
            // Make sure it's visible
            button.style.display = 'block';
            button.style.visibility = 'visible';
        }
    }
    
    // Initialize on page load
    function initialize() {
        showToggleButton();
        checkForNavButtons();
        showToggleOnClickAttempt();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also try after a short delay to ensure DOM is ready
    setTimeout(initialize, 100);
    setTimeout(initialize, 500);
    
    // Export functions for use in other scripts
    window.NavigationToggle = {
        isShooterModeEnabled: isShooterModeEnabled,
        toggleShooterMode: toggleShooterMode,
        updateToggleButton: updateToggleButton
    };
})();

