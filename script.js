// ============================================
// APP STATE & CONFIGURATION
// ============================================
const AppState = {
    selectedDrug: 'heparin',
    infusionMethod: 'syringe',
    solutionVolume: 50,
    ampouleCount: 2,
    desiredDose: '',
    patientWeight: '',
    useWeight: false,
    currentAmpouleIndex: 0,
    theme: 'light',
    currentTab: 'calculator',
    calculationsToday: 0,
    customVolume: false,
    settings: {
        darkMode: false,
        largeFont: false,
        doseAlerts: true,
        compatAlerts: true,
        saveHistory: true
    }
};

// ============================================
// BIDIRECTIONAL TEXT SUPPORT
// ============================================
const TextDirection = {
    /**
     * Wrap Latin text with LTR marks for correct display in RTL context
     * @param {string} text - Text to wrap
     * @returns {string} - Properly wrapped text
     */
    wrapLatin: function(text) {
        if (!text) return '';
        // Check if text contains Latin characters
        const hasLatin = /[A-Za-z0-9]/.test(text);
        if (hasLatin) {
            return `\u202B${text}\u202C`;
        }
        return text;
    },

    /**
     * Wrap Persian text with RTL marks for correct display in LTR context
     * @param {string} text - Text to wrap
     * @returns {string} - Properly wrapped text
     */
    wrapPersian: function(text) {
        if (!text) return '';
        // Check if text contains Persian/Arabic characters
        const hasRTL = /[\u0600-\u06FF]/.test(text);
        if (hasRTL) {
            return `\u202B${text}\u202C`;
        }
        return text;
    },

    /**
     * Fix mixed text display by properly wrapping segments
     * @param {string} text - Mixed text
     * @returns {string} - Correctly formatted text
     */
    fixMixedText: function(text) {
        if (!text) return '';
        
        // Split text by language segments
        const segments = this.splitByLanguage(text);
        
        return segments.map(segment => {
            if (segment.isLatin) {
                return this.wrapLatin(segment.text);
            } else {
                return segment.text;
            }
        }).join('');
    },

    /**
     * Split text into language segments
     * @param {string} text - Text to split
     * @returns {Array} - Array of segments with language info
     */
    splitByLanguage: function(text) {
        const segments = [];
        let currentSegment = '';
        let currentIsLatin = null;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const isLatin = /[A-Za-z0-9.,\/;:!?@#$%^&*()_+\-=\[\]{}'"\\|<>]/.test(char);
            
            // Check if language changed
            if (currentIsLatin !== isLatin && currentSegment !== '') {
                segments.push({
                    text: currentSegment,
                    isLatin: currentIsLatin
                });
                currentSegment = '';
            }
            
            currentSegment += char;
            currentIsLatin = isLatin;
        }
        
        // Add last segment
        if (currentSegment !== '') {
            segments.push({
                text: currentSegment,
                isLatin: currentIsLatin
            });
        }
        
        return segments;
    },

    /**
     * Format drug info with proper text direction
     * @param {string} persian - Persian text
     * @param {string} latin - Latin text
     * @returns {string} - Formatted string
     */
    formatDrugInfo: function(persian, latin) {
        if (!latin) return persian;
        if (!persian) return this.wrapLatin(latin);
        
        // Persian text should come first in RTL context
        // Use non-breaking space (‌) and directional marks
        return `${persian}\u200F \u200E${this.wrapLatin(latin)}\u200F`;
    },

    /**
     * Create a bilingual label
     * @param {string} persianLabel - Persian label
     * @param {string} latinValue - Latin value
     * @returns {string} - Formatted label
     */
    createBilingualLabel: function(persianLabel, latinValue) {
        // For RTL: Persian label + colon + Latin value
        return `${persianLabel}:\u200F \u200E${this.wrapLatin(latinValue)}`;
    },

    /**
     * Apply bidirectional fixes to all elements on page
     */
    applyBidiFixes: function() {
        console.log('Applying bidirectional text fixes...');
        
        // Fix all elements with mixed content
        document.querySelectorAll('.text-mixed, .text-latin, .drug-name-english').forEach(el => {
            el.style.unicodeBidi = 'isolate';
            el.style.direction = 'ltr';
            el.classList.add('latin-text');
        });
        
        // Fix Persian text elements
        document.querySelectorAll('.persian-text, .drug-name-compact, .selected-drug-name-compact').forEach(el => {
            el.style.unicodeBidi = 'isolate';
            el.style.direction = 'rtl';
            el.classList.add('persian-text');
        });
        
        // Fix input fields
        document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
            input.style.textAlign = 'right';
            input.style.unicodeBidi = 'plaintext';
        });
        
        // Apply to drug descriptions
        document.querySelectorAll('.selected-drug-desc-compact').forEach(el => {
            if (el.textContent.includes('-')) {
                const parts = el.textContent.split(' - ');
                if (parts.length === 2) {
                    el.innerHTML = `
                        <span class="persian-inline">${parts[0]}</span>
                        <span class="text-mixed"> - </span>
                        <span class="latin-inline">${parts[1]}</span>
                    `;
                }
            }
        });
        
        console.log('Bidirectional text fixes applied');
    }
};

// ============================================
// UTILITY FUNCTIONS - ENHANCED PERSIAN NUMBER SUPPORT
// ============================================
const PersianNumbers = {
    // Persian to Latin mapping
    persianToLatin: {
        // Persian-Indic digits
        '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
        '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',

        // Arabic-Indic digits (some keyboards output these)
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',

        // Separators
        '٫': '.',     // Arabic decimal separator
        '٬': ',',     // Arabic thousands separator
        '،': ',',     // Arabic comma

        // Minus variants
        '−': '-', '–': '-', '—': '-'
    },
    
    // Latin to Persian mapping
    latinToPersian: {
        '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
        '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹',
        '.': '٫', ',': '٬'
    },

    // Convert Persian numbers to Latin for calculations
    toLatin: function(text) {
        if (!text) return '';
        return text.toString().split('').map(char => 
            this.persianToLatin[char] || char
        ).join('');
    },

    // Convert Latin numbers to Persian for display
    toPersian: function(text) {
        if (!text) return '';
        return text.toString().split('').map(char => 
            this.latinToPersian[char] || char
        ).join('');
    },

    // Parse a number that might be in Persian/Arabic or Latin format
    parseNumber: function(text) {
        if (!text || text.toString().trim() === '') {
            return NaN;
        }

        let s = this.toLatin(text.toString()).trim();

        // Remove whitespace
        s = s.replace(/\s+/g, '');

        // Handle comma/decimal ambiguity:
        // - If there's a dot, treat commas as thousands separators.
        // - If there's no dot but there is a comma, treat comma as decimal ONLY if it doesn't look like thousands grouping.
        if (s.includes('.')) {
            s = s.replace(/,/g, '');
        } else if (s.includes(',')) {
            const thousandsPattern = /^-?\d{1,3}(,\d{3})+$/;
            if (thousandsPattern.test(s)) {
                s = s.replace(/,/g, '');
            } else {
                // Assume first comma is decimal separator
                s = s.replace(',', '.');
                s = s.replace(/,/g, '');
            }
        }

        return parseFloat(s);
    },

    // Format a number for display (ALWAYS LATIN)
    formatNumber: function(number, decimals = 2) {
        if (!Number.isFinite(number)) {
            return '0';
        }

        const d = parseInt(decimals, 10);
        const usedDecimals = Number.isFinite(d) ? d : 2;

        return number.toFixed(usedDecimals);
    },

    /**
     * Format mixed text with proper number direction (numbers stay LATIN)
     * @param {string} text - Mixed text
     * @returns {string} - Formatted text
     */
    formatMixedText: function(text) {
        if (!text) return '';

        // Normalize any Persian/Arabic digits to Latin
        let formatted = this.toLatin(text.toString());

        // Use existing bidi fix for mixed content
        formatted = TextDirection.fixMixedText(formatted);

        // Wrap Latin text segments with LTR marks
        formatted = formatted.replace(/([A-Za-z][A-Za-z0-9\s.,\/;:!?@#$%^&*()_+\-=\[\]{}'"\\|<>]+)/g,
            match => `\u202B${match}\u202C`);

        return formatted;
    },

    /**
     * Parse mixed text for calculations
     * @param {string} text - Mixed text
     * @returns {number} - Parsed number
     */
    parseMixed: function(text) {
        if (!text) return 0;
        
        // First convert Persian numbers to Latin
        let latinText = this.toLatin(text.toString());
        
        // Remove non-numeric characters except decimal point and minus
        latinText = latinText.replace(/[^\d.\-]/g, '');
        
        return parseFloat(latinText) || 0;
    },

    /**
     * Create a bilingual display string
     * @param {string} persian - Persian text
     * @param {string} latin - Latin text
     * @param {boolean} showBoth - Whether to show both languages
     * @returns {string} - Display string
     */
    bilingual: function(persian, latin, showBoth = true) {
        if (!showBoth || !latin) return persian;
        
        // Use RLM (Right-to-Left Mark) and LRM (Left-to-Right Mark) for proper display
        return `${persian}\u200F \u200E(${latin})\u200F`;
    }
};

// ============================================
// SIMPLE INPUT HANDLING - NO AGGRESSIVE CONVERSION
// ============================================
function setupSimpleInputHandling() {
    console.log('Setting up simple input handling...');
    
    // Center align all input text
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="tel"], textarea').forEach(input => {
        input.style.textAlign = 'center';
    });
    
    // Add placeholder centering style
    const style = document.createElement('style');
    style.textContent = `
        ::placeholder {
            text-align: center !important;
        }
        input::placeholder {
            text-align: center !important;
        }
        textarea::placeholder {
            text-align: center !important;
        }
    `;
    document.head.appendChild(style);
    
    // SIMPLE FOCUS HANDLING - Select text on focus for easy replacement
    document.querySelectorAll('input[type="number"], input[type="text"].numeric-input').forEach(input => {
        // Select all text when input gets focus
        input.addEventListener('focus', function() {
            this.select();
        });
        
        // Also handle click for mobile
        input.addEventListener('click', function() {
            this.select();
        });
    });
    
    // For calculator inputs specifically
    const calculatorInputs = [
        DOM.doctorOrder,
        DOM.patientWeight,
        DOM.customVolume
    ];
    
    calculatorInputs.forEach(input => {
        if (!input) return;
        
        // Select text on focus
        input.addEventListener('focus', function() {
            this.select();
        });
        
        input.addEventListener('click', function() {
            this.select();
        });
        
        // Normalize on blur if it's a valid number
        // Normalize to LATIN while typing (accept Persian/Arabic digits too)
        input.addEventListener('input', function() {
            const before = this.value || '';
            const normalized = PersianNumbers.toLatin(before);

            if (normalized !== before) {
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.value = normalized;
                if (start != null && end != null) {
                    this.setSelectionRange(start, end);
                }
            }

            // Store numeric value (if valid)
            const numValue = PersianNumbers.parseNumber(this.value);
            if (!isNaN(numValue)) {
                this.dataset.numericValue = numValue;
            }

            clearResults();
        });

        // Normalize on blur if it's a valid number
        input.addEventListener('blur', function() {
            if (this.value && this.value.trim() !== '') {
                try {
                    const numValue = PersianNumbers.parseNumber(this.value);
                    if (!isNaN(numValue)) {
                        // Store the numeric value for calculations
                        this.dataset.numericValue = numValue;
                        
                        // Keep display ALWAYS Latin
                        const decimalsAttr = this.getAttribute('data-decimals');
                        const decimals = decimalsAttr == null ? 2 : parseInt(decimalsAttr, 10);
                        const latinValue = PersianNumbers.formatNumber(numValue, Number.isFinite(decimals) ? decimals : 2);

                        // Only update if different
                        if (this.value !== latinValue) {
                            this.value = latinValue;
                        }
                    }
                } catch (e) {
                    // Keep original value if conversion fails
                    console.log('Conversion error:', e);
                }
            }
        });
    });
    
    console.log('Simple input handling setup complete');
}

