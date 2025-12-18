/* ============================================
   SIEM Mastery Guide - Main JavaScript
   Navigation, Search, and Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initSearch();
    initCodeCopy();
    initNavSections();
    initScrollSpy();
    initKeyboardShortcuts();
});

/* ============================================
   Sidebar Toggle (Mobile)
   ============================================ */

function initSidebar() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (!toggle || !sidebar) return;
    
    function openSidebar() {
        sidebar.classList.add('open');
        toggle.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebar() {
        sidebar.classList.remove('open');
        toggle.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    toggle.addEventListener('click', function() {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
    
    // Close when clicking a nav link on mobile
    const navLinks = sidebar.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });
}

/* ============================================
   Search Functionality
   ============================================ */

function initSearch() {
    const searchInput = document.querySelector('.sidebar-search input');
    if (!searchInput) return;
    
    // Search data - will be populated from navigation
    const searchIndex = buildSearchIndex();
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            clearSearchResults();
            return;
        }
        
        const results = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.section.toLowerCase().includes(query)
        );
        
        displaySearchResults(results, query);
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            clearSearchResults();
            searchInput.blur();
        }
    });
}

function buildSearchIndex() {
    const index = [];
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const section = item.closest('.nav-section');
        const sectionTitle = section ? section.querySelector('.nav-section-title span:last-child')?.textContent : '';
        
        index.push({
            title: item.textContent.trim(),
            section: sectionTitle || '',
            url: item.getAttribute('href')
        });
    });
    
    return index;
}

function displaySearchResults(results, query) {
    let container = document.querySelector('.search-results');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'search-results';
        const searchWrapper = document.querySelector('.sidebar-search');
        searchWrapper.appendChild(container);
    }
    
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">No results found</div>';
        container.style.display = 'block';
        return;
    }
    
    const html = results.slice(0, 10).map(item => `
        <a href="${item.url}" class="search-result-item">
            <span class="search-result-title">${highlightMatch(item.title, query)}</span>
            <span class="search-result-section">${item.section}</span>
        </a>
    `).join('');
    
    container.innerHTML = html;
    container.style.display = 'block';
}

function clearSearchResults() {
    const container = document.querySelector('.search-results');
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ============================================
   Navigation Sections (Collapsible)
   ============================================ */

function initNavSections() {
    const sections = document.querySelectorAll('.nav-section');
    
    sections.forEach(section => {
        const header = section.querySelector('.nav-section-header');
        if (!header) return;
        
        // Check if this section contains the active page
        const activeItem = section.querySelector('.nav-item.active');
        if (activeItem) {
            section.classList.add('expanded');
        }
        
        header.addEventListener('click', function() {
            // Toggle this section
            section.classList.toggle('expanded');
            
            // Save state to localStorage
            saveNavState();
        });
    });
    
    // Restore saved state
    restoreNavState();
}

function saveNavState() {
    const sections = document.querySelectorAll('.nav-section');
    const state = {};
    
    sections.forEach((section, index) => {
        state[index] = section.classList.contains('expanded');
    });
    
    localStorage.setItem('siemDocsNavState', JSON.stringify(state));
}

function restoreNavState() {
    const saved = localStorage.getItem('siemDocsNavState');
    if (!saved) return;
    
    try {
        const state = JSON.parse(saved);
        const sections = document.querySelectorAll('.nav-section');
        
        sections.forEach((section, index) => {
            // Don't override if section has active item
            if (section.querySelector('.nav-item.active')) return;
            
            if (state[index]) {
                section.classList.add('expanded');
            } else {
                section.classList.remove('expanded');
            }
        });
    } catch (e) {
        console.error('Error restoring nav state:', e);
    }
}

/* ============================================
   Code Block Copy
   ============================================ */

function initCodeCopy() {
    // Find all pre elements and add copy buttons
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(pre => {
        // Skip if already has header
        if (pre.querySelector('.code-header')) return;
        
        const code = pre.querySelector('code');
        if (!code) return;
        
        // Try to detect language from class
        const langClass = Array.from(code.classList).find(c => c.startsWith('language-'));
        const lang = langClass ? langClass.replace('language-', '') : 'code';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <span class="code-lang">${lang}</span>
            <button class="code-copy" aria-label="Copy code">
                <span class="copy-icon">📋</span>
                <span class="copy-text">Copy</span>
            </button>
        `;
        
        pre.insertBefore(header, pre.firstChild);
        
        // Add click handler
        const copyBtn = header.querySelector('.code-copy');
        copyBtn.addEventListener('click', async function() {
            const text = code.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                
                copyBtn.classList.add('copied');
                copyBtn.querySelector('.copy-text').textContent = 'Copied!';
                copyBtn.querySelector('.copy-icon').textContent = '✓';
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.querySelector('.copy-text').textContent = 'Copy';
                    copyBtn.querySelector('.copy-icon').textContent = '📋';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                // Fallback for older browsers
                fallbackCopy(text, copyBtn);
            }
        });
    });
}

function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        button.classList.add('copied');
        button.querySelector('.copy-text').textContent = 'Copied!';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.querySelector('.copy-text').textContent = 'Copy';
        }, 2000);
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textarea);
}

/* ============================================
   Scroll Spy (Active nav item)
   ============================================ */

function initScrollSpy() {
    const headings = document.querySelectorAll('h2[id], h3[id]');
    if (headings.length === 0) return;
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update URL hash without scrolling
                const id = entry.target.getAttribute('id');
                if (id && history.replaceState) {
                    history.replaceState(null, null, `#${id}`);
                }
            }
        });
    }, {
        rootMargin: '-100px 0px -66%'
    });
    
    headings.forEach(heading => observer.observe(heading));
}

