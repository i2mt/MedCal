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
    
    // Quick Actions - WILL BE COMPLETELY REMOVED
    saveCalculation: document.getElementById('saveCalculation'),
    shareCalculation: document.getElementById('shareCalculation'),
    resetCalculator: document.getElementById('resetCalculator'),
    
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
// MOBILE LAYOUT FUNCTIONS - UPDATED
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
        
        console.log('Mobile layout setup complete');
    } else {
        // Reset to desktop layout
        resetDesktopLayout();
    }
}
// Add this new function to fix tab visibility
function fixTabVisibility() {
    // Hide all tab panes first
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.style.display = 'none';
        pane.style.height = '0';
        pane.style.overflow = 'hidden';
    });
    
    // Show active tab pane
    const activePane = document.querySelector('.tab-pane.active');
    if (activePane) {
        activePane.style.display = 'block';
        activePane.style.height = '100%';
        activePane.style.overflow = 'auto';
    }
}

function clearMobileLayoutIssues() {
    // Remove any problematic styles that might cause white screen
    document.body.style.overflow = 'auto';
    document.body.style.position = 'relative';
    document.body.style.height = 'auto';
    
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.height = '100vh';
        appContainer.style.overflow = 'auto';
    }
}

function fixDrugSidebar() {
    const drugSidebar = document.querySelector('.drug-sidebar');
    if (drugSidebar) {
        // Reset any problematic styles
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
    
    // Fix drug grid scroll
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
    // Remove any elements that might be causing the white screen overlay
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
    // Ensure main content is visible
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
    
    // Ensure calculator tab is visible
    const calculatorTab = document.getElementById('calculatorTab');
    if (calculatorTab) {
        calculatorTab.style.cssText = `
            height: 100% !important;
            overflow: hidden !important;
            display: block !important;
            padding: 0 !important;
        `;
    }
    
    // Ensure calculator layout is visible
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
    
    // Ensure calculator main is visible
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
    // Fix method button text color
    const methodButtons = document.querySelectorAll('.method-btn-compact');
    methodButtons.forEach(button => {
        if (button.classList.contains('active')) {
            button.style.color = 'white';
            button.style.fontWeight = '700';
            
            // Also fix the text inside
            const icon = button.querySelector('i');
            const text = button.querySelector('span');
            if (icon) icon.style.color = 'white';
            if (text) text.style.color = 'white';
        }
    });
    
    // Fix volume button text color
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
    
    // Remove existing mobile button if exists
    const existingBtn = document.getElementById('openManualMobile');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Create mobile manual button
    const mobileManualBtn = document.createElement('div');
    mobileManualBtn.id = 'openManualMobile';
    mobileManualBtn.className = 'drug-item-compact';
    mobileManualBtn.innerHTML = `
        <div class="drug-icon-small" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <i class="fas fa-edit" style="color: white; font-size: 16px;"></i>
        </div>
        <div class="drug-name-compact" style="color: white; font-size: 10px; font-weight: 700;">محاسبه دستی</div>
    `;
    
    // Add to drug grid AT THE END
    drugGrid.appendChild(mobileManualBtn);
    
    // Add event listener
    mobileManualBtn.addEventListener('click', openManualCalculation);
    
    // Add touch feedback
    mobileManualBtn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
        this.style.transition = 'transform 0.1s ease';
    });
    
    mobileManualBtn.addEventListener('touchend', function() {
        this.style.transform = '';
    });
}

function setupMobileSearch() {
    // Simple mobile search setup if needed
    const mobileSearchToggle = document.getElementById('mobileSearchToggle');
    const drugSearchContainer = document.querySelector('.drug-search-container');
    
    if (mobileSearchToggle && drugSearchContainer) {
        mobileSearchToggle.addEventListener('click', () => {
            drugSearchContainer.style.display = drugSearchContainer.style.display === 'none' ? 'block' : 'none';
        });
    }
}

function setupTouchFeedback() {
    // Add touch feedback to all buttons
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
    // Remove mobile manual button
    const mobileBtn = document.getElementById('openManualMobile');
    if (mobileBtn) {
        mobileBtn.remove();
    }
    
    // Show desktop manual button
    if (DOM.openManualBtn) {
        DOM.openManualBtn.style.display = 'flex';
    }
}

// ============================================
// INITIALIZATION
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
    
    // Check if mobile and apply fixes immediately
    if (window.innerWidth <= 768) {
        console.log('Mobile detected, applying critical fixes...');
        // Apply critical mobile fixes first
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.background = 'var(--bg-primary)';
        
        // Ensure only calculator tab is visible initially
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
    
    // Re-setup on resize with debounce
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
        DOM.lastUpdate.textContent = persianDate;
    }
    
    // Initialize manual calculation
    setupManualCalculation();
    
    // Test all fixes
    setTimeout(testAllFixes, 1000);
}

function setupMobileOptimizations() {
    if (window.innerWidth <= 768) {
        console.log('Applying mobile optimizations...');
        
        // Prevent zoom on input focus
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                document.body.style.zoom = "100%";
            }
        }, { passive: true });
        
        // Handle virtual keyboard
        window.addEventListener('resize', function() {
            if (window.innerHeight < window.outerHeight * 0.7) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        });
        
        // Fix for iOS 100vh issue
        function setVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setVH();
        window.addEventListener('resize', setVH);
        
        // Improve touch scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Fix for mobile drug grid scroll
        const drugScroll = document.querySelector('.drug-scroll-container');
        if (drugScroll) {
            drugScroll.addEventListener('touchmove', function(e) {
                e.stopPropagation();
            }, { passive: true });
        }
    }
}