// ============================================
// MOBILE NUMERIC KEYBOARD OPTIMIZATION
// ============================================
function setupMobileNumericKeyboard() {
    console.log('Setting up mobile numeric keyboard...');
    
    // Set inputmode for all number input fields
    document.querySelectorAll('input').forEach(input => {
        const type = input.type;
        const name = input.name || input.id || '';
        
        // Check if this field should show numeric keyboard
        const isNumericField = 
            type === 'number' || 
            name.includes('dose') || 
            name.includes('weight') || 
            name.includes('volume') || 
            name.includes('count') ||
            name.includes('value') ||
            name.includes('amount') ||
            input.classList.contains('numeric-input') ||
            input.getAttribute('data-numeric') === 'true';
        
        if (isNumericField) {
            // For integer-only fields
            if (input.getAttribute('step') === '1' || 
                name.includes('count') || 
                name.includes('age') ||
                name.includes('ampoule')) {
                input.setAttribute('inputmode', 'numeric');
                input.setAttribute('pattern', '[0-9]*');
            } 
            // For decimal fields
            else {
                input.setAttribute('inputmode', 'decimal');
                
                // Set appropriate pattern for decimal numbers
                if (input.getAttribute('step') === '0.1') {
                    input.setAttribute('pattern', '[0-9]*[.,]?[0-9]*');
                } else if (input.getAttribute('step') === '0.01') {
                    input.setAttribute('pattern', '[0-9]*[.,]?[0-9]{0,2}');
                } else {
                    input.setAttribute('pattern', '[0-9]*[.,]?[0-9]*');
                }
            }
            
            // Add CSS class for styling
            input.classList.add('numeric-keyboard');
            
            // Center align text
            input.style.textAlign = 'center';
            
            // SIMPLE VALIDATION - Only prevent obviously invalid characters
            input.addEventListener('input', function() {
                const before = this.value || '';
                const normalized = PersianNumbers.toLatin(before);

                if (normalized !== before) {
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    this.value = normalized;
                    if (start != null && end != null) {
                        this.setSelectionRange(start, end);
                    }
                }

                // Store numeric value for calculations
                const numValue = PersianNumbers.parseNumber(this.value);
                if (!isNaN(numValue)) {
                    this.dataset.numericValue = numValue;
                }
            });
        }
    });
    
    console.log('Mobile numeric keyboard setup complete');
}

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    // Header
    themeToggle: document.getElementById('themeToggle'),
    historyBtn: document.getElementById('historyBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    
    // Calculator Elements
    drugGrid: document.getElementById('drugGrid'),
    drugSearch: document.getElementById('drugSearch'),
    selectedDrugIcon: document.getElementById('selectedDrugIcon'),
    selectedDrugName: document.getElementById('selectedDrugName'),
    selectedDrugDesc: document.getElementById('selectedDrugDesc'),
    
    // Calculator Controls
    methodBtns: document.querySelectorAll('.method-btn-compact'),
    volumeOptions: document.getElementById('volumeOptions'),
    customVolume: document.getElementById('customVolume'),
    customVolumeContainer: document.getElementById('customVolumeContainer'),
    ampouleCount: document.getElementById('ampouleCount'),
    decreaseAmpoule: document.getElementById('decreaseAmpoule'),
    increaseAmpoule: document.getElementById('increaseAmpoule'),
    ampouleInfo: document.getElementById('ampouleInfo'),
    doctorOrder: document.getElementById('doctorOrder'),
    weightContainer: document.getElementById('weightContainer'),
    weightCheckbox: document.getElementById('weightCheckbox'),
    patientWeight: document.getElementById('patientWeight'),
    calculateBtn: document.getElementById('calculateBtn'),
    
    // Results
    resultsSection: document.getElementById('resultsSection'),
    totalDrugAmount: document.getElementById('totalDrugAmount'),
    totalDrugUnit: document.getElementById('totalDrugUnit'),
    concentrationResult: document.getElementById('concentrationResult'),
    concentrationUnit: document.getElementById('concentrationUnit'),
    pumpRateResult: document.getElementById('pumpRateResult'),
    pumpRateUnit: document.getElementById('pumpRateUnit'),
    durationResult: document.getElementById('durationResult'),
    durationUnit: document.getElementById('durationUnit'),
    
    // Guide Sections
    guideSection: document.getElementById('guideSection'),
    stepByStepGuide: document.getElementById('stepByStepGuide'),
    warningsSection: document.getElementById('warningsSection'),
    warningsList: document.getElementById('warningsList'),
    compatibilitySection: document.getElementById('compatibilitySection'),
    compatibleDrugsList: document.getElementById('compatibleDrugsList'),
    incompatibleDrugsList: document.getElementById('incompatibleDrugsList'),
    
    // Modals
    settingsModal: document.getElementById('settingsModal'),
    historyModal: document.getElementById('historyModal'),
    closeSettings: document.getElementById('closeSettings'),
    closeHistory: document.getElementById('closeHistory'),
    
    // Settings
    darkModeToggle: document.getElementById('darkModeToggle'),
    largeFontToggle: document.getElementById('largeFontToggle'),
    doseAlertToggle: document.getElementById('doseAlertToggle'),
    compatAlertToggle: document.getElementById('compatAlertToggle'),
    saveHistoryToggle: document.getElementById('saveHistoryToggle'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    exportDataBtn: document.getElementById('exportDataBtn'),
    checkUpdateBtn: document.getElementById('checkUpdateBtn'),
    drugCount: document.getElementById('drugCount'),
    lastUpdate: document.getElementById('lastUpdate'),
    
    // History
    historyList: document.getElementById('historyList'),
    
    // Tabs
    tabItems: document.querySelectorAll('.tab-item'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    
    // Drug Library Search
    librarySearch: document.getElementById('librarySearch'),

    // Manual Calculation
    openManualBtn: document.getElementById('openManual'),
    manualSection: document.getElementById('manualSection'),
    calculatorControls: document.getElementById('calculatorControls')
};

// ============================================
// MOBILE LAYOUT FUNCTIONS
// ============================================
function setupMobileLayout() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log('Setting up mobile layout...');
        
        // Clear any previous mobile layout issues
        clearMobileLayoutIssues();
        
        // Fix: Ensure only active tab is visible
        fixTabVisibility();
        
        // Position manual button in drug grid
        positionManualButtonInDrugGrid();
        
        // Fix drug sidebar
        fixDrugSidebar();
        
        // Ensure calculator controls are visible
        if (DOM.calculatorControls) {
            DOM.calculatorControls.style.display = 'grid';
        }
        
        // Hide desktop manual button
        if (DOM.openManualBtn) {
            DOM.openManualBtn.style.display = 'none';
        }
        
        // Remove any floating bars
        removeFloatingBars();
        
        // Setup mobile search
        setupMobileSearch();
        
        // Add touch feedback
        setupTouchFeedback();
        
        // Ensure main content is visible
        ensureContentVisibility();
        
        // Fix method button text color
        fixMethodButtonTextColor();
        
        // Apply bidirectional text fixes for mobile
        TextDirection.applyBidiFixes();
        
        // Setup numeric keyboard for mobile
        setupMobileNumericKeyboard();
        
        console.log('Mobile layout setup complete');
    } else {
        // Reset to desktop layout
        resetDesktopLayout();
    }
}

function clearMobileLayoutIssues() {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'relative';
    document.body.style.height = 'auto';
    
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.height = '100vh';
        appContainer.style.overflow = 'auto';
    }
}

function fixTabVisibility() {
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.style.display = 'none';
        pane.style.height = '0';
        pane.style.overflow = 'hidden';
    });
    
    const activePane = document.querySelector('.tab-pane.active');
    if (activePane) {
        activePane.style.display = 'block';
        activePane.style.height = '100%';
        activePane.style.overflow = 'auto';
    }
}

function fixDrugSidebar() {
    const drugSidebar = document.querySelector('.drug-sidebar');
    if (drugSidebar) {
        drugSidebar.style.cssText = `
            flex: 0 0 120px !important;
            height: 120px !important;
            min-height: 120px !important;
            max-height: 120px !important;
            padding: 4px 6px !important;
            margin: 0 !important;
            background: var(--surface) !important;
            border-bottom: 1px solid var(--border) !important;
            border-radius: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: visible !important;
            z-index: 50 !important;
        `;
    }
    
    const drugScroll = document.querySelector('.drug-scroll-container');
    if (drugScroll) {
        drugScroll.style.cssText = `
            flex: 1 !important;
            min-height: 0 !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 2px 0 !important;
            margin: 0 -2px !important;
        `;
    }
}

function removeFloatingBars() {
    const elementsToRemove = [
        '.quick-actions-enhanced',
        '.quick-actions',
        '.action-btn-enhanced',
        '.action-btn',
        '.floating-bar',
        '.bottom-action-bar',
        '.overlay-bar',
        '#floatingBar',
        '#bottomBar'
    ];
    
    elementsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.position = 'absolute';
            element.style.zIndex = '-100';
        });
    });
}

function ensureContentVisibility() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.cssText = `
            flex: 1 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            margin-top: 50px !important;
            margin-bottom: 45px !important;
            height: calc(100vh - 95px) !important;
            padding-bottom: 0 !important;
        `;
    }
    
    const calculatorTab = document.getElementById('calculatorTab');
    if (calculatorTab) {
        calculatorTab.style.cssText = `
            height: 100% !important;
            overflow: hidden !important;
            display: block !important;
            padding: 0 !important;
        `;
    }
    
    const calculatorLayout = document.querySelector('.calculator-layout');
    if (calculatorLayout) {
        calculatorLayout.style.cssText = `
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
            padding: 0 !important;
        `;
    }
    
    const calculatorMain = document.querySelector('.calculator-main');
    if (calculatorMain) {
        calculatorMain.style.cssText = `
            flex: 1 !important;
            padding: 8px !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            background: var(--bg-primary) !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            gap: 6px !important;
            display: flex !important;
            flex-direction: column !important;
            padding-bottom: 15px !important;
        `;
    }
}

function fixMethodButtonTextColor() {
    const methodButtons = document.querySelectorAll('.method-btn-compact');
    methodButtons.forEach(button => {
        if (button.classList.contains('active')) {
            button.style.color = 'white';
            button.style.fontWeight = '700';
            
            const icon = button.querySelector('i');
            const text = button.querySelector('span');
            if (icon) icon.style.color = 'white';
            if (text) text.style.color = 'white';
        }
    });
    
    const volumeButtons = document.querySelectorAll('.volume-preset-btn');
    volumeButtons.forEach(button => {
        if (button.classList.contains('active')) {
            const number = button.querySelector('.number');
            const unitText = button.querySelector('.unit-text');
            const customText = button.querySelector('.custom-text');
            
            if (number) number.style.color = 'white';
            if (unitText) unitText.style.color = 'white';
            if (customText) customText.style.color = 'white';
        }
    });
}