/* ============================================
   Keyboard Shortcuts
   ============================================ */

function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Focus search: Ctrl/Cmd + K or /
        if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isInputFocused())) {
            e.preventDefault();
            const searchInput = document.querySelector('.sidebar-search input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Navigate with arrow keys when search focused
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const results = document.querySelectorAll('.search-result-item');
            if (results.length === 0) return;
            
            const focused = document.querySelector('.search-result-item:focus');
            if (!focused && e.key === 'ArrowDown') {
                e.preventDefault();
                results[0].focus();
            } else if (focused) {
                e.preventDefault();
                const index = Array.from(results).indexOf(focused);
                if (e.key === 'ArrowDown' && index < results.length - 1) {
                    results[index + 1].focus();
                } else if (e.key === 'ArrowUp' && index > 0) {
                    results[index - 1].focus();
                }
            }
        }
    });
}

function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
}

/* ============================================
   Utility Functions
   ============================================ */

// Smooth scroll to anchor
function scrollToAnchor(hash) {
    if (!hash) return;
    
    const target = document.querySelector(hash);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle anchor clicks
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const hash = link.getAttribute('href');
    if (hash && hash !== '#') {
        e.preventDefault();
        scrollToAnchor(hash);
        history.pushState(null, null, hash);
    }
});

// Handle initial hash
if (window.location.hash) {
    setTimeout(() => scrollToAnchor(window.location.hash), 100);
}

/* ============================================
   Syntax Highlighting - DISABLED
   (Removed due to rendering bugs)
   Code blocks now display as plain text
   ============================================ */

/* ============================================
   Search Results Styles (injected)
   ============================================ */

const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        border: 1px solid var(--bg-tertiary);
        border-radius: var(--radius-md);
        margin-top: var(--spacing-xs);
        max-height: 300px;
        overflow-y: auto;
        z-index: 100;
        display: none;
        box-shadow: var(--shadow-lg);
    }
    
    .search-result-item {
        display: block;
        padding: var(--spacing-sm) var(--spacing-md);
        text-decoration: none;
        border-bottom: 1px solid var(--bg-tertiary);
        transition: background var(--transition-fast);
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-item:hover,
    .search-result-item:focus {
        background: var(--bg-hover);
        outline: none;
    }
    
    .search-result-title {
        display: block;
        color: var(--text-primary);
        font-size: 0.9rem;
    }
    
    .search-result-title mark {
        background: var(--cyan-dim);
        color: var(--cyan-primary);
        border-radius: 2px;
        padding: 0 2px;
    }
    
    .search-result-section {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 2px;
    }
    
    .search-no-results {
        padding: var(--spacing-md);
        text-align: center;
        color: var(--text-muted);
        font-size: 0.9rem;
    }
`;
document.head.appendChild(searchStyles);
