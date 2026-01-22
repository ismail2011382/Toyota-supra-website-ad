/**
 * Toyota GR Supra - Premium Website
 * JavaScript for authentication, theme switching, animations, and easter eggs
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Local Storage Keys
    // ========================================
    const STORAGE_KEYS = {
        USERS: 'toyota_users',
        CURRENT_USER: 'toyota_current_user',
        THEME_MODE: 'toyota_theme_mode',
        PENDING_VERIFICATION: 'toyota_pending_verification'
    };

    // ========================================
    // User Management (Simulated Database)
    // ========================================
    const UserDB = {
        getUsers() {
            const users = localStorage.getItem(STORAGE_KEYS.USERS);
            return users ? JSON.parse(users) : {};
        },

        saveUsers(users) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        },

        addUser(email, password) {
            const users = this.getUsers();
            users[email] = {
                password,
                verified: false,
                createdAt: new Date().toISOString()
            };
            this.saveUsers(users);
        },

        verifyUser(email) {
            const users = this.getUsers();
            if (users[email]) {
                users[email].verified = true;
                this.saveUsers(users);
                return true;
            }
            return false;
        },

        findUser(email) {
            const users = this.getUsers();
            return users[email] || null;
        },

        validateLogin(email, password) {
            const user = this.findUser(email);
            return user && user.password === password && user.verified;
        },

        getCurrentUser() {
            return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        },

        setCurrentUser(email) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
        },

        logout() {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
    };

    // ========================================
    // Verification Code Management
    // ========================================
    let currentVerificationCode = null;
    let pendingEmail = null;

    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function sendVerificationEmail(email, code) {
        // In a real app, this would send an actual email
        // For demo purposes, we'll display the code
        console.log(`📧 Verification email sent to ${email}`);
        console.log(`🔐 Your verification code is: ${code}`);

        // Store for verification
        currentVerificationCode = code;
        pendingEmail = email;

        // Show the code in the modal for demo
        const codeDisplay = document.getElementById('code-display');
        if (codeDisplay) {
            codeDisplay.textContent = `Demo: Your code is ${code}`;
        }

        return true;
    }

    // ========================================
    // Color Configuration
    // ========================================
    const colorData = {
        red: {
            name: 'Renaissance Red 2.0',
            image: 'assets/supra_red.png',
            video: 'assets/videos/supra_red.mp4'
        },
        blue: {
            name: 'Refraction Blue',
            image: 'assets/supra_blue.png',
            video: 'assets/videos/supra_blue.mp4'
        },
        white: {
            name: 'Absolute Zero White',
            image: 'assets/supra_white.png',
            video: 'assets/videos/supra_white.mp4'
        },
        black: {
            name: 'Nocturnal Black',
            image: 'assets/supra_black.png',
            video: 'assets/videos/supra_black.mp4'
        },
        yellow: {
            name: 'Nitro Yellow',
            image: 'assets/supra_yellow.png',
            video: 'assets/videos/supra_yellow.mp4'
        }
    };

    // ========================================
    // DOM Elements
    // ========================================
    const elements = {
        // Color selector
        colorBtns: document.querySelectorAll('.color-btn'),
        colorNameEl: document.getElementById('color-name'),
        carImageEl: document.getElementById('car-image'),
        carVideoEl: document.getElementById('car-video'),
        videoSourceEl: document.getElementById('video-source'),

        // Theme toggle
        themeToggle: document.getElementById('theme-toggle'),

        // Auth
        authBtn: document.getElementById('auth-btn'),
        loginModal: document.getElementById('login-modal'),
        signupModal: document.getElementById('signup-modal'),
        verifyModal: document.getElementById('verify-modal'),
        loginForm: document.getElementById('login-form'),
        signupForm: document.getElementById('signup-form'),
        verifyForm: document.getElementById('verify-form'),

        // Modal controls
        closeLogin: document.getElementById('close-login'),
        closeSignup: document.getElementById('close-signup'),
        closeVerify: document.getElementById('close-verify'),
        showSignup: document.getElementById('show-signup'),
        showLogin: document.getElementById('show-login'),
        resendCode: document.getElementById('resend-code'),

        // Easter egg
        easterEggOverlay: document.getElementById('easter-egg-overlay'),

        // History tabs
        historyTabs: document.querySelectorAll('.history-tab'),
        historyPanels: document.querySelectorAll('.history-panel'),

        // Navigation
        navbar: document.getElementById('navbar')
    };

    // ========================================
    // Theme Mode (Dark/Light)
    // ========================================
    function initTheme() {
        const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) || 'dark';
        document.body.dataset.mode = savedMode;
    }

    function toggleTheme() {
        const currentMode = document.body.dataset.mode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        document.body.dataset.mode = newMode;
        localStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
    }

    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // ========================================
    // Color Selector
    // ========================================
    elements.colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;

            // Update active state
            elements.colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update body theme
            document.body.dataset.theme = color;

            // Update color name
            if (elements.colorNameEl) {
                elements.colorNameEl.textContent = colorData[color].name;
            }

            // Update car image with fade transition
            if (elements.carImageEl) {
                elements.carImageEl.style.opacity = '0';
                setTimeout(() => {
                    elements.carImageEl.src = colorData[color].image;
                    elements.carImageEl.style.opacity = '1';
                }, 300);
            }

            // Update video if exists
            if (elements.carVideoEl && elements.videoSourceEl) {
                const videoPath = colorData[color].video;
                elements.videoSourceEl.src = videoPath;
                elements.carVideoEl.load();
                elements.carVideoEl.play().catch(() => {
                    // Video might not exist, hide it and show image
                    elements.carVideoEl.classList.remove('active');
                    if (elements.carImageEl) {
                        elements.carImageEl.classList.remove('hidden');
                    }
                });
            }
        });
    });

    // Add transition to car image
    if (elements.carImageEl) {
        elements.carImageEl.style.transition = 'opacity 0.3s ease, filter 0.8s ease';
    }

    // ========================================
    // Modal Management
    // ========================================
    function openModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    function closeAllModals() {
        closeModal(elements.loginModal);
        closeModal(elements.signupModal);
        closeModal(elements.verifyModal);
    }

    // Auth button click
    if (elements.authBtn) {
        elements.authBtn.addEventListener('click', () => {
            const currentUser = UserDB.getCurrentUser();
            if (currentUser) {
                // User is logged in, log them out
                UserDB.logout();
                updateAuthUI();
                alert('You have been logged out successfully!');
            } else {
                // Show login modal
                openModal(elements.loginModal);
            }
        });
    }

    // Modal close buttons
    if (elements.closeLogin) {
        elements.closeLogin.addEventListener('click', () => closeModal(elements.loginModal));
    }
    if (elements.closeSignup) {
        elements.closeSignup.addEventListener('click', () => closeModal(elements.signupModal));
    }
    if (elements.closeVerify) {
        elements.closeVerify.addEventListener('click', () => closeModal(elements.verifyModal));
    }

    // Switch between login and signup
    if (elements.showSignup) {
        elements.showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(elements.loginModal);
            openModal(elements.signupModal);
        });
    }
    if (elements.showLogin) {
        elements.showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(elements.signupModal);
            openModal(elements.loginModal);
        });
    }

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });

    // ========================================
    // Easter Egg: Iron Fist
    // ========================================
    const EASTER_EGG_EMAIL = 'azerbaycan@gmail.com';
    const EASTER_EGG_PASSWORD = '44days';

    function triggerEasterEgg() {
        if (elements.easterEggOverlay) {
            elements.easterEggOverlay.classList.remove('hidden');

            // Play punch sound if audio is available
            const punchSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleR0EO7K6p4uBeW+B');
            punchSound.volume = 0.5;
            punchSound.play().catch(() => { });

            // Remove after animation
            setTimeout(() => {
                elements.easterEggOverlay.classList.add('hidden');
            }, 3000);
        }
    }

    function checkEasterEgg(email, password) {
        return email.toLowerCase() === EASTER_EGG_EMAIL && password === EASTER_EGG_PASSWORD;
    }

    // ========================================
    // Login Form Handler
    // ========================================
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Check for easter egg first
            if (checkEasterEgg(email, password)) {
                closeAllModals();
                triggerEasterEgg();
                return;
            }

            // Normal login
            const user = UserDB.findUser(email);

            if (!user) {
                alert('No account found with this email. Please sign up first.');
                return;
            }

            if (!user.verified) {
                alert('Please verify your email first.');
                // Resend verification code
                const code = generateVerificationCode();
                sendVerificationEmail(email, code);
                closeModal(elements.loginModal);
                openModal(elements.verifyModal);
                return;
            }

            if (user.password !== password) {
                alert('Incorrect password. Please try again.');
                return;
            }

            // Successful login
            UserDB.setCurrentUser(email);
            updateAuthUI();
            closeAllModals();
            alert(`Welcome back! You are now logged in as ${email}`);
            elements.loginForm.reset();
        });
    }

    // ========================================
    // Signup Form Handler
    // ========================================
    if (elements.signupForm) {
        elements.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            // Validation
            if (password.length < 5) {
                alert('Password must be at least 5 characters long.');
                return;
            }

            if (password !== confirm) {
                alert('Passwords do not match.');
                return;
            }

            // Check if user exists
            if (UserDB.findUser(email)) {
                alert('An account with this email already exists. Please log in.');
                closeModal(elements.signupModal);
                openModal(elements.loginModal);
                return;
            }

            // Create user
            UserDB.addUser(email, password);

            // Generate and send verification code
            const code = generateVerificationCode();
            sendVerificationEmail(email, code);

            // Update verification modal text
            const verifyText = document.getElementById('verify-email-text');
            if (verifyText) {
                verifyText.textContent = `We've sent a 6-digit code to ${email}`;
            }

            // Show verification modal
            closeModal(elements.signupModal);
            openModal(elements.verifyModal);
            elements.signupForm.reset();
        });
    }

    // ========================================
    // Verification Code Input Handling
    // ========================================
    const codeInputs = document.querySelectorAll('.code-input');

    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;

            // Only allow numbers
            e.target.value = value.replace(/[^0-9]/g, '');

            // Move to next input
            if (value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            // Move to previous input on backspace
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);

            pastedData.split('').forEach((char, i) => {
                if (codeInputs[i]) {
                    codeInputs[i].value = char;
                }
            });

            const lastIndex = Math.min(pastedData.length - 1, codeInputs.length - 1);
            codeInputs[lastIndex].focus();
        });
    });

    // ========================================
    // Verification Form Handler
    // ========================================
    if (elements.verifyForm) {
        elements.verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get entered code
            let enteredCode = '';
            codeInputs.forEach(input => {
                enteredCode += input.value;
            });

            if (enteredCode.length !== 6) {
                alert('Please enter the complete 6-digit code.');
                return;
            }

            // Verify code
            if (enteredCode === currentVerificationCode) {
                // Verify user in database
                if (pendingEmail && UserDB.verifyUser(pendingEmail)) {
                    UserDB.setCurrentUser(pendingEmail);
                    updateAuthUI();
                    closeAllModals();
                    alert('Email verified successfully! You are now logged in.');

                    // Clear inputs
                    codeInputs.forEach(input => input.value = '');
                    currentVerificationCode = null;
                    pendingEmail = null;
                }
            } else {
                alert('Incorrect verification code. Please try again.');
            }
        });
    }

    // Resend verification code
    if (elements.resendCode) {
        elements.resendCode.addEventListener('click', (e) => {
            e.preventDefault();
            if (pendingEmail) {
                const code = generateVerificationCode();
                sendVerificationEmail(pendingEmail, code);
                alert('A new verification code has been sent!');
            }
        });
    }

    // ========================================
    // Update Auth UI
    // ========================================
    function updateAuthUI() {
        const currentUser = UserDB.getCurrentUser();

        if (elements.authBtn) {
            if (currentUser) {
                elements.authBtn.textContent = 'Sign Out';
                elements.authBtn.classList.add('logged-in');
            } else {
                elements.authBtn.textContent = 'Sign In';
                elements.authBtn.classList.remove('logged-in');
            }
        }
    }

    // ========================================
    // History Tabs
    // ========================================
    elements.historyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const gen = tab.dataset.gen;

            // Update active tab
            elements.historyTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            elements.historyPanels.forEach(panel => {
                if (panel.dataset.gen === gen) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    if (elements.navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // Scroll-triggered Animations
    // ========================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
    }

    // ========================================
    // Parallax Effect on Hero
    // ========================================
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        if (heroBg) {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // ========================================
    // Number Counter Animation
    // ========================================
    function animateCounter(element, target, isDecimal = false) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const current = start + (target - start) * easeOut;
            element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Observe performance cards for counter animation
    const perfCards = document.querySelectorAll('.perf-card');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueEl = entry.target.querySelector('.perf-value[data-count]');
                if (valueEl && !valueEl.dataset.animated) {
                    const target = parseFloat(valueEl.dataset.count);
                    const isDecimal = valueEl.dataset.decimal === 'true';
                    animateCounter(valueEl, target, isDecimal);
                    valueEl.dataset.animated = 'true';
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    perfCards.forEach(card => counterObserver.observe(card));

    // ========================================
    // Initialize
    // ========================================
    initTheme();
    updateAuthUI();

    console.log('🚗 Toyota GR Supra Website Loaded');
    console.log('🔐 Easter egg: Try logging in with azerbaycan@gmail.com / 44days');
});