function positionManualButtonInDrugGrid() {
    const drugGrid = DOM.drugGrid;
    
    if (!drugGrid) return;
    
    const existingBtn = document.getElementById('openManualMobile');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    const mobileManualBtn = document.createElement('div');
    mobileManualBtn.id = 'openManualMobile';
    mobileManualBtn.className = 'drug-item-compact manual-drug-item';
    mobileManualBtn.innerHTML = `
        <div class="drug-icon-small" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <i class="fas fa-edit" style="color: white; font-size: 16px;"></i>
        </div>
        <div class="drug-name-compact" style="color: white; font-size: 10px; font-weight: 700;">محاسبه دستی</div>
    `;
    
    drugGrid.appendChild(mobileManualBtn);
    
    mobileManualBtn.addEventListener('click', openManualCalculation);
    
    mobileManualBtn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
        this.style.transition = 'transform 0.1s ease';
    });
    
    mobileManualBtn.addEventListener('touchend', function() {
        this.style.transform = '';
    });
}

function setupMobileSearch() {
    const mobileSearchToggle = document.getElementById('mobileSearchToggle');
    const drugSearchContainer = document.querySelector('.drug-search-container');
    
    if (mobileSearchToggle && drugSearchContainer) {
        mobileSearchToggle.addEventListener('click', () => {
            drugSearchContainer.style.display = drugSearchContainer.style.display === 'none' ? 'block' : 'none';
        });
    }
}

function setupTouchFeedback() {
    document.querySelectorAll('button, .drug-item-compact, .tab-item').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.97)';
            this.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

function resetDesktopLayout() {
    const mobileBtn = document.getElementById('openManualMobile');
    if (mobileBtn) {
        mobileBtn.remove();
    }
    
    if (DOM.openManualBtn) {
        DOM.openManualBtn.style.display = 'flex';
    }
}

// ============================================
// INITIALIZATION - SIMPLIFIED
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    initializeApp();
    setupEventListeners();
    loadDrugGrid();
    selectDrug('heparin');
    initCompatibilityDropdowns();
    loadDrugLibrary();
});

function initializeApp() {
    console.log('Initializing app...');
    
    if (window.innerWidth <= 768) {
        console.log('Mobile detected, applying critical fixes...');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.background = 'var(--bg-primary)';
        
        DOM.tabPanes.forEach(pane => {
            if (pane.id !== 'calculatorTab') {
                pane.style.display = 'none';
                pane.classList.remove('active');
            }
        });
    }
    
    loadSettings();
    loadTheme();
    updateStats();
    updateVolumeOptions();
    
    // Initialize mobile layout
    setupMobileLayout();
    
    // Apply mobile optimizations
    setupMobileOptimizations();
    
    // NEW: SIMPLE INPUT HANDLING - NO AGGRESSIVE CONVERSION
    setupSimpleInputHandling();
    
    // Initialize bidirectional text support
    TextDirection.applyBidiFixes();
    
    // Setup mobile numeric keyboard
    setupMobileNumericKeyboard();
    
    // Initialize all converters
    initializeConverters();
    
    // Initialize all tools
    initializeTools();
    
    // Re-setup on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupMobileLayout();
        }, 150);
    });
    
    if (DOM.drugCount) {
        DOM.drugCount.textContent = Object.keys(drugDatabase).length;
    }
    
    if (DOM.lastUpdate) {
        const now = new Date();
        const persianDate = new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);
        DOM.lastUpdate.textContent = PersianNumbers.toLatin(persianDate);
    }
    
    // Initialize manual calculation
    setupManualCalculation();
    
    // Test all fixes
    setTimeout(testAllFixes, 1000);
}

function setupMobileOptimizations() {
    if (window.innerWidth <= 768) {
        console.log('Applying mobile optimizations...');
        
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                document.body.style.zoom = "100%";
            }
        }, { passive: true });
        
        window.addEventListener('resize', function() {
            if (window.innerHeight < window.outerHeight * 0.7) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        });
        
        function setVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setVH();
        window.addEventListener('resize', setVH);
        
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        const drugScroll = document.querySelector('.drug-scroll-container');
        if (drugScroll) {
            drugScroll.addEventListener('touchmove', function(e) {
                e.stopPropagation();
            }, { passive: true });
        }
    }
}

function testAllFixes() {
    console.log('Testing all fixes...');
    
    const quickActions = document.querySelectorAll('.quick-actions-enhanced, .action-btn-enhanced');
    console.log(`Quick actions found: ${quickActions.length} (should be 0 or hidden)`);
    
    if (window.innerWidth <= 768) {
        const manualBtn = document.getElementById('openManualMobile');
        console.log(`Mobile manual button exists: ${!!manualBtn}`);
        if (manualBtn) {
            console.log(`Manual button size: ${manualBtn.offsetWidth}x${manualBtn.offsetHeight} (should be ~75x75)`);
        }
    }
    
    const activeMethodBtn = document.querySelector('.method-btn-compact.active');
    if (activeMethodBtn) {
        const computedColor = window.getComputedStyle(activeMethodBtn).color;
        console.log(`Active method button text color: ${computedColor} (should be white or rgb(255, 255, 255))`);
        
        const textSpan = activeMethodBtn.querySelector('span');
        if (textSpan) {
            const textColor = window.getComputedStyle(textSpan).color;
            console.log(`Active method button span text color: ${textColor} (should be white)`);
        }
    }
    
    const activeVolumeBtn = document.querySelector('.volume-preset-btn.active');
    if (activeVolumeBtn) {
        const computedColor = window.getComputedStyle(activeVolumeBtn).color;
        console.log(`Active volume button text color: ${computedColor} (should be white or rgb(255, 255, 255))`);
    }
    
    const drugSidebar = document.querySelector('.drug-sidebar');
    if (drugSidebar && window.innerWidth <= 768) {
        console.log(`Drug sidebar height: ${drugSidebar.offsetHeight}px (should be 120px)`);
    }
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        console.log(`Main content visible: ${mainContent.offsetHeight > 0}`);
    }
    
    // Test numeric keyboard setup
    const numericInputs = document.querySelectorAll('input[inputmode="decimal"], input[inputmode="numeric"]');
    console.log(`Numeric keyboard inputs configured: ${numericInputs.length}`);
    
    // Test center alignment
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    const centeredCount = Array.from(inputs).filter(input => 
        window.getComputedStyle(input).textAlign === 'center'
    ).length;
    console.log(`Center aligned inputs: ${centeredCount}/${inputs.length}`);
    
    // Test if inputs accept typing
    const testInput = DOM.doctorOrder || document.querySelector('input[type="number"]');
    if (testInput) {
        console.log(`Test input value: "${testInput.value}"`);
        console.log(`Test input type: ${testInput.type}`);
        // Test if input has event listeners that might reset it
        const listeners = getEventListeners(testInput);
        console.log(`Test input event listeners:`, listeners);
    }
    
    console.log('Test complete');
}

// ============================================
// SETTINGS FUNCTIONS
// ============================================
function loadSettings() {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        AppState.settings = JSON.parse(savedSettings);
    }
    
    if (DOM.darkModeToggle) DOM.darkModeToggle.checked = AppState.settings.darkMode;
    if (DOM.largeFontToggle) DOM.largeFontToggle.checked = AppState.settings.largeFont;
    if (DOM.doseAlertToggle) DOM.doseAlertToggle.checked = AppState.settings.doseAlerts;
    if (DOM.compatAlertToggle) DOM.compatAlertToggle.checked = AppState.settings.compatAlerts;
    if (DOM.saveHistoryToggle) DOM.saveHistoryToggle.checked = AppState.settings.saveHistory;
    
    applySettings();
}

function saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(AppState.settings));
    showToast('ذخیره شد', 'تنظیمات با موفقیت ذخیره شدند', 'success');
}

