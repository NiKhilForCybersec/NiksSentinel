// Microsoft Sentinel Ultimate Guide - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCopyButtons();
    initMobileNav();
    initAccordions();
    initTabs();
    initSidebarHighlight();
    initSmoothScroll();
    initSearchFilter();
});

// ===== Copy to Clipboard =====
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('pre').textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // Visual feedback
                const originalHTML = this.innerHTML;
                this.classList.add('copied');
                this.innerHTML = `
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = code;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.innerHTML = `
                            <svg viewBox="0 0 16 16" fill="currentColor">
                                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
                                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
                            </svg>
                            Copy
                        `;
                    }, 2000);
                } catch (e) {
                    console.error('Fallback copy failed:', e);
                }
                
                document.body.removeChild(textarea);
            }
        });
    });
}

// ===== Mobile Navigation =====
function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (!toggle || !sidebar) return;
    
    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        this.classList.toggle('active');
        
        // Update icon
        const icon = this.querySelector('svg');
        if (sidebar.classList.contains('active')) {
            icon.innerHTML = `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            `;
        } else {
            icon.innerHTML = `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            `;
        }
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('active');
                toggle.classList.remove('active');
            }
        }
    });
    
    // Close sidebar on link click (mobile)
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    });
}

// ===== Accordions =====
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other accordions in the same container
            const accordion = this.closest('.accordion');
            if (accordion) {
                accordion.querySelectorAll('.accordion-header').forEach(h => {
                    h.classList.remove('active');
                    h.nextElementSibling.classList.remove('active');
                });
            }
            
            // Toggle current accordion
            if (!isActive) {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });
}

// ===== Tabs =====
function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        const buttons = tabContainer.querySelectorAll('.tab-btn');
        const contents = tabContainer.querySelectorAll('.tab-content');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const target = this.dataset.tab;
                
                // Update buttons
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update content
                contents.forEach(c => {
                    c.classList.remove('active');
                    if (c.id === target) {
                        c.classList.add('active');
                    }
                });
            });
        });
    });
}

// ===== Sidebar Active State =====
function initSidebarHighlight() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
}

// ===== Search/Filter Functionality =====
function initSearchFilter() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    const filterTarget = searchInput.dataset.filter;
    const items = document.querySelectorAll(filterTarget);
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const match = text.includes(query);
            item.style.display = match ? '' : 'none';
        });
    });
}

// ===== Utility: Debounce =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== KQL Syntax Highlighting =====
function highlightKQL(code) {
    const keywords = ['where', 'project', 'extend', 'summarize', 'join', 'union', 'let', 'datatable', 
                      'parse', 'evaluate', 'render', 'order by', 'sort by', 'top', 'take', 'limit',
                      'distinct', 'count', 'sum', 'avg', 'min', 'max', 'make_list', 'make_set',
                      'by', 'on', 'and', 'or', 'not', 'in', 'has', 'contains', 'startswith', 'endswith',
                      'between', 'ago', 'now', 'datetime', 'timespan', 'bin', 'todynamic', 'tostring',
                      'toint', 'tolong', 'todouble', 'tobool', 'if', 'case', 'iff', 'iif'];
    
    const tables = ['SecurityEvent', 'SigninLogs', 'AuditLogs', 'DeviceProcessEvents', 
                    'DeviceNetworkEvents', 'DeviceFileEvents', 'DeviceLogonEvents',
                    'EmailEvents', 'CloudAppEvents', 'AzureActivity', 'Syslog',
                    'CommonSecurityLog', 'SecurityAlert', 'SecurityIncident'];
    
    let highlighted = code;
    
    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*)$/gm, '<span class="kql-comment">$1</span>');
    
    // Highlight strings
    highlighted = highlighted.replace(/(".*?")/g, '<span class="kql-string">$1</span>');
    highlighted = highlighted.replace(/('.*?')/g, '<span class="kql-string">$1</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="kql-number">$1</span>');
    
    // Highlight keywords
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        highlighted = highlighted.replace(regex, '<span class="kql-keyword">$1</span>');
    });
    
    // Highlight tables
    tables.forEach(table => {
        const regex = new RegExp(`\\b(${table})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="kql-table">$1</span>');
    });
    
    return highlighted;
}

// ===== Table of Contents Generator =====
function generateTOC() {
    const toc = document.querySelector('.toc-list');
    if (!toc) return;
    
    const headings = document.querySelectorAll('.content-container h2, .content-container h3');
    
    headings.forEach((heading, index) => {
        // Add ID if not present
        if (!heading.id) {
            heading.id = `section-${index}`;
        }
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        
        if (heading.tagName === 'H3') {
            a.classList.add('toc-h3');
        }
        
        li.appendChild(a);
        toc.appendChild(li);
    });
}

// ===== Back to Top Button =====
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    btn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 44px;
        height: 44px;
        background: var(--accent-primary);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    }, 100));
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop);
} else {
    initBackToTop();
}