// ============================================
// TEST ALL FIXES
// ============================================
function testAllFixes() {
    console.log('Testing all fixes...');
    
    // Test 1: Quick actions removed
    const quickActions = document.querySelectorAll('.quick-actions-enhanced, .action-btn-enhanced');
    console.log(`Quick actions found: ${quickActions.length} (should be 0 or hidden)`);
    
    // Test 2: Manual button exists in mobile
    if (window.innerWidth <= 768) {
        const manualBtn = document.getElementById('openManualMobile');
        console.log(`Mobile manual button exists: ${!!manualBtn}`);
        if (manualBtn) {
            console.log(`Manual button size: ${manualBtn.offsetWidth}x${manualBtn.offsetHeight} (should be ~75x75)`);
        }
    }
    
    // Test 3: Active method button text color
    const activeMethodBtn = document.querySelector('.method-btn-compact.active');
    if (activeMethodBtn) {
        const computedColor = window.getComputedStyle(activeMethodBtn).color;
        console.log(`Active method button text color: ${computedColor} (should be white or rgb(255, 255, 255))`);
        
        // Also test the text inside
        const textSpan = activeMethodBtn.querySelector('span');
        if (textSpan) {
            const textColor = window.getComputedStyle(textSpan).color;
            console.log(`Active method button span text color: ${textColor} (should be white)`);
        }
    }
    
    // Test 4: Active volume button text color
    const activeVolumeBtn = document.querySelector('.volume-preset-btn.active');
    if (activeVolumeBtn) {
        const computedColor = window.getComputedStyle(activeVolumeBtn).color;
        console.log(`Active volume button text color: ${computedColor} (should be white or rgb(255, 255, 255))`);
    }
    
    // Test 5: Drug sidebar height
    const drugSidebar = document.querySelector('.drug-sidebar');
    if (drugSidebar && window.innerWidth <= 768) {
        console.log(`Drug sidebar height: ${drugSidebar.offsetHeight}px (should be 120px)`);
    }
    
    // Test 6: Content visibility
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        console.log(`Main content visible: ${mainContent.offsetHeight > 0}`);
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
    
    // Update toggle switches
    if (DOM.darkModeToggle) DOM.darkModeToggle.checked = AppState.settings.darkMode;
    if (DOM.largeFontToggle) DOM.largeFontToggle.checked = AppState.settings.largeFont;
    if (DOM.doseAlertToggle) DOM.doseAlertToggle.checked = AppState.settings.doseAlerts;
    if (DOM.compatAlertToggle) DOM.compatAlertToggle.checked = AppState.settings.compatAlerts;
    if (DOM.saveHistoryToggle) DOM.saveHistoryToggle.checked = AppState.settings.saveHistory;
    
    // Apply the settings
    applySettings();
}

function saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(AppState.settings));
    showToast('ذخیره شد', 'تنظیمات با موفقیت ذخیره شدند', 'success');
}