function applySettings() {
    if (AppState.settings.darkMode) {
        document.body.classList.add('dark-mode');
        AppState.theme = 'dark';
    } else {
        document.body.classList.remove('dark-mode');
        AppState.theme = 'light';
    }
    
    if (AppState.settings.largeFont) {
        document.body.classList.add('large-font');
    } else {
        document.body.classList.remove('large-font');
    }
    
    const icon = DOM.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ============================================
// DRUG MANAGEMENT
// ============================================
function loadDrugGrid() {
    const container = DOM.drugGrid;
    if (!container) {
        console.error('Drug grid container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    Object.entries(drugDatabase).forEach(([id, drug]) => {
        const card = document.createElement('div');
        card.className = 'drug-item-compact';
        card.dataset.drugId = id;
        card.innerHTML = `
            <div class="drug-icon-small">
                <i class="${drug.icon}"></i>
            </div>
            <div class="drug-name-compact">${drug.persianName}</div>
            <div class="drug-name-english latin-text">${TextDirection.wrapLatin(drug.englishName)}</div>
        `;
        
        card.addEventListener('click', () => selectDrug(id));
        container.appendChild(card);
    });
    
    console.log('Drug grid loaded with', Object.keys(drugDatabase).length, 'drugs');
    
    setupMobileLayout();
}

function selectDrug(drugId) {
    if (!drugDatabase[drugId]) {
        console.error('Drug not found:', drugId);
        return;
    }
    
    const drug = drugDatabase[drugId];
    AppState.selectedDrug = drugId;
    AppState.ampouleCount = drug.defaultAmpoules;
    AppState.currentAmpouleIndex = 0;
    
    console.log('Selected drug:', drug.persianName);
    
    DOM.selectedDrugName.textContent = drug.persianName;
    
    // Use bidirectional formatting for description
    DOM.selectedDrugDesc.innerHTML = `
        <span class="persian-inline">${drug.persianName}</span>
        <span class="text-mixed"> - </span>
        <span class="latin-inline">${drug.englishName}</span>
        <span class="text-mixed"> (</span>
        <span class="latin-inline">${drug.category}</span>
        <span class="text-mixed">)</span>
    `;
    
    DOM.selectedDrugIcon.innerHTML = `<i class="${drug.icon}"></i>`;
    DOM.selectedDrugIcon.style.background = `linear-gradient(135deg, ${drug.color}, ${drug.color}99)`;
    
    updateAmpouleTypeSelector(drug);
    updateAmpouleInfo();
    updateVolumeOptions();
    
    if (DOM.weightContainer && DOM.weightCheckbox && DOM.patientWeight) {
        if (drug.weightBased && drug.weightBased.active) {
            DOM.weightContainer.style.display = 'flex';
            
            const defaultUseWeight = drug.weightBased.defaultUseWeight !== undefined ? 
                drug.weightBased.defaultUseWeight : false;
            
            AppState.useWeight = defaultUseWeight;
            DOM.weightCheckbox.checked = defaultUseWeight;
            DOM.patientWeight.disabled = !defaultUseWeight;
            
            // Set default weight value - DON'T CONVERT TO PERSIAN HERE
            DOM.patientWeight.value = drug.weightBased.defaultWeight || '70';
            DOM.patientWeight.placeholder = 'کیلوگرم';
            
            // Set numeric keyboard attributes for weight input
            DOM.patientWeight.setAttribute('inputmode', 'decimal');
            DOM.patientWeight.setAttribute('pattern', '[0-9]*[.,]?[0-9]*');
            DOM.patientWeight.setAttribute('data-numeric', 'true');
            
            // Center align text
            DOM.patientWeight.style.textAlign = 'center';
            
            updateWeightBasedUnit(drug);
        } else {
            DOM.weightContainer.style.display = 'none';
            AppState.useWeight = false;
            DOM.weightCheckbox.checked = false;
            DOM.patientWeight.disabled = true;
            DOM.patientWeight.value = '';
            
            const unitElement = document.getElementById('orderUnit');
            if (unitElement) {
                unitElement.textContent = drug.standardUnit;
            }
        }
    }
    
    // Set numeric keyboard for doctor order input
    if (DOM.doctorOrder) {
        DOM.doctorOrder.setAttribute('inputmode', 'decimal');
        DOM.doctorOrder.setAttribute('pattern', '[0-9]*[.,]?[0-9]*');
        DOM.doctorOrder.setAttribute('data-numeric', 'true');
        
        // Center align text
        DOM.doctorOrder.style.textAlign = 'center';
        
        // Clear the value - DON'T CONVERT TO PERSIAN HERE
        DOM.doctorOrder.value = '';
    }
    
    document.querySelectorAll('.drug-item-compact').forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = document.querySelector(`.drug-item-compact[data-drug-id="${drugId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    clearResults();
    
    if (DOM.customVolumeContainer) {
        DOM.customVolumeContainer.style.display = 'none';
        DOM.customVolume.value = '';
    }
    AppState.customVolume = false;
}

function updateAmpouleTypeSelector(drug) {
    const container = document.getElementById('ampouleTypeButtons');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (drug.ampouleOptions.length <= 1) {
        container.style.display = 'none';
        AppState.currentAmpouleIndex = 0;
        updateAmpouleInfo();
        return;
    }
    
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.flexWrap = 'wrap';
    container.style.marginTop = '10px';
    
    drug.ampouleOptions.forEach((ampoule, index) => {
        const button = document.createElement('button');
        button.className = 'ampoule-type-btn';
        button.textContent = ampoule.label;
        button.dataset.index = index;
        
        if (index === AppState.currentAmpouleIndex) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            container.querySelectorAll('.ampoule-type-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            button.classList.add('active');
            
            AppState.currentAmpouleIndex = index;
            updateAmpouleInfo();
            clearResults();
        });
        
        container.appendChild(button);
    });
}

function updateAmpouleInfo() {
    const drug = drugDatabase[AppState.selectedDrug];
    const ampoule = drug.ampouleOptions[AppState.currentAmpouleIndex];
    
    if (DOM.ampouleCount) DOM.ampouleCount.textContent = AppState.ampouleCount;
    if (DOM.ampouleInfo) {
        // Use bidirectional formatting for ampoule info
        const labelParts = ampoule.label.split(' in ');
        if (labelParts.length === 2) {
            DOM.ampouleInfo.innerHTML = `
                <span class="text-mixed">هر آمپول:</span>
                <span class="latin-inline">${labelParts[0]}</span>
                <span class="text-mixed"> در </span>
                <span class="latin-inline">${labelParts[1]}</span>
            `;
        } else {
            DOM.ampouleInfo.innerHTML = `
                <span class="text-mixed">هر آمپول:</span>
                <span class="latin-inline">${ampoule.label}</span>
            `;
        }
    }
}

function updateVolumeOptions() {
    const drug = drugDatabase[AppState.selectedDrug];
    const method = AppState.infusionMethod;
    const volumes = drug.defaultSolutionVolumes[method];
    const defaultVol = drug.defaultVolume[method];
    
    if (!DOM.volumeOptions) return;
    
    DOM.volumeOptions.innerHTML = '';
    
    volumes.forEach(volume => {
        const btn = document.createElement('button');
        btn.className = 'volume-preset-btn';
        btn.innerHTML = `
            <span class="number">${volume}</span>
            <span class="unit-text">cc</span>
        `;
        btn.dataset.volume = volume;
        
        if (volume === defaultVol) {
            btn.classList.add('active');
            AppState.solutionVolume = volume;
        }
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.volume-preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.solutionVolume = volume;
            
            if (DOM.customVolumeContainer) {
                DOM.customVolumeContainer.style.display = 'none';
                DOM.customVolume.value = '';
            }
            AppState.customVolume = false;
            
            clearResults();
        });
        
        DOM.volumeOptions.appendChild(btn);
    });
    
    const customBtn = document.createElement('button');
    customBtn.className = 'volume-preset-btn';
    customBtn.innerHTML = '<span class="custom-text">سایر</span>';
    customBtn.addEventListener('click', () => {
        if (DOM.customVolumeContainer) {
            DOM.customVolumeContainer.style.display = 'flex';
            DOM.customVolume.focus();
            AppState.customVolume = true;
            
            document.querySelectorAll('.volume-preset-btn').forEach(b => b.classList.remove('active'));
            clearResults();
        }
    });
    DOM.volumeOptions.appendChild(customBtn);
}

// ============================================
// CALCULATION FUNCTIONS - FIXED VERSION
// ============================================
function calculateInfusion() {
    console.log('Starting calculation...');
    
    const drug = drugDatabase[AppState.selectedDrug];
    const ampoule = drug.ampouleOptions[AppState.currentAmpouleIndex];
    
    // Get the dose value - check both the value and data-numeric-value
    let doseValue;
    
    if (DOM.doctorOrder.value && DOM.doctorOrder.value.trim() !== '') {
        // Try to get from data attribute first (set by blur event)
        if (DOM.doctorOrder.dataset.numericValue) {
            doseValue = parseFloat(DOM.doctorOrder.dataset.numericValue);
        } else {
            // Fall back to parsing the value
            doseValue = PersianNumbers.parseNumber(DOM.doctorOrder.value);
        }
    }
    
    console.log('Dose value:', doseValue);
    
    if (!doseValue || isNaN(doseValue) || doseValue <= 0) {
        showToast('خطا', 'لطفاً مقدار دوز درخواستی را وارد کنید', 'error');
        DOM.doctorOrder.focus();
        DOM.doctorOrder.style.borderColor = 'var(--danger)';
        return;
    }
    
    // Reset border color if valid
    DOM.doctorOrder.style.borderColor = '';
    
    let desiredDosePerHour;
    let weightValue = null;
    
    // Handle weight-based vs non-weight-based calculation
    if (drug.weightBased && drug.weightBased.active && AppState.useWeight) {
        // Weight-based calculation
        let weightValue;
        
        if (DOM.patientWeight.value && DOM.patientWeight.value.trim() !== '') {
            // Try to get from data attribute first
            if (DOM.patientWeight.dataset.numericValue) {
                weightValue = parseFloat(DOM.patientWeight.dataset.numericValue);
            } else {
                // Fall back to parsing the value
                weightValue = PersianNumbers.parseNumber(DOM.patientWeight.value);
            }
        }
        
        console.log('Weight value:', weightValue);
        
        if (!weightValue || isNaN(weightValue) || weightValue <= 0) {
            showToast('خطا', 'لطفاً وزن بیمار را وارد کنید', 'error');
            DOM.patientWeight.focus();
            DOM.patientWeight.style.borderColor = 'var(--danger)';
            return;
        }
        
        DOM.patientWeight.style.borderColor = '';
        AppState.patientWeight = weightValue;
        
        // Calculate dose per hour based on drug
        switch(drug.id) {
            case 'dopamine':
            case 'norepinephrine':
                // Convert mcg/kg/min to mcg/hour
                desiredDosePerHour = doseValue * weightValue * 60;
                break;
            case 'fentanyl':
                // mcg/kg/hour to mcg/hour
                desiredDosePerHour = doseValue * weightValue;
                break;
            case 'midazolam':
                // mcg/kg/min to mg/hour
                desiredDosePerHour = (doseValue * weightValue * 60) / 1000;
                break;
            case 'heparin':
            case 'insulin':
                // units/kg/hour to units/hour
                desiredDosePerHour = doseValue * weightValue;
                break;
            default:
                // Default weight-based calculation
                desiredDosePerHour = doseValue * weightValue;
        }
    } else {
        // Non-weight-based calculation
        AppState.patientWeight = null;
        
        // Handle different units for different drugs
        switch(drug.id) {
            case 'dopamine':
            case 'norepinephrine':
            case 'tng':
                // Dose is in mcg/min, convert to mcg/hour
                desiredDosePerHour = doseValue * 60;
                break;
            case 'amiodarone':
                // Dose is in mg/min, convert to mg/hour
                desiredDosePerHour = doseValue * 60;
                break;
            case 'fentanyl':
                // Dose is in mcg/hour (no conversion needed)
                desiredDosePerHour = doseValue;
                break;
            case 'midazolam':
                // Dose is in mg/hour (no conversion needed)
                desiredDosePerHour = doseValue;
                break;
            case 'heparin':
            case 'insulin':
                // Dose is in units/hour (no conversion needed)
                desiredDosePerHour = doseValue;
                break;
            default:
                // Default: assume dose is already in per hour
                desiredDosePerHour = doseValue;
        }
    }
    
    // Handle custom volume
    if (AppState.customVolume) {
        let customVol;
        
        if (DOM.customVolume.value && DOM.customVolume.value.trim() !== '') {
            // Try to get from data attribute first
            if (DOM.customVolume.dataset.numericValue) {
                customVol = parseFloat(DOM.customVolume.dataset.numericValue);
            } else {
                // Fall back to parsing the value
                customVol = PersianNumbers.parseNumber(DOM.customVolume.value);
            }
        }
        
        console.log('Custom volume:', customVol);
        
        if (!customVol || isNaN(customVol) || customVol <= 0) {
            showToast('خطا', 'حجم محلول وارد شده معتبر نیست', 'error');
            DOM.customVolume.focus();
            DOM.customVolume.style.borderColor = 'var(--danger)';
            return;
        }
        
        DOM.customVolume.style.borderColor = '';
        AppState.solutionVolume = customVol;
    }
    
    // Store desired dose
    AppState.desiredDose = doseValue;
    
    // Calculate total drug in original unit
    const totalDrug = AppState.ampouleCount * ampoule.strength;
    
    // Calculate concentration
    const concentration = totalDrug / AppState.solutionVolume;
    
    // Convert units for calculation if needed
    let totalDrugForCalculation = totalDrug;
    let concentrationForCalculation = concentration;
    let desiredDoseForCalculation = desiredDosePerHour;
    
    // Handle drugs that need unit conversion (e.g., mg to mcg)
    if (drug.id === 'norepinephrine' || drug.id === 'dopamine' || drug.id === 'fentanyl' || drug.id === 'tng') {
        // These drugs need conversion from mg to mcg
        totalDrugForCalculation = totalDrug * 1000; // Convert mg to mcg
        concentrationForCalculation = totalDrugForCalculation / AppState.solutionVolume;
    } else if (drug.id === 'midazolam') {
        // Midazolam: ampoules are in mg, but weight-based calculation might be in mcg
        if (drug.weightBased && drug.weightBased.active && AppState.useWeight) {
            // We already converted to mg/hour above, so no further conversion needed
        }
    }
    
    // Calculate pump rate
    const pumpRate = desiredDoseForCalculation / concentrationForCalculation;
    
    // Calculate infusion duration
    const duration = AppState.solutionVolume / pumpRate;
    
    console.log('Calculation results:', {
        totalDrug,
        concentration,
        pumpRate,
        duration,
        desiredDosePerHour
    });
    
    // Display results with appropriate unit
    displayResults(totalDrug, concentration, pumpRate, duration, ampoule.unit);
    
    // Generate guide
    generateStepByStepGuide(drug, totalDrug, concentration, pumpRate, doseValue);
    
    // Show warnings
    displayWarnings(drug);
    
    // Show compatibility
    displayCompatibility(drug);
    
    // Save calculation if enabled
    if (AppState.settings.saveHistory) {
        saveCalculation(totalDrug, concentration, pumpRate, duration);
    }
    
    // Update stats
    updateCalculationStats();
    
    showToast('موفق', 'محاسبه با موفقیت انجام شد', 'success');
}

function displayResults(totalDrug, concentration, pumpRate, duration, unit) {
    const format = (num) => {
        if (num >= 1000) return num.toFixed(0);
        if (num >= 100) return num.toFixed(1);
        if (num >= 10) return num.toFixed(2);
        if (num >= 1) return num.toFixed(3);
        return num.toFixed(4);
    };
    
    const drug = drugDatabase[AppState.selectedDrug];
    
    // Format with Persian numbers
    DOM.totalDrugAmount.textContent = PersianNumbers.formatNumber(totalDrug, 0);
    DOM.totalDrugUnit.innerHTML = `<span class="latin-inline">${unit}</span>`;
    
    let concentrationDisplay, concentrationUnitDisplay;
    
    if (drug.id === 'norepinephrine' || drug.id === 'dopamine' || drug.id === 'fentanyl' || drug.id === 'tng') {
        if (unit === 'mg') {
            concentrationDisplay = PersianNumbers.formatNumber(concentration * 1000, 2);
            concentrationUnitDisplay = 'mcg/cc';
        } else {
            concentrationDisplay = PersianNumbers.formatNumber(concentration, 2);
            concentrationUnitDisplay = `${unit}/cc`;
        }
    } else {
        concentrationDisplay = PersianNumbers.formatNumber(concentration, 2);
        concentrationUnitDisplay = `${unit}/cc`;
    }
    
    DOM.concentrationResult.textContent = concentrationDisplay;
    DOM.concentrationUnit.innerHTML = `<span class="latin-inline">${concentrationUnitDisplay}</span>`;
    
    DOM.pumpRateResult.textContent = PersianNumbers.formatNumber(pumpRate, 2);
    DOM.pumpRateUnit.innerHTML = `<span class="latin-inline">cc/hour</span>`;
    
    DOM.durationResult.textContent = PersianNumbers.formatNumber(duration, 1);
    DOM.durationUnit.innerHTML = `<span class="persian-inline">ساعت</span>`;
    
    if (DOM.resultsSection) {
        DOM.resultsSection.classList.add('show');
        DOM.resultsSection.style.display = 'block';
        
        setTimeout(() => {
            DOM.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

function clearResults() {
    if (DOM.resultsSection) {
        DOM.resultsSection.classList.remove('show');
        DOM.resultsSection.style.display = 'none';
    }
    if (DOM.guideSection) {
        DOM.guideSection.style.display = 'none';
    }
    if (DOM.warningsSection) {
        DOM.warningsSection.style.display = 'none';
    }
    if (DOM.compatibilitySection) {
        DOM.compatibilitySection.style.display = 'none';
    }
}

function generateStepByStepGuide(drug, totalDrug, concentration, pumpRate, desiredDose) {
    if (!DOM.guideSection || !DOM.stepByStepGuide) return;
    
    DOM.stepByStepGuide.innerHTML = '';
    
    const steps = [
        `1. آماده کردن ${AppState.ampouleCount} آمپول ${drug.persianName}`,
        `2. کشیدن ${AppState.solutionVolume} cc محلول ${drug.solutionType[0]} به سرنگ/کیسه`,
        `3. اضافه کردن ${PersianNumbers.formatNumber(totalDrug, 0)} ${drug.ampouleOptions[0].unit} از دارو به محلول`,
        `4. مخلوط کردن کامل محلول`,
        `5. نصب سرنگ/کیسه بر روی پمپ ${AppState.infusionMethod === 'syringe' ? 'سرنگ' : 'انفوزیون'}د`,
        `6. تنظیم سرعت پمپ بر روی ${PersianNumbers.formatNumber(pumpRate, 2)} cc/hour`,
        `7. شروع تزریق با دوز ${PersianNumbers.formatNumber(desiredDose, 2)} ${drug.standardUnit}`
    ];
    
    steps.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'guide-step';
        stepDiv.innerHTML = `
            <div class="step-content">${step}</div>
        `;
        DOM.stepByStepGuide.appendChild(stepDiv);
    });
    
    DOM.guideSection.style.display = 'block';
}

function displayWarnings(drug) {
    if (!DOM.warningsSection || !DOM.warningsList || !drug.cautions) return;
    
    DOM.warningsList.innerHTML = '';
    
    drug.cautions.forEach(caution => {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-item';
        warningDiv.innerHTML = `
            <i class="fas fa-exclamation-circle warning-icon"></i>
            <span class="warning-text">${caution}</span>
        `;
        DOM.warningsList.appendChild(warningDiv);
    });
    
    DOM.warningsSection.style.display = 'block';
}

function displayCompatibility(drug) {
    if (!DOM.compatibilitySection || !DOM.compatibleDrugsList || !DOM.incompatibleDrugsList) return;
    
    DOM.compatibleDrugsList.innerHTML = '';
    DOM.incompatibleDrugsList.innerHTML = '';
    
    if (drug.ySiteCompatibilities) {
        drug.ySiteCompatibilities.compatible.forEach(drugName => {
            const item = document.createElement('div');
            item.textContent = drugName;
            item.className = 'persian-text';
            DOM.compatibleDrugsList.appendChild(item);
        });
        
        drug.ySiteCompatibilities.incompatible.forEach(drugName => {
            const item = document.createElement('div');
            item.textContent = drugName;
            item.className = 'persian-text';
            DOM.incompatibleDrugsList.appendChild(item);
        });
    }
    
    DOM.compatibilitySection.style.display = 'block';
}

function updateWeightBasedUnit(drug) {
    const unitElement = document.getElementById('orderUnit');
    if (!unitElement || !drug.weightBased) return;
    
    if (AppState.useWeight) {
        unitElement.textContent = drug.weightBased.unit;
    } else {
        unitElement.textContent = drug.weightBased.nonWeightUnit || drug.standardUnit;
    }
    
    clearResults();
}

// ============================================
// EVENT HANDLERS - SIMPLIFIED
// ============================================
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (DOM.historyBtn) {
        DOM.historyBtn.addEventListener('click', () => {
            loadHistory();
            if (DOM.historyModal) {
                DOM.historyModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    }
    
    if (DOM.settingsBtn) {
        DOM.settingsBtn.addEventListener('click', () => {
            if (DOM.settingsModal) {
                DOM.settingsModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    }
    
    if (DOM.tabItems) {
        DOM.tabItems.forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                switchTab(tab);
            });
        });
    }
    
    if (DOM.methodBtns) {
        DOM.methodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                DOM.methodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                AppState.infusionMethod = this.dataset.method;
                
                fixMethodButtonTextColor();
                updateVolumeOptions();
                clearResults();
            });
        });
    }
    
    if (DOM.decreaseAmpoule) {
        DOM.decreaseAmpoule.addEventListener('click', () => {
            if (AppState.ampouleCount > 1) {
                AppState.ampouleCount--;
                updateAmpouleInfo();
                clearResults();
            }
        });
    }
    
    if (DOM.increaseAmpoule) {
        DOM.increaseAmpoule.addEventListener('click', () => {
            const drug = drugDatabase[AppState.selectedDrug];
            const maxAmpoules = Math.floor(1000 / drug.ampouleOptions[0].strength) || 20;
            if (AppState.ampouleCount < maxAmpoules) {
                AppState.ampouleCount++;
                updateAmpouleInfo();
                clearResults();
            }
        });
    }
    
    if (DOM.weightCheckbox && DOM.patientWeight) {
        DOM.weightCheckbox.addEventListener('change', function() {
            console.log('Weight checkbox changed to:', this.checked);
            AppState.useWeight = this.checked;
            DOM.patientWeight.disabled = !this.checked;
            
            const drug = drugDatabase[AppState.selectedDrug];
            updateWeightBasedUnit(drug);
            
            if (this.checked && DOM.patientWeight) {
                DOM.patientWeight.focus();
            }
            
            clearResults();
            
            if (this.checked) {
                showToast('اطلاع', 'محاسبه بر اساس وزن فعال شد', 'info');
            }
        });
    }
    
    if (DOM.customVolume) {
        // Set numeric keyboard attributes for custom volume
        if (DOM.customVolume) {
            DOM.customVolume.setAttribute('inputmode', 'numeric');
            DOM.customVolume.setAttribute('pattern', '[0-9]*');
            DOM.customVolume.setAttribute('data-numeric', 'true');
            // Center align text
            DOM.customVolume.style.textAlign = 'center';
        }
    }
    
    if (DOM.calculateBtn) {
        DOM.calculateBtn.addEventListener('click', calculateInfusion);
    }
    
    if (DOM.doctorOrder) {
        DOM.doctorOrder.addEventListener('input', () => {
            clearResults();
        });
        
        DOM.doctorOrder.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateInfusion();
            }
        });
    }
    
    if (DOM.closeSettings) {
        DOM.closeSettings.addEventListener('click', () => {
            if (DOM.settingsModal) {
                DOM.settingsModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    if (DOM.closeHistory) {
        DOM.closeHistory.addEventListener('click', () => {
            if (DOM.historyModal) {
                DOM.historyModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    if (DOM.drugSearch) {
        DOM.drugSearch.addEventListener('input', function() {
            const term = this.value.toLowerCase();
            document.querySelectorAll('.drug-item-compact').forEach(card => {
                const drugId = card.dataset.drugId;
                const drug = drugDatabase[drugId];
                if (!drug) return;
                
                const searchText = [
                    drug.persianName,
                    drug.englishName,
                    drug.category,
                    ...(drug.alternativeNames || [])
                ].join(' ').toLowerCase();
                
                card.style.display = searchText.includes(term) ? 'flex' : 'none';
            });
        });
    }
    
    if (DOM.librarySearch) {
        DOM.librarySearch.addEventListener('input', function() {
            const term = this.value.toLowerCase();
            document.querySelectorAll('.drug-library-card').forEach(card => {
                const drugName = card.querySelector('.drug-library-title')?.textContent || '';
                const englishName = card.querySelector('.drug-library-english')?.textContent || '';
                const searchText = (drugName + ' ' + englishName).toLowerCase();
                
                card.style.display = searchText.includes(term) ? 'block' : 'none';
            });
        });
    }
    
    setupSettingsEventListeners();
    
    window.addEventListener('resize', () => {
        setupMobileLayout();
    });
    
    console.log('Event listeners setup complete');
}

function setupSettingsEventListeners() {
    if (DOM.darkModeToggle) {
        DOM.darkModeToggle.addEventListener('change', function() {
            AppState.settings.darkMode = this.checked;
            saveSettings();
            applySettings();
        });
    }
    
    if (DOM.largeFontToggle) {
        DOM.largeFontToggle.addEventListener('change', function() {
            AppState.settings.largeFont = this.checked;
            saveSettings();
            applySettings();
        });
    }
    
    if (DOM.doseAlertToggle) {
        DOM.doseAlertToggle.addEventListener('change', function() {
            AppState.settings.doseAlerts = this.checked;
            saveSettings();
        });
    }
    
    if (DOM.compatAlertToggle) {
        DOM.compatAlertToggle.addEventListener('change', function() {
            AppState.settings.compatAlerts = this.checked;
            saveSettings();
        });
    }
    
    if (DOM.saveHistoryToggle) {
        DOM.saveHistoryToggle.addEventListener('change', function() {
            AppState.settings.saveHistory = this.checked;
            saveSettings();
        });
    }
    
    if (DOM.clearHistoryBtn) {
        DOM.clearHistoryBtn.addEventListener('click', function() {
            if (confirm('آیا از پاک کردن تاریخچه اطمینان دارید؟')) {
                localStorage.removeItem('calculationHistory');
                showToast('تاریخچه پاک شد', 'تمامی محاسبات ذخیره شده حذف شدند.', 'success');
            }
        });
    }
    
    if (DOM.exportDataBtn) {
        DOM.exportDataBtn.addEventListener('click', function() {
            showToast('اطلاع', 'این ویژگی در نسخه بعدی اضافه خواهد شد', 'info');
        });
    }
    
    if (DOM.checkUpdateBtn) {
        DOM.checkUpdateBtn.addEventListener('click', function() {
            showToast('بررسی به‌روزرسانی', 'نسخه فعلی 2.0.1 آخرین نسخه موجود است.', 'info');
        });
    }
}

// ============================================
// MANUAL CALCULATION FUNCTIONS
// ============================================
function setupManualCalculation() {
    const openManualBtn = DOM.openManualBtn;
    const manualSection = DOM.manualSection;
    const calculatorControls = DOM.calculatorControls;
    
    if (openManualBtn && manualSection && calculatorControls) {
        openManualBtn.addEventListener('click', () => {
            openManualCalculation();
        });
    }
}

function openManualCalculation() {
    const manualSection = DOM.manualSection;
    const calculatorControls = DOM.calculatorControls;
    const selectedDrugHeader = document.querySelector('.selected-drug-compact');
    const drugSidebar = document.querySelector('.drug-sidebar');
    
    if (manualSection && calculatorControls) {
        if (calculatorControls) calculatorControls.style.display = 'none';
        if (selectedDrugHeader) selectedDrugHeader.style.display = 'none';
        
        if (manualSection) {
            manualSection.style.display = 'flex';
            manualSection.style.flexDirection = 'column';
            manualSection.style.height = '100%';
            
            if (!manualSection.querySelector('.manual-controls')) {
                createManualCalculationContent();
            }
        }
        
        const sectionsToHide = [
            'resultsSection',
            'guideSection',
            'warningsSection',
            'compatibilitySection'
        ];
        
        sectionsToHide.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
        
        if (drugSidebar && window.innerWidth < 768) {
            drugSidebar.style.display = 'none';
        }
    }
}

function createManualCalculationContent() {
    const manualSection = document.getElementById('manualSection');
    if (!manualSection) return;
    
    manualSection.innerHTML = `
        <div class="manual-header">
            <h3><i class="fas fa-edit"></i> محاسبه دستی دارو</h3>
            <button class="icon-btn" id="closeManualBtn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="manual-controls">
            <div class="control-group">
                <label><i class="fas fa-pills"></i> نام دارو (اختیاری)</label>
                <input type="text" id="manualDrugName" placeholder="نام دارو را وارد کنید" class="persian-text" style="text-align: center;">
            </div>
            
            <div class="control-group">
                <label><i class="fas fa-infinity"></i> روش تزریق</label>
                <div class="method-selector-compact">
                    <button class="method-btn-compact active" data-method="syringe">
                        <i class="fas fa-syringe"></i> پمپ سرنگ
                    </button>
                    <button class="method-btn-compact" data-method="infusion">
                        <i class="fas fa-pump-medical"></i> پمپ انفوزیون
                    </button>
                </div>
            </div>
            
            <div class="manual-inputs-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div class="control-group">
                    <label><i class="fas fa-vial"></i> قدرت آمپول</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualStrength" placeholder="0" step="0.01" min="0.01" value="5000" 
                               inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" data-numeric="true" style="text-align: center;">
                        <select id="manualStrengthUnit">
                            <option value="units">واحد</option>
                            <option value="mg">میلی‌گرم</option>
                            <option value="mcg">میکروگرم</option>
                            <option value="g">گرم</option>
                        </select>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-vial"></i> حجم آمپول</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualVialVolume" placeholder="0" step="0.1" min="0.1" value="1"
                               inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" data-numeric="true" style="text-align: center;">
                        <span class="unit">میلی‌لیتر</span>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-syringe"></i> تعداد آمپول</label>
                    <div class="ampoule-control-enhanced">
                        <button class="ampoule-btn-enhanced" id="manualDecreaseAmpoule">
                            <i class="fas fa-minus"></i>
                        </button>
                        <div class="ampoule-count-enhanced">
                            <span id="manualAmpouleCount">1</span>
                            <small>عدد</small>
                        </div>
                        <button class="ampoule-btn-enhanced" id="manualIncreaseAmpoule">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-flask"></i> حجم محلول</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualSolutionVolume" placeholder="0" step="1" min="1" value="50"
                               inputmode="numeric" pattern="[0-9]*" data-numeric="true" style="text-align: center;">
                        <span class="unit">سی‌سی</span>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-file-medical-alt"></i> دوز درخواستی</label>
                    <div class="dose-input-enhanced">
                        <div class="dose-input-wrapper">
                            <input type="number" id="manualDesiredDose" placeholder="0" step="0.01" min="0.01" value="1000"
                                   inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" data-numeric="true" style="text-align: center;">
                            <select class="dose-unit-enhanced" id="manualDoseUnit">
                                <option value="units/hour">واحد/ساعت</option>
                                <option value="mg/hour">میلی‌گرم/ساعت</option>
                                <option value="mcg/hour">میکروگرم/ساعت</option>
                                <option value="mg/min">میلی‌گرم/دقیقه</option>
                                <option value="mcg/min">میکروگرم/دقیقه</option>
                                <option value="mcg/kg/min">میکروگرم/کیلوگرم/دقیقه</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-weight-scale"></i> وزن بیمار (اختیاری)</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualPatientWeight" placeholder="0" step="0.1" min="1" value="70"
                               inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" data-numeric="true" style="text-align: center;">
                        <span class="unit">کیلوگرم</span>
                    </div>
                </div>
            </div>
            
            <button class="calculate-btn-enhanced" id="manualCalculateBtn">
                <i class="fas fa-calculator"></i>
                <span>محاسبه سرعت پمپ</span>
            </button>
            
            <div class="manual-results" id="manualResults" style="display: none; margin-top: 20px;">
                <h4><i class="fas fa-chart-line"></i> نتایج محاسبه دستی</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <div class="result-item-enhanced">
                        <div class="result-label-enhanced">غلظت محلول</div>
                        <div class="result-value-enhanced" id="manualConcentration">0</div>
                        <div class="result-unit-enhanced" id="manualConcentrationUnit">واحد/سی‌سی</div>
                    </div>
                    <div class="result-item-enhanced highlight">
                        <div class="result-label-enhanced">سرعت پمپ</div>
                        <div class="result-value-enhanced" id="manualPumpRate">0</div>
                        <div class="result-unit-enhanced">سی‌سی/ساعت</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupManualCalculationFunctionality();
}

function setupManualCalculationFunctionality() {
    const methodBtns = document.querySelectorAll('#manualSection .method-btn-compact');
    methodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            methodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            AppState.infusionMethod = this.dataset.method;
        });
    });
    
    let manualAmpCount = 1;
    document.getElementById('manualDecreaseAmpoule').addEventListener('click', () => {
        if (manualAmpCount > 1) {
            manualAmpCount--;
            document.getElementById('manualAmpouleCount').textContent = manualAmpCount;
        }
    });
    
    document.getElementById('manualIncreaseAmpoule').addEventListener('click', () => {
        if (manualAmpCount < 20) {
            manualAmpCount++;
            document.getElementById('manualAmpouleCount').textContent = manualAmpCount;
        }
    });
    
    document.getElementById('manualCalculateBtn').addEventListener('click', calculateManualInfusion);
    
    document.getElementById('closeManualBtn').addEventListener('click', () => {
        document.getElementById('manualSection').style.display = 'none';
        document.getElementById('calculatorControls').style.display = 'grid';
        
        // Show drug sidebar again
        const drugSidebar = document.querySelector('.drug-sidebar');
        if (drugSidebar && window.innerWidth < 768) {
            drugSidebar.style.display = 'flex';
        }
    });
}

function calculateManualInfusion() {
    const strength = PersianNumbers.parseNumber(document.getElementById('manualStrength').value);
    const strengthUnit = document.getElementById('manualStrengthUnit').value;
    const vialVolume = PersianNumbers.parseNumber(document.getElementById('manualVialVolume').value);
    const ampouleCount = parseInt(document.getElementById('manualAmpouleCount').textContent);
    const solutionVolume = PersianNumbers.parseNumber(document.getElementById('manualSolutionVolume').value);
    const desiredDose = PersianNumbers.parseNumber(document.getElementById('manualDesiredDose').value);
    const doseUnit = document.getElementById('manualDoseUnit').value;
    const patientWeight = PersianNumbers.parseNumber(document.getElementById('manualPatientWeight').value) || 0;
    
    if (!strength || !vialVolume || !solutionVolume || !desiredDose) {
        showToast('خطا', 'لطفاً تمامی فیلدهای ضروری را پر کنید', 'error');
        return;
    }
    
    const totalDrug = ampouleCount * strength;
    const concentration = totalDrug / solutionVolume;
    
    let pumpRate;
    let desiredDosePerHour = desiredDose;
    
    if (doseUnit.includes('/min')) {
        desiredDosePerHour = desiredDose * 60;
    }
    
    if (doseUnit.includes('/kg/') && patientWeight > 0) {
        desiredDosePerHour = desiredDose * patientWeight;
        if (doseUnit.includes('/min')) {
            desiredDosePerHour *= 60;
        }
    }
    
    pumpRate = desiredDosePerHour / concentration;
    
    document.getElementById('manualConcentration').textContent = PersianNumbers.formatNumber(concentration, 2);
    document.getElementById('manualConcentrationUnit').innerHTML = `
        <span class="latin-inline">${strengthUnit}</span>
        <span class="text-mixed">/</span>
        <span class="latin-inline">سی‌سی</span>
    `;
    document.getElementById('manualPumpRate').textContent = PersianNumbers.formatNumber(pumpRate, 2);
    
    document.getElementById('manualResults').style.display = 'block';
    
    showToast('موفق', 'محاسبه دستی انجام شد', 'success');
}