function applySettings() {
    // Apply dark mode
    if (AppState.settings.darkMode) {
        document.body.classList.add('dark-mode');
        AppState.theme = 'dark';
    } else {
        document.body.classList.remove('dark-mode');
        AppState.theme = 'light';
    }
    
    // Apply large font
    if (AppState.settings.largeFont) {
        document.body.classList.add('large-font');
    } else {
        document.body.classList.remove('large-font');
    }
    
    // Update theme toggle icon
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
            <div class="drug-name-english">${drug.englishName}</div>
        `;
        
        card.addEventListener('click', () => selectDrug(id));
        container.appendChild(card);
    });
    
    console.log('Drug grid loaded with', Object.keys(drugDatabase).length, 'drugs');
    
    // Setup mobile layout if needed
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
    
    // Update UI
    DOM.selectedDrugName.textContent = drug.persianName;
    DOM.selectedDrugDesc.innerHTML = `
        <span class="text-latin">${drug.englishName}</span>
        <span class="text-mixed"> - </span>
        <span class="text-latin">${drug.category}</span>
    `;
    DOM.selectedDrugIcon.innerHTML = `<i class="${drug.icon}"></i>`;
    DOM.selectedDrugIcon.style.background = `linear-gradient(135deg, ${drug.color}, ${drug.color}99)`;
    
    // Update ampoule type selector
    updateAmpouleTypeSelector(drug);
    
    // Update ampoule info
    updateAmpouleInfo();
    
    // Update volume options
    updateVolumeOptions();
    
    // FIX: Properly handle weight toggle for weight-based drugs
    if (DOM.weightContainer && DOM.weightCheckbox && DOM.patientWeight) {
        if (drug.weightBased && drug.weightBased.active) {
            // Show weight container
            DOM.weightContainer.style.display = 'flex';
            
            // Set initial state based on drug configuration
            const defaultUseWeight = drug.weightBased.defaultUseWeight !== undefined ? 
                drug.weightBased.defaultUseWeight : false;
            
            AppState.useWeight = defaultUseWeight;
            DOM.weightCheckbox.checked = defaultUseWeight;
            DOM.patientWeight.disabled = !defaultUseWeight;
            
            // Set default weight value
            DOM.patientWeight.value = drug.weightBased.defaultWeight || '70';
            DOM.patientWeight.placeholder = 'کیلوگرم';
            
            // Update unit based on initial state
            updateWeightBasedUnit(drug);
        } else {
            // Hide weight container for non-weight-based drugs
            DOM.weightContainer.style.display = 'none';
            AppState.useWeight = false;
            DOM.weightCheckbox.checked = false;
            DOM.patientWeight.disabled = true;
            DOM.patientWeight.value = '';
            
            // Set standard unit for non-weight-based drugs
            const unitElement = document.getElementById('orderUnit');
            if (unitElement) {
                unitElement.textContent = drug.standardUnit;
            }
        }
    }
    
    // Update selected card style
    document.querySelectorAll('.drug-item-compact').forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = document.querySelector(`.drug-item-compact[data-drug-id="${drugId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Clear and hide results
    clearResults();
    
    // Clear desired dose input
    if (DOM.doctorOrder) DOM.doctorOrder.value = '';
    
    // Hide custom volume
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
            // Remove active class from all buttons
            container.querySelectorAll('.ampoule-type-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update state
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
        DOM.ampouleInfo.innerHTML = `
            <span class="text-mixed">هر آمپول:</span>
            <span class="text-latin">${ampoule.label}</span>
        `;
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
    
    // Add custom button
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
// CALCULATION FUNCTIONS
// ============================================
function calculateInfusion() {
    const drug = drugDatabase[AppState.selectedDrug];
    const ampoule = drug.ampouleOptions[AppState.currentAmpouleIndex];
    
    // Validate desired dose
    const doseValue = parseFloat(DOM.doctorOrder.value);
    if (!doseValue || isNaN(doseValue) || doseValue <= 0) {
        showToast('خطا', 'لطفاً مقدار دوز درخواستی را وارد کنید', 'error');
        DOM.doctorOrder.focus();
        return;
    }
    
    // Handle weight-based vs non-weight-based calculation
    let desiredDosePerHour;
    
    if (drug.weightBased && drug.weightBased.active && AppState.useWeight) {
        // Weight-based calculation
        const weightValue = parseFloat(DOM.patientWeight.value);
        if (!weightValue || isNaN(weightValue) || weightValue <= 0) {
            showToast('خطا', 'لطفاً وزن بیمار را وارد کنید', 'error');
            DOM.patientWeight.focus();
            return;
        }
        AppState.patientWeight = weightValue;
        
        // Calculate dose per hour based on drug
        switch(drug.id) {
            case 'dopamine':
            case 'norepinephrine':
                // Convert mcg/kg/min to mcg/hour
                desiredDosePerHour = doseValue * AppState.patientWeight * 60;
                break;
            case 'fentanyl':
                // mcg/kg/hour to mcg/hour
                desiredDosePerHour = doseValue * AppState.patientWeight;
                break;
            case 'midazolam':
                // mcg/kg/min to mg/hour
                desiredDosePerHour = (doseValue * AppState.patientWeight * 60) / 1000;
                break;
            case 'heparin':
            case 'insulin':
                // units/kg/hour to units/hour
                desiredDosePerHour = doseValue * AppState.patientWeight;
                break;
            default:
                // Default weight-based calculation
                desiredDosePerHour = doseValue * AppState.patientWeight;
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
        const customVol = parseFloat(DOM.customVolume.value);
        if (!customVol || isNaN(customVol) || customVol <= 0) {
            showToast('خطا', 'لطفاً حجم محلول را وارد کنید', 'error');
            return;
        }
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
        
        // For non-weight-based dopamine/norepinephrine, dose is already in mcg/hour
        // For weight-based, we already converted to mcg/hour above
        // No further conversion needed
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
    
    // Update DOM
    DOM.totalDrugAmount.textContent = format(totalDrug);
    DOM.totalDrugUnit.textContent = unit;
    
    // Format concentration appropriately based on drug
    let concentrationDisplay, concentrationUnitDisplay;
    
    if (drug.id === 'norepinephrine' || drug.id === 'dopamine' || drug.id === 'fentanyl' || drug.id === 'tng') {
        // These drugs are typically in mcg, convert if needed
        if (unit === 'mg') {
            concentrationDisplay = (concentration * 1000).toFixed(2);
            concentrationUnitDisplay = 'mcg/cc';
        } else {
            concentrationDisplay = format(concentration);
            concentrationUnitDisplay = `${unit}/cc`;
        }
    } else {
        concentrationDisplay = format(concentration);
        concentrationUnitDisplay = `${unit}/cc`;
    }
    
    DOM.concentrationResult.textContent = concentrationDisplay;
    DOM.concentrationUnit.textContent = concentrationUnitDisplay;
    
    DOM.pumpRateResult.textContent = format(pumpRate);
    DOM.pumpRateUnit.textContent = 'cc/hour';
    
    DOM.durationResult.textContent = format(duration);
    DOM.durationUnit.textContent = 'ساعت';
    
    // Show results
    if (DOM.resultsSection) {
        DOM.resultsSection.classList.add('show');
        DOM.resultsSection.style.display = 'block';
        
        // Scroll to results
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
        `3. اضافه کردن ${totalDrug} ${drug.ampouleOptions[0].unit} از دارو به محلول`,
        `4. مخلوط کردن کامل محلول`,
        `5. نصب سرنگ/کیسه بر روی پمپ ${AppState.infusionMethod === 'syringe' ? 'سرنگ' : 'انفوزیون'}د`,
        `6. تنظیم سرعت پمپ بر روی ${pumpRate.toFixed(2)} cc/hour`,
        `7. شروع تزریق با دوز ${desiredDose.toFixed(2)} ${drug.standardUnit}`
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
            DOM.compatibleDrugsList.appendChild(item);
        });
        
        drug.ySiteCompatibilities.incompatible.forEach(drugName => {
            const item = document.createElement('div');
            item.textContent = drugName;
            DOM.incompatibleDrugsList.appendChild(item);
        });
    }
    
    DOM.compatibilitySection.style.display = 'block';
}

// ============================================
// WEIGHT-BASED UNIT MANAGEMENT
// ============================================
function updateWeightBasedUnit(drug) {
    const unitElement = document.getElementById('orderUnit');
    if (!unitElement || !drug.weightBased) return;
    
    if (AppState.useWeight) {
        // Show weight-based unit (e.g., mcg/kg/min)
        unitElement.textContent = drug.weightBased.unit;
    } else {
        // Show non-weight-based unit (e.g., mcg/min)
        unitElement.textContent = drug.weightBased.nonWeightUnit || drug.standardUnit;
    }
    
    // Clear results when unit changes
    clearResults();
}

// ============================================
// EVENT HANDLERS
// ============================================
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Theme toggle
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // History button
    if (DOM.historyBtn) {
        DOM.historyBtn.addEventListener('click', () => {
            loadHistory();
            if (DOM.historyModal) {
                DOM.historyModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    }
    
    // Settings button
    if (DOM.settingsBtn) {
        DOM.settingsBtn.addEventListener('click', () => {
            if (DOM.settingsModal) {
                DOM.settingsModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    }
    
    // Tab navigation
    if (DOM.tabItems) {
        DOM.tabItems.forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                switchTab(tab);
            });
        });
    }
    
    // Method selection
    if (DOM.methodBtns) {
        DOM.methodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                DOM.methodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                AppState.infusionMethod = this.dataset.method;
                
                // Fix text color
                fixMethodButtonTextColor();
                
                updateVolumeOptions();
                clearResults();
            });
        });
    }
    
    // Ampoule controls
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
    
    // Weight toggle
    if (DOM.weightCheckbox && DOM.patientWeight) {
        DOM.weightCheckbox.addEventListener('change', function() {
            console.log('Weight checkbox changed to:', this.checked);
            AppState.useWeight = this.checked;
            DOM.patientWeight.disabled = !this.checked;
            
            // Update the unit display based on weight toggle state
            const drug = drugDatabase[AppState.selectedDrug];
            updateWeightBasedUnit(drug);
            
            // Focus weight input if enabled
            if (this.checked && DOM.patientWeight) {
                DOM.patientWeight.focus();
            }
            
            // Clear results
            clearResults();
            
            // Show feedback
            if (this.checked) {
                showToast('اطلاع', 'محاسبه بر اساس وزن فعال شد', 'info');
            }
        });
    }
    
    // Custom volume
    if (DOM.customVolume) {
        DOM.customVolume.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value > 0) {
                AppState.solutionVolume = value;
                AppState.customVolume = true;
                clearResults();
            }
        });
    }
    
    // Calculate button
    if (DOM.calculateBtn) {
        DOM.calculateBtn.addEventListener('click', calculateInfusion);
    }
    
    // Desired dose input
    if (DOM.doctorOrder) {
        DOM.doctorOrder.addEventListener('input', () => {
            clearResults();
        });
        
        // Enter key for calculation
        DOM.doctorOrder.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateInfusion();
            }
        });
    }
    
    // Quick Actions - COMPLETELY REMOVED
    // These are not used anymore
    
    // Modal close buttons
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
    
    // Drug search
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
    
    // Drug library search
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
    
    // Settings event listeners
    setupSettingsEventListeners();
    
    // Window resize for responsive layout
    window.addEventListener('resize', () => {
        setupMobileLayout();
    });
    
    console.log('Event listeners setup complete');
}