// ============================================
// TAB MANAGEMENT
// ============================================
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    DOM.tabItems.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    DOM.tabPanes.forEach(pane => {
        if (pane.id === tabName + 'Tab') {
            pane.classList.add('active');
            pane.style.display = 'block';
        } else {
            pane.classList.remove('active');
            pane.style.display = 'none';
        }
    });
    
    AppState.currentTab = tabName;
    
    if (window.innerWidth <= 768) {
        fixTabVisibility();
    }
    
    if (tabName === 'drugs') {
        loadDrugLibrary();
    }
}

// ============================================
// THEME MANAGEMENT
// ============================================
function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', AppState.theme === 'dark');
    
    AppState.settings.darkMode = AppState.theme === 'dark';
    saveSettings();
    
    const icon = DOM.themeToggle.querySelector('i');
    if (icon) {
        icon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    localStorage.setItem('theme', AppState.theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    AppState.theme = savedTheme;
    document.body.classList.toggle('dark-mode', AppState.theme === 'dark');
    
    const icon = DOM.themeToggle.querySelector('i');
    if (icon) {
        icon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ============================================
// CONVERTERS - ALL FUNCTIONAL
// ============================================
function initializeConverters() {
    console.log('Initializing converters...');
    
    // Set default values
    document.getElementById('electrolyteValue').value = '100';
    document.getElementById('percentageValue').value = '5';
    document.getElementById('unitValue').value = '1000';
    document.getElementById('dripVolume').value = '1000';
    document.getElementById('dripTime').value = '8';
    
    // Set numeric keyboard attributes for converter inputs
    const converterInputs = [
        'electrolyteValue',
        'percentageValue',
        'percentageVolume',
        'unitValue',
        'dripVolume',
        'dripTime',
        'dripFactor'
    ];
    
    converterInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.setAttribute('inputmode', 'decimal');
            input.setAttribute('pattern', '[0-9]*[.,]?[0-9]*');
            input.setAttribute('data-numeric', 'true');
            // Center align text
            input.style.textAlign = 'center';
        }
    });
}

// Electrolyte Converter
function convertElectrolyte() {
    const element = document.getElementById('electrolyteElement').value;
    const valueText = document.getElementById('electrolyteValue').value;
    const fromUnit = document.getElementById('electrolyteFrom').value;
    
    const value = PersianNumbers.parseNumber(valueText);
    
    if (!value || isNaN(value)) {
        showToast('خطا', 'لطفاً مقدار را وارد کنید', 'error');
        return;
    }
    
    let result = '';
    if (fromUnit === 'mEq') {
        const conversions = {
            sodium: 23,
            potassium: 39,
            calcium: 20,
            magnesium: 12
        };
        const mg = value * conversions[element];
        result = `${PersianNumbers.formatNumber(mg, 2)} میلی‌گرم`;
    } else {
        const conversions = {
            sodium: 1/23,
            potassium: 1/39,
            calcium: 1/20,
            magnesium: 1/12
        };
        const mEq = value * conversions[element];
        result = `${PersianNumbers.formatNumber(mEq, 2)} mEq`;
    }
    
    document.getElementById('electrolyteResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'تبدیل انجام شد', 'success');
}

// Percentage Converter
function convertPercentage() {
    const percentText = document.getElementById('percentageValue').value;
    const volumeText = document.getElementById('percentageVolume').value;
    
    const percent = PersianNumbers.parseNumber(percentText);
    const volume = PersianNumbers.parseNumber(volumeText);
    
    if (!percent || !volume || isNaN(percent) || isNaN(volume)) {
        showToast('خطا', 'لطفاً مقادیر را وارد کنید', 'error');
        return;
    }
    
    const grams = (percent / 100) * volume;
    const result = `${PersianNumbers.formatNumber(grams, 2)} گرم در ${PersianNumbers.formatNumber(volume, 0)} میلی‌لیتر`;
    
    document.getElementById('percentageResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'محاسبه انجام شد', 'success');
}

// Unit Converter
function convertUnits() {
    const fromUnit = document.getElementById('unitFrom').value;
    const toUnit = document.getElementById('unitTo').value;
    const valueText = document.getElementById('unitValue').value;
    
    const value = PersianNumbers.parseNumber(valueText);
    
    if (!value || isNaN(value)) {
        showToast('خطا', 'لطفاً مقدار را وارد کنید', 'error');
        return;
    }
    
    let result = 0;
    
    // Convert everything to base unit first (mg)
    let valueInMg = 0;
    
    switch(fromUnit) {
        case 'mcg':
            valueInMg = value / 1000;
            break;
        case 'mg':
            valueInMg = value;
            break;
        case 'g':
            valueInMg = value * 1000;
            break;
        case 'units':
            // For insulin: 1 unit = 0.0347 mg (approximate)
            valueInMg = value * 0.0347;
            break;
        default:
            valueInMg = value;
    }
    
    // Convert from mg to target unit
    switch(toUnit) {
        case 'mcg':
            result = valueInMg * 1000;
            break;
        case 'mg':
            result = valueInMg;
            break;
        case 'g':
            result = valueInMg / 1000;
            break;
        case 'units':
            result = valueInMg / 0.0347;
            break;
        default:
            result = valueInMg;
    }
    
    const resultText = `${PersianNumbers.formatNumber(result, 3)} ${toUnit}`;
    document.getElementById('unitResult').innerHTML = `
        <span class="latin-inline">${resultText}</span>
    `;
    showToast('موفق', 'تبدیل واحد انجام شد', 'success');
}

// Drip Rate Calculator
function calculateDripRate() {
    const volumeText = document.getElementById('dripVolume').value;
    const timeText = document.getElementById('dripTime').value;
    const factorText = document.getElementById('dripFactor').value;
    
    const volume = PersianNumbers.parseNumber(volumeText);
    const time = PersianNumbers.parseNumber(timeText);
    const factor = PersianNumbers.parseNumber(factorText);
    
    if (!volume || !time || !factor || isNaN(volume) || isNaN(time) || isNaN(factor)) {
        showToast('خطا', 'لطفاً تمامی مقادیر را وارد کنید', 'error');
        return;
    }
    
    const mlPerHour = volume / time;
    const dropsPerMinute = (mlPerHour * factor) / 60;
    
    const result = `${PersianNumbers.formatNumber(dropsPerMinute, 1)} قطره در دقیقه`;
    document.getElementById('dripResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'محاسبه دراپ انجام شد', 'success');
}

// ============================================
// TOOLS - ALL FUNCTIONAL
// ============================================
function initializeTools() {
    console.log('Initializing tools...');
    
    // Set default values
    document.getElementById('bmiWeight').value = '70';
    document.getElementById('bmiHeight').value = '170';
    document.getElementById('bsaWeight').value = '70';
    document.getElementById('bsaHeight').value = '170';
    document.getElementById('ibwHeight').value = '170';
    document.getElementById('crclAge').value = '40';
    document.getElementById('crclWeight').value = '70';
    document.getElementById('crclValue').value = '1.0';
    document.getElementById('doseNeeded').value = '100';
    document.getElementById('doseConcentration').value = '10';
    document.getElementById('doseVialVolume').value = '10';
    
    // Set numeric keyboard attributes for tool inputs
    const toolInputs = [
        'bmiWeight', 'bmiHeight',
        'bsaWeight', 'bsaHeight',
        'ibwHeight',
        'crclAge', 'crclWeight', 'crclValue',
        'doseNeeded', 'doseConcentration', 'doseVialVolume'
    ];
    
    toolInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.setAttribute('inputmode', 'decimal');
            input.setAttribute('pattern', '[0-9]*[.,]?[0-9]*');
            input.setAttribute('data-numeric', 'true');
            // Center align text
            input.style.textAlign = 'center';
        }
    });
}