// ============================================
// SETTINGS EVENT LISTENERS
// ============================================
function setupSettingsEventListeners() {
    // Dark Mode Toggle
    if (DOM.darkModeToggle) {
        DOM.darkModeToggle.addEventListener('change', function() {
            AppState.settings.darkMode = this.checked;
            saveSettings();
            applySettings();
        });
    }
    
    // Large Font Toggle
    if (DOM.largeFontToggle) {
        DOM.largeFontToggle.addEventListener('change', function() {
            AppState.settings.largeFont = this.checked;
            saveSettings();
            applySettings();
        });
    }
    
    // Dose Alert Toggle
    if (DOM.doseAlertToggle) {
        DOM.doseAlertToggle.addEventListener('change', function() {
            AppState.settings.doseAlerts = this.checked;
            saveSettings();
        });
    }
    
    // Compatibility Alert Toggle
    if (DOM.compatAlertToggle) {
        DOM.compatAlertToggle.addEventListener('change', function() {
            AppState.settings.compatAlerts = this.checked;
            saveSettings();
        });
    }
    
    // Save History Toggle
    if (DOM.saveHistoryToggle) {
        DOM.saveHistoryToggle.addEventListener('change', function() {
            AppState.settings.saveHistory = this.checked;
            saveSettings();
        });
    }
    
    // Clear History Button
    if (DOM.clearHistoryBtn) {
        DOM.clearHistoryBtn.addEventListener('click', function() {
            if (confirm('آیا از پاک کردن تاریخچه اطمینان دارید؟')) {
                localStorage.removeItem('calculationHistory');
                showToast('تاریخچه پاک شد', 'تمامی محاسبات ذخیره شده حذف شدند.', 'success');
            }
        });
    }
    
    // Export Data Button
    if (DOM.exportDataBtn) {
        DOM.exportDataBtn.addEventListener('click', function() {
            showToast('اطلاع', 'این ویژگی در نسخه بعدی اضافه خواهد شد', 'info');
        });
    }
    
    // Check Update Button
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
        // Hide calculator controls and selected drug header
        if (calculatorControls) calculatorControls.style.display = 'none';
        if (selectedDrugHeader) selectedDrugHeader.style.display = 'none';
        
        // Show manual section
        if (manualSection) {
            manualSection.style.display = 'flex';
            manualSection.style.flexDirection = 'column';
            manualSection.style.height = '100%';
            
            // Create manual calculation content if not exists
            if (!manualSection.querySelector('.manual-controls')) {
                createManualCalculationContent();
            }
        }
        
        // Hide any visible result sections
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
        
        // Hide drug sidebar on mobile
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
                <input type="text" id="manualDrugName" placeholder="نام دارو را وارد کنید">
            </div>
            
            <div class="control-group">
                <label><i class="fas fa-infinity"></i> روش تزریق</label>
                <div class="method-selector-compact">
                    <button class="method-btn-compact gradient active" data-method="syringe">
                        <i class="fas fa-syringe"></i> پمپ سرنگ
                    </button>
                    <button class="method-btn-compact gradient" data-method="infusion">
                        <i class="fas fa-pump-medical"></i> پمپ انفوزیون
                    </button>
                </div>
            </div>
            
            <div class="manual-inputs-grid">
                <div class="control-group">
                    <label><i class="fas fa-vial"></i> قدرت آمپول</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualStrength" placeholder="0" step="0.01" min="0.01" value="5000">
                        <select id="manualStrengthUnit">
                            <option value="units">units</option>
                            <option value="mg">mg</option>
                            <option value="mcg">mcg</option>
                            <option value="g">گرم</option>
                        </select>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-vial"></i> حجم آمپول</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualVialVolume" placeholder="0" step="0.1" min="0.1" value="1">
                        <span class="unit">ml</span>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-syringe"></i> تعداد آمپول</label>
                    <div class="ampoule-control-enhanced">
                        <button class="ampoule-btn-enhanced gradient" id="manualDecreaseAmpoule">
                            <i class="fas fa-minus"></i>
                        </button>
                        <div class="ampoule-count-enhanced">
                            <span id="manualAmpouleCount">1</span>
                            <small>عدد</small>
                        </div>
                        <button class="ampoule-btn-enhanced gradient" id="manualIncreaseAmpoule">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-flask"></i> حجم محلول</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualSolutionVolume" placeholder="0" step="1" min="1" value="50">
                        <span class="unit">cc</span>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-file-medical-alt"></i> دوز درخواستی</label>
                    <div class="dose-input-enhanced">
                        <div class="dose-input-wrapper">
                            <input type="number" id="manualDesiredDose" placeholder="0" step="0.01" min="0.01" value="1000">
                            <select class="dose-unit-enhanced" id="manualDoseUnit">
                                <option value="units/hour">units/hour</option>
                                <option value="mg/hour">mg/ساعت</option>
                                <option value="mcg/hour">mcg/ساعت</option>
                                <option value="mg/min">mg/دقیقه</option>
                                <option value="mcg/min">mcg/دقیقه</option>
                                <option value="mcg/kg/min">mcg/کیلوگرم/دقیقه</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label><i class="fas fa-weight-scale"></i> وزن بیمار (اختیاری)</label>
                    <div class="manual-input-with-unit">
                        <input type="number" id="manualPatientWeight" placeholder="0" step="0.1" min="1" value="70">
                        <span class="unit">کیلوگرم</span>
                    </div>
                </div>
            </div>
            
            <button class="calculate-btn-enhanced gradient" id="manualCalculateBtn">
                <i class="fas fa-calculator"></i>
                <span>محاسبه سرعت پمپ</span>
            </button>
        </div>
    `;
    
    // Re-attach event listeners after creating content
    setupManualControls();
}

function setupManualControls() {
    // Close manual button in header
    const closeManualBtn = document.getElementById('closeManualBtn');
    const manualSection = document.getElementById('manualSection');
    const calculatorControls = document.getElementById('calculatorControls');
    const selectedDrugHeader = document.querySelector('.selected-drug-compact');
    const drugSidebar = document.querySelector('.drug-sidebar');
    
    const closeManualHandler = () => {
        // Show calculator controls and selected drug header
        if (calculatorControls) calculatorControls.style.display = 'grid';
        if (selectedDrugHeader) selectedDrugHeader.style.display = 'flex';
        
        // Hide manual section
        if (manualSection) {
            manualSection.style.display = 'none';
        }
        
        // Show drug sidebar on mobile
        if (drugSidebar && window.innerWidth < 768) {
            drugSidebar.style.display = 'flex';
        }
        
        // Clear any manual calculation results
        clearResults();
    };
    
    if (closeManualBtn) {
        closeManualBtn.addEventListener('click', closeManualHandler);
    }
    
    // Manual ampoule controls
    const manualDecreaseBtn = document.getElementById('manualDecreaseAmpoule');
    const manualIncreaseBtn = document.getElementById('manualIncreaseAmpoule');
    const manualAmpouleCount = document.getElementById('manualAmpouleCount');
    
    if (manualDecreaseBtn && manualIncreaseBtn && manualAmpouleCount) {
        let manualAmpCount = 1;
        
        manualDecreaseBtn.addEventListener('click', () => {
            if (manualAmpCount > 1) {
                manualAmpCount--;
                manualAmpouleCount.textContent = manualAmpCount;
            }
        });
        
        manualIncreaseBtn.addEventListener('click', () => {
            if (manualAmpCount < 20) {
                manualAmpCount++;
                manualAmpouleCount.textContent = manualAmpCount;
            }
        });
    }
    
    // Method buttons in manual section
    const manualMethodBtns = document.querySelectorAll('#manualSection .method-btn-compact');
    if (manualMethodBtns) {
        manualMethodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                manualMethodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                AppState.infusionMethod = this.dataset.method;
                
                // Fix text color
                fixMethodButtonTextColor();
            });
        });
    }
    
    // Manual calculation button
    const manualCalculateBtn = document.getElementById('manualCalculateBtn');
    if (manualCalculateBtn) {
        manualCalculateBtn.addEventListener('click', calculateManualInfusion);
    }
}

function resetManualCalculator() {
    // Reset all manual inputs to defaults
    const manualStrength = document.getElementById('manualStrength');
    const manualStrengthUnit = document.getElementById('manualStrengthUnit');
    const manualVialVolume = document.getElementById('manualVialVolume');
    const manualAmpouleCount = document.getElementById('manualAmpouleCount');
    const manualSolutionVolume = document.getElementById('manualSolutionVolume');
    const manualDesiredDose = document.getElementById('manualDesiredDose');
    const manualDoseUnit = document.getElementById('manualDoseUnit');
    const manualPatientWeight = document.getElementById('manualPatientWeight');
    const manualDrugName = document.getElementById('manualDrugName');
    
    if (manualStrength) manualStrength.value = '5000';
    if (manualStrengthUnit) manualStrengthUnit.value = 'units';
    if (manualVialVolume) manualVialVolume.value = '1';
    if (manualAmpouleCount) manualAmpouleCount.textContent = '1';
    if (manualSolutionVolume) manualSolutionVolume.value = '50';
    if (manualDesiredDose) manualDesiredDose.value = '1000';
    if (manualDoseUnit) manualDoseUnit.value = 'units/hour';
    if (manualPatientWeight) manualPatientWeight.value = '70';
    if (manualDrugName) manualDrugName.value = '';
    
    // Reset method to syringe
    const manualMethodBtns = document.querySelectorAll('#manualSection .method-btn-compact');
    if (manualMethodBtns) {
        manualMethodBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.method === 'syringe') {
                btn.classList.add('active');
                AppState.infusionMethod = 'syringe';
            }
        });
    }
    
    // Clear results
    clearResults();
    
    showToast('اطلاع', 'ماشین حساب دستی ریست شد', 'info');
}

function calculateManualInfusion() {
    // Get manual input values
    const strength = parseFloat(document.getElementById('manualStrength').value);
    const strengthUnit = document.getElementById('manualStrengthUnit').value;
    const vialVolume = parseFloat(document.getElementById('manualVialVolume').value);
    const ampouleCount = parseInt(document.getElementById('manualAmpouleCount').textContent);
    const solutionVolume = parseFloat(document.getElementById('manualSolutionVolume').value);
    const desiredDose = parseFloat(document.getElementById('manualDesiredDose').value);
    const doseUnit = document.getElementById('manualDoseUnit').value;
    const patientWeight = parseFloat(document.getElementById('manualPatientWeight').value) || 0;
    
    // Validation
    if (!strength || !solutionVolume || !desiredDose) {
        showToast('خطا', 'لطفاً تمامی فیلدهای ضروری را پر کنید', 'error');
        return;
    }
    
    // Calculate total drug amount
    let totalDrug = ampouleCount * strength;
    
    // Calculate concentration
    const concentration = totalDrug / solutionVolume;
    
    // Calculate pump rate based on dose unit
    let pumpRate;
    let desiredDoseValue = desiredDose;
    
    // Adjust for weight if weight-based dose
    if (doseUnit === 'mcg/kg/min' && patientWeight > 0) {
        desiredDoseValue = desiredDose * patientWeight; // Convert to mcg/min
        pumpRate = (desiredDoseValue * 60) / concentration; // Convert to per hour
    } else if (doseUnit.includes('/min')) {
        // Convert from per minute to per hour
        pumpRate = (desiredDoseValue * 60) / concentration;
    } else {
        // Already per hour
        pumpRate = desiredDoseValue / concentration;
    }
    
    // Calculate duration
    const duration = solutionVolume / pumpRate;
    
    // Display results using the same function
    displayResults(totalDrug, concentration, pumpRate, duration, strengthUnit);
    
    // Generate guide
    const drugName = document.getElementById('manualDrugName').value || 'داروی دستی';
    generateManualStepByStepGuide(drugName, totalDrug, concentration, pumpRate, desiredDoseValue, strengthUnit, doseUnit);
    
    showToast('موفق', 'محاسبه دستی با موفقیت انجام شد', 'success');
}

function generateManualStepByStepGuide(drugName, totalDrug, concentration, pumpRate, desiredDose, unit, doseUnit) {
    if (!DOM.guideSection || !DOM.stepByStepGuide) return;
    
    DOM.stepByStepGuide.innerHTML = '';
    
    const steps = [
        `1. آماده کردن آمپول‌های ${drugName}`,
        `2. کشیدن ${AppState.solutionVolume} cc محلول به سرنگ/کیسه`,
        `3. اضافه کردن ${totalDrug} ${unit} از دارو به محلول`,
        `4. مخلوط کردن کامل محلول`,
        `5. نصب سرنگ/کیسه بر روی پمپ ${AppState.infusionMethod === 'syringe' ? 'سرنگ' : 'انفوزیون'}د`,
        `6. تنظیم سرعت پمپ بر روی ${pumpRate.toFixed(2)} cc/hour`,
        `7. شروع تزریق با دوز ${desiredDose.toFixed(2)} ${doseUnit}`
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

// ============================================
// QUICK ACTIONS - COMPLETELY REMOVED
// ============================================
function resetCalculator() {
    if (confirm('آیا می‌خواهید ماشین حساب را ریست کنید؟')) {
        const drug = drugDatabase[AppState.selectedDrug];
        AppState.ampouleCount = drug.defaultAmpoules;
        AppState.desiredDose = '';
        AppState.patientWeight = '';
        AppState.useWeight = false;
        AppState.customVolume = false;
        AppState.currentAmpouleIndex = 0;
        
        if (DOM.doctorOrder) DOM.doctorOrder.value = '';
        if (DOM.patientWeight) DOM.patientWeight.value = '';
        if (DOM.weightCheckbox) DOM.weightCheckbox.checked = false;
        if (DOM.patientWeight) DOM.patientWeight.disabled = true;
        if (DOM.customVolumeContainer) {
            DOM.customVolumeContainer.style.display = 'none';
            DOM.customVolume.value = '';
        }
        
        // Update ampoule type buttons
        updateAmpouleTypeSelector(drug);
        updateAmpouleInfo();
        clearResults();
        
        showToast('اطلاع', 'ماشین حساب ریست شد', 'info');
    }
}

function saveCurrentCalculation() {
    showToast('اطلاع', 'این ویژگی در نسخه بعدی اضافه خواهد شد', 'info');
}

function shareCurrentCalculation() {
    showToast('اطلاع', 'این ویژگی در نسخه بعدی اضافه خواهد شد', 'info');
}

// ============================================
// TAB MANAGEMENT
// ============================================
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    DOM.tabItems.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show selected tab pane
    DOM.tabPanes.forEach(pane => {
        if (pane.id === tabName + 'Tab') {
            pane.classList.add('active');
            pane.style.display = 'block';
        } else {
            pane.classList.remove('active');
            pane.style.display = 'none';
        }
    });
    
    // Update state
    AppState.currentTab = tabName;
    
    // Fix tab visibility on mobile
    if (window.innerWidth <= 768) {
        fixTabVisibility();
    }
    
    // Load content for specific tabs
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
    
    // Update settings
    AppState.settings.darkMode = AppState.theme === 'dark';
    saveSettings();
    
    const icon = DOM.themeToggle.querySelector('i');
    if (icon) {
        icon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Save to localStorage
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
// UTILITY FUNCTIONS
// ============================================
function showToast(title, message, type = 'info') {
    // Remove existing toasts
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
    
    // Add event listener to close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
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
    // Implementation for saving calculations to history
}

function loadHistory() {
    // Implementation for loading history
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
                    <div class="drug-library-title">${drug.persianName}</div>
                    <div class="drug-library-english">${drug.englishName}</div>
                </div>
                <div style="color: ${drug.color}; font-size: 1.5rem;">
                    <i class="${drug.icon}"></i>
                </div>
            </div>
            <div class="drug-library-body">
                <div class="drug-library-info">
                    <div class="drug-library-row">
                        <span class="drug-library-label">دسته:</span>
                        <span class="drug-library-value">${drug.category || '--'}</span>
                    </div>
                    <div class="drug-library-row">
                        <span class="drug-library-label">دوز معمول:</span>
                        <span class="drug-library-value">${drug.typicalDoseRange ? `${drug.typicalDoseRange.min}-${drug.typicalDoseRange.max} ${drug.typicalDoseRange.unit}` : '--'}</span>
                    </div>
                    <div class="drug-library-row">
                        <span class="drug-library-label">محلول:</span>
                        <span class="drug-library-value">${drug.solutionType.join(', ')}</span>
                    </div>
                    <div class="drug-library-row">
                        <span class="drug-library-label">آمپول معمول:</span>
                        <span class="drug-library-value">${drug.ampouleOptions[0].label}</span>
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
                <div class="drug-library-details" id="details-${drug.id}">
                    <!-- Details will be loaded here -->
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Add event listener for expand button
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
    
    // If already expanded, collapse
    if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        detailsContainer.innerHTML = '';
        expandBtn.innerHTML = '<i class="fas fa-info-circle"></i> جزئیات';
        expandBtn.classList.remove('expanded');
        return;
    }
    
    // Collapse all other cards
    document.querySelectorAll('.drug-library-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            otherCard.querySelector('.drug-library-details').innerHTML = '';
            otherCard.querySelector('.expand-btn').innerHTML = '<i class="fas fa-info-circle"></i> جزئیات';
            otherCard.querySelector('.expand-btn').classList.remove('expanded');
        }
    });
    
    // Expand this card
    card.classList.add('expanded');
    expandBtn.innerHTML = '<i class="fas fa-times"></i> بستن';
    expandBtn.classList.add('expanded');
    
    // Load details immediately on first click
    loadDrugDetails(drugId, detailsContainer);
}

function loadDrugDetails(drugId, container) {
    const drug = drugDatabase[drugId];
    
    // Create a simple details view first
    const detailsHTML = `
        <div style="padding: 10px;">
            <h4 style="color: var(--primary); margin-bottom: 15px;">
                <i class="fas fa-info-circle"></i> اطلاعات ${drug.persianName}
            </h4>
            
            <div style="display: grid; gap: 10px;">
                <div>
                    <strong>نام انگلیسی:</strong> ${drug.englishName}
                </div>
                <div>
                    <strong>دسته:</strong> ${drug.category || '--'}
                </div>
                <div>
                    <strong>آمپول معمول:</strong> ${drug.ampouleOptions[0].label}
                </div>
                <div>
                    <strong>دوز معمول:</strong> 
                    ${drug.typicalDoseRange ? `${drug.typicalDoseRange.min}-${drug.typicalDoseRange.max} ${drug.typicalDoseRange.unit}` : '--'}
                </div>
                <div>
                    <strong>محلول‌ها:</strong> ${drug.solutionType.join(', ')}
                </div>
            </div>
            
            ${drug.cautions ? `
                <div style="margin-top: 15px; padding: 10px; background: rgba(255, 167, 38, 0.1); border-radius: 8px;">
                    <h5 style="color: var(--warning); margin-bottom: 10px;">
                        <i class="fas fa-exclamation-triangle"></i> نکات ایمنی:
                    </h5>
                    <ul style="padding-right: 20px;">
                        ${drug.cautions.map(caution => `<li>${caution}</li>`).join('')}
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

function showDrugDetails(drugId) {
    const drug = drugDatabase[drugId];
    
    const details = `
        <strong>نام فارسی:</strong> ${drug.persianName}<br>
        <strong>نام انگلیسی:</strong> ${drug.englishName}<br>
        <strong>نام‌های دیگر:</strong> ${drug.alternativeNames ? drug.alternativeNames.join(', ') : '--'}<br>
        <strong>دسته:</strong> ${drug.category || '--'}<br>
        <strong>واحد استاندارد:</strong> ${drug.standardUnit}<br>
        <strong>دوز معمول:</strong> ${drug.typicalDoseRange ? `${drug.typicalDoseRange.min}-${drug.typicalDoseRange.max} ${drug.typicalDoseRange.unit}` : '--'}<br>
        <strong>محلول‌های سازگار:</strong> ${drug.solutionType.join(', ')}<br>
        <strong>آمپول معمول:</strong> ${drug.ampouleOptions[0].label}<br>
        <strong>حجم‌های پیش‌فرض:</strong> <br>
        - پمپ سرنگ: ${drug.defaultSolutionVolumes.syringe.join(', ')} cc<br>
        - پمپ انفوزیون: ${drug.defaultSolutionVolumes.infusion.join(', ')} cc<br>
        <strong>سازگار با:</strong> ${drug.ySiteCompatibilities ? drug.ySiteCompatibilities.compatible.join(', ') : '--'}<br>
        <strong>ناسازگار با:</strong> ${drug.ySiteCompatibilities ? drug.ySiteCompatibilities.incompatible.join(', ') : '--'}<br>
        <strong>نکات ایمنی:</strong><br>
        ${drug.cautions ? drug.cautions.map(c => `• ${c}`).join('<br>') : '--'}
    `;
    
    alert(details);
}

function initCompatibilityDropdowns() {
    const drugSelect1 = document.getElementById('compatDrug1');
    const drugSelect2 = document.getElementById('compatDrug2');
    
    if (!drugSelect1 || !drugSelect2) return;
    
    // Clear existing options
    drugSelect1.innerHTML = '<option value="">انتخاب دارو</option>';
    drugSelect2.innerHTML = '<option value="">انتخاب دارو</option>';
    
    // Add drugs to both dropdowns
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
// MAKE FUNCTIONS AVAILABLE GLOBALLY
// ============================================
window.selectDrug = selectDrug;
window.switchTab = switchTab;
window.showDrugDetails = showDrugDetails;
window.calculateManualInfusion = calculateManualInfusion;