// BMI Calculator
function calculateBMI() {
    const weightText = document.getElementById('bmiWeight').value;
    const heightText = document.getElementById('bmiHeight').value;
    
    const weight = PersianNumbers.parseNumber(weightText);
    const height = PersianNumbers.parseNumber(heightText);
    
    if (!weight || !height || isNaN(weight) || isNaN(height)) {
        showToast('خطا', 'لطفاً وزن و قد را وارد کنید', 'error');
        return;
    }
    
    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'کمبود وزن';
    else if (bmi < 25) category = 'طبیعی';
    else if (bmi < 30) category = 'اضافه وزن';
    else category = 'چاقی';
    
    const result = `BMI: ${PersianNumbers.formatNumber(bmi, 1)} (${category})`;
    document.getElementById('bmiResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'محاسبه BMI انجام شد', 'success');
}

// Body Surface Area (BSA)
function calculateBSA() {
    const weightText = document.getElementById('bsaWeight').value;
    const heightText = document.getElementById('bsaHeight').value;
    const formula = document.getElementById('bsaFormula').value;
    
    const weight = PersianNumbers.parseNumber(weightText);
    const height = PersianNumbers.parseNumber(heightText);
    
    if (!weight || !height || isNaN(weight) || isNaN(height)) {
        showToast('خطا', 'لطفاً وزن و قد را وارد کنید', 'error');
        return;
    }
    
    let bsa = 0;
    
    switch(formula) {
        case 'mosteller':
            bsa = Math.sqrt((weight * height) / 3600);
            break;
        case 'dubois':
            bsa = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
            break;
        case 'haycock':
            bsa = 0.024265 * Math.pow(weight, 0.5378) * Math.pow(height, 0.3964);
            break;
    }
    
    const result = `${PersianNumbers.formatNumber(bsa, 2)} متر مربع`;
    document.getElementById('bsaResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'محاسبه BSA انجام شد', 'success');
}

// Ideal Body Weight (IBW)
function calculateIBW() {
    const heightText = document.getElementById('ibwHeight').value;
    const gender = document.getElementById('ibwGender').value;
    const formula = document.getElementById('ibwFormula').value;
    
    const height = PersianNumbers.parseNumber(heightText);
    
    if (!height || isNaN(height)) {
        showToast('خطا', 'لطفاً قد را وارد کنید', 'error');
        return;
    }
    
    let ibw = 0;
    const heightInches = height / 2.54;
    
    switch(formula) {
        case 'devine':
            if (gender === 'male') {
                ibw = 50 + 2.3 * (heightInches - 60);
            } else {
                ibw = 45.5 + 2.3 * (heightInches - 60);
            }
            break;
        case 'robinson':
            if (gender === 'male') {
                ibw = 52 + 1.9 * (heightInches - 60);
            } else {
                ibw = 49 + 1.7 * (heightInches - 60);
            }
            break;
        case 'miller':
            if (gender === 'male') {
                ibw = 56.2 + 1.41 * (heightInches - 60);
            } else {
                ibw = 53.1 + 1.36 * (heightInches - 60);
            }
            break;
    }
    
    const result = `${PersianNumbers.formatNumber(ibw, 1)} کیلوگرم`;
    document.getElementById('ibwResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'محاسبه وزن ایده‌آل انجام شد', 'success');
}

// Creatinine Clearance (CrCl)
function calculateCrCl() {
    const ageText = document.getElementById('crclAge').value;
    const weightText = document.getElementById('crclWeight').value;
    const creatinineText = document.getElementById('crclValue').value;
    const gender = document.getElementById('crclGender').value;
    
    const age = PersianNumbers.parseNumber(ageText);
    const weight = PersianNumbers.parseNumber(weightText);
    const creatinine = PersianNumbers.parseNumber(creatinineText);
    
    if (!age || !weight || !creatinine || isNaN(age) || isNaN(weight) || isNaN(creatinine)) {
        showToast('خطا', 'لطفاً تمامی مقادیر را وارد کنید', 'error');
        return;
    }
    
    let crcl = ((140 - age) * weight) / (72 * creatinine);
    
    if (gender === 'female') {
        crcl *= 0.85;
    }
    
    let kidneyFunction = '';
    if (crcl > 90) kidneyFunction = 'طبیعی';
    else if (crcl > 60) kidneyFunction = 'کاهش خفیف';
    else if (crcl > 30) kidneyFunction = 'کاهش متوسط';
    else if (crcl > 15) kidneyFunction = 'کاهش شدید';
    else kidneyFunction = 'نارسایی کلیه';
    
    const result = `${PersianNumbers.formatNumber(crcl, 0)} ml/min (${kidneyFunction})`;
    document.getElementById('crclResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'محاسبه کلیرانس انجام شد', 'success');
}

// Compatibility Checker
function checkCompatibility() {
    const drug1 = document.getElementById('compatDrug1').value;
    const drug2 = document.getElementById('compatDrug2').value;
    const solution = document.getElementById('compatSolution').value;
    
    if (!drug1 || !drug2) {
        showToast('خطا', 'لطفاً هر دو دارو را انتخاب کنید', 'error');
        return;
    }
    
    if (drug1 === drug2) {
        document.getElementById('compatResult').innerHTML = `
            <span class="persian-text">داروهای یکسان انتخاب شده‌اند</span>
        `;
        showToast('هشدار', 'داروهای یکسان انتخاب شده‌اند', 'warning');
        return;
    }
    
    // Simple compatibility logic (you can expand this)
    const drug1Data = drugDatabase[drug1];
    const drug2Data = drugDatabase[drug2];
    
    if (!drug1Data || !drug2Data) {
        document.getElementById('compatResult').innerHTML = `
            <span class="persian-text">اطلاعات دارو یافت نشد</span>
        `;
        showToast('خطا', 'اطلاعات دارو یافت نشد', 'error');
        return;
    }
    
    // Check if both drugs are compatible with the selected solution
    const drug1Compatible = drug1Data.solutionType.includes(solution);
    const drug2Compatible = drug2Data.solutionType.includes(solution);
    
    if (!drug1Compatible || !drug2Compatible) {
        const incompatibleDrug = !drug1Compatible ? drug1Data.persianName : drug2Data.persianName;
        const result = `${incompatibleDrug} با محلول ${solution} سازگار نیست`;
        document.getElementById('compatResult').innerHTML = `
            <span class="persian-text">${result}</span>
        `;
        showToast('هشدار', 'سازگاری محلول بررسی شود', 'warning');
        return;
    }
    
    // For demo purposes, show a simple compatibility check
    const compatiblePairs = [
        ['heparin', 'fentanyl'],
        ['heparin', 'midazolam'],
        ['furosemide', 'dopamine']
    ];
    
    let isCompatible = false;
    for (const pair of compatiblePairs) {
        if ((pair[0] === drug1 && pair[1] === drug2) || (pair[0] === drug2 && pair[1] === drug1)) {
            isCompatible = true;
            break;
        }
    }
    
    if (isCompatible) {
        const result = `${drug1Data.persianName} و ${drug2Data.persianName} سازگار هستند`;
        document.getElementById('compatResult').innerHTML = `
            <span class="persian-text">${result}</span>
        `;
        showToast('موفق', 'داروها سازگار هستند', 'success');
    } else {
        const result = `${drug1Data.persianName} و ${drug2Data.persianName} نیاز به بررسی بیشتر دارند`;
        document.getElementById('compatResult').innerHTML = `
            <span class="persian-text">${result}</span>
        `;
        showToast('هشدار', 'سازگاری نیاز به تأیید دارد', 'warning');
    }
}

// Dose Calculator
function calculateDose() {
    const neededText = document.getElementById('doseNeeded').value;
    const concentrationText = document.getElementById('doseConcentration').value;
    const vialVolumeText = document.getElementById('doseVialVolume').value;
    
    const needed = PersianNumbers.parseNumber(neededText);
    const concentration = PersianNumbers.parseNumber(concentrationText);
    const vialVolume = PersianNumbers.parseNumber(vialVolumeText);
    
    if (!needed || !concentration || !vialVolume || isNaN(needed) || isNaN(concentration) || isNaN(vialVolume)) {
        showToast('خطا', 'لطفاً تمامی مقادیر را وارد کنید', 'error');
        return;
    }
    
    if (concentration === 0) {
        showToast('خطا', 'غلظت نمی‌تواند صفر باشد', 'error');
        return;
    }
    
    const volumeNeeded = needed / concentration;
    const vialsNeeded = Math.ceil(volumeNeeded / vialVolume);
    
    let result = '';
    if (volumeNeeded <= vialVolume) {
        result = `${PersianNumbers.formatNumber(volumeNeeded, 1)} میلی‌لیتر (۱ ویال)`;
    } else {
        result = `${PersianNumbers.formatNumber(volumeNeeded, 1)} میلی‌لیتر (${vialsNeeded} ویال)`;
    }
    
    document.getElementById('doseResult').innerHTML = `
        <span class="latin-inline">${result}</span>
    `;
    showToast('موفق', 'محاسبه دوز انجام شد', 'success');
}

// Initialize compatibility dropdowns
function initCompatibilityDropdowns() {
    const drugSelect1 = document.getElementById('compatDrug1');
    const drugSelect2 = document.getElementById('compatDrug2');
    
    if (!drugSelect1 || !drugSelect2) return;
    
    drugSelect1.innerHTML = '<option value="">انتخاب دارو</option>';
    drugSelect2.innerHTML = '<option value="">انتخاب دارو</option>';
    
    Object.entries(drugDatabase).forEach(([id, drug]) => {
        const option1 = document.createElement('option');
        option1.value = id;
        option1.textContent = `${drug.persianName} (${drug.englishName})`;
        drugSelect1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = id;
        option2.textContent = `${drug.persianName} (${drug.englishName})`;
        drugSelect2.appendChild(option2);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showToast(title, message, type = 'info') {
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="toast-icon ${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function updateStats() {
    // Implementation for updating stats
}

function updateCalculationStats() {
    AppState.calculationsToday++;
}

function saveCalculation(totalDrug, concentration, pumpRate, duration) {
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    
    const calculation = {
        id: Date.now(),
        drug: AppState.selectedDrug,
        drugName: drugDatabase[AppState.selectedDrug].persianName,
        dose: AppState.desiredDose,
        weight: AppState.patientWeight,
        totalDrug: totalDrug,
        concentration: concentration,
        pumpRate: pumpRate,
        duration: duration,
        timestamp: new Date().toISOString()
    };
    
    history.unshift(calculation);
    
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">تاریخچه‌ای یافت نشد</div>';
        return;
    }
    
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-drug">${item.drugName}</div>
            <div class="history-details">
                <div>دوز: ${PersianNumbers.formatNumber(item.dose, 2)}</div>
                <div>سرعت پمپ: ${PersianNumbers.formatNumber(item.pumpRate, 2)} سی‌سی/ساعت</div>
                <div class="history-time">${PersianNumbers.toLatin(new Date(item.timestamp).toLocaleDateString('fa-IR'))}</div>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

// ============================================
// DRUG LIBRARY
// ============================================
function loadDrugLibrary() {
    const container = document.getElementById('drugLibrary');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.values(drugDatabase).forEach(drug => {
        const card = document.createElement('div');
        card.className = 'drug-library-card';
        card.innerHTML = `
            <div class="drug-library-header">
                <div>
                    <div class="drug-library-title persian-text">${drug.persianName}</div>
                    <div class="drug-library-english latin-text">${TextDirection.wrapLatin(drug.englishName)}</div>
                </div>
                <div style="color: ${drug.color}; font-size: 1.5rem;">
                    <i class="${drug.icon}"></i>
                </div>
            </div>
            <div class="drug-library-body">
                <div class="drug-library-info">
                    <div class="drug-library-row">
                        <span class="drug-library-label persian-text">دسته:</span>
                        <span class="drug-library-value latin-text">${drug.category || '--'}</span>
                    </div>
                    <div class="drug-library-row">
                        <span class="drug-library-label persian-text">دوز معمول:</span>
                        <span class="drug-library-value latin-text">${drug.typicalDoseRange ? `${drug.typicalDoseRange.min}-${drug.typicalDoseRange.max} ${drug.typicalDoseRange.unit}` : '--'}</span>
                    </div>
                    <div class="drug-library-row">
                        <span class="drug-library-label persian-text">محلول:</span>
                        <span class="drug-library-value latin-text">${drug.solutionType.join(', ')}</span>
                    </div>
                    <div class="drug-library-row">
                        <span class="drug-library-label persian-text">آمپول معمول:</span>
                        <span class="drug-library-value latin-text">${drug.ampouleOptions[0].label}</span>
                    </div>
                </div>
                <div class="drug-library-actions">
                    <button class="drug-library-btn" onclick="selectDrug('${drug.id}'); switchTab('calculator')">
                        <i class="fas fa-calculator"></i> محاسبه
                    </button>
                    <button class="drug-library-btn secondary expand-btn" data-drug-id="${drug.id}">
                        <i class="fas fa-info-circle"></i> جزئیات
                    </button>
                </div>
                <div class="drug-library-details" id="details-${drug.id}"></div>
            </div>
        `;
        
        container.appendChild(card);
        
        const expandBtn = card.querySelector('.expand-btn');
        expandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDrugDetails(drug.id, card);
        });
    });
}

function toggleDrugDetails(drugId, card) {
    const detailsContainer = card.querySelector('.drug-library-details');
    const expandBtn = card.querySelector('.expand-btn');
    
    if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        detailsContainer.innerHTML = '';
        expandBtn.innerHTML = '<i class="fas fa-info-circle"></i> جزئیات';
        expandBtn.classList.remove('expanded');
        return;
    }
    
    document.querySelectorAll('.drug-library-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            otherCard.querySelector('.drug-library-details').innerHTML = '';
            otherCard.querySelector('.expand-btn').innerHTML = '<i class="fas fa-info-circle"></i> جزئیات';
            otherCard.querySelector('.expand-btn').classList.remove('expanded');
        }
    });
    
    card.classList.add('expanded');
    expandBtn.innerHTML = '<i class="fas fa-times"></i> بستن';
    expandBtn.classList.add('expanded');
    
    loadDrugDetails(drugId, detailsContainer);
}

function loadDrugDetails(drugId, container) {
    const drug = drugDatabase[drugId];
    
    const detailsHTML = `
        <div style="padding: 10px;">
            <h4 style="color: var(--primary); margin-bottom: 15px;">
                <i class="fas fa-info-circle"></i> اطلاعات ${drug.persianName}
            </h4>
            
            <div style="display: grid; gap: 10px;">
                <div>
                    <strong class="persian-text">نام انگلیسی:</strong> 
                    <span class="latin-text">${drug.englishName}</span>
                </div>
                <div>
                    <strong class="persian-text">دسته:</strong> 
                    <span class="latin-text">${drug.category || '--'}</span>
                </div>
                <div>
                    <strong class="persian-text">آمپول معمول:</strong> 
                    <span class="latin-text">${drug.ampouleOptions[0].label}</span>
                </div>
                <div>
                    <strong class="persian-text">دوز معمول:</strong> 
                    <span class="latin-text">${drug.typicalDoseRange ? `${drug.typicalDoseRange.min}-${drug.typicalDoseRange.max} ${drug.typicalDoseRange.unit}` : '--'}</span>
                </div>
                <div>
                    <strong class="persian-text">محلول‌ها:</strong> 
                    <span class="latin-text">${drug.solutionType.join(', ')}</span>
                </div>
            </div>
            
            ${drug.cautions ? `
                <div style="margin-top: 15px; padding: 10px; background: rgba(255, 167, 38, 0.1); border-radius: 8px;">
                    <h5 style="color: var(--warning); margin-bottom: 10px;">
                        <i class="fas fa-exclamation-triangle"></i> نکات ایمنی:
                    </h5>
                    <ul style="padding-right: 20px;">
                        ${drug.cautions.map(caution => `<li class="persian-text">${caution}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <button class="expand-details-btn collapse-btn" style="margin-top: 15px; width: 100%;" 
                    onclick="this.closest('.drug-library-card').classList.remove('expanded');">
                <i class="fas fa-times"></i> بستن جزئیات
            </button>
        </div>
    `;
    
    container.innerHTML = detailsHTML;
}

// ============================================
// MAKE FUNCTIONS AVAILABLE GLOBALLY
// ============================================
window.selectDrug = selectDrug;
window.switchTab = switchTab;
window.showDrugDetails = showDrugDetails;
window.calculateManualInfusion = calculateManualInfusion;
window.convertElectrolyte = convertElectrolyte;
window.convertPercentage = convertPercentage;
window.convertUnits = convertUnits;
window.calculateDripRate = calculateDripRate;
window.calculateBMI = calculateBMI;
window.calculateBSA = calculateBSA;
window.calculateIBW = calculateIBW;
window.calculateCrCl = calculateCrCl;
window.checkCompatibility = checkCompatibility;
window.calculateDose = calculateDose;
window.TextDirection = TextDirection;
window.PersianNumbers = PersianNumbers;