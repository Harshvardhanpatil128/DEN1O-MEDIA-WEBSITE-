document.addEventListener('DOMContentLoaded', () => {
    // 3D Depth / Anti-gravity effect for interactive elements
    const interactiveElements = document.querySelectorAll('.interactive-element');

    interactiveElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            el.style.transition = `transform 0.5s ease-out`;
        });
        
        el.addEventListener('mouseenter', () => {
            el.style.transition = `transform 0.1s ease-out`;
        });
    });

    // Touch-device safeguard: skip all 3D physics, handled by CSS pointer:coarse
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
        // Disable all interactive-element transforms to protect native scroll
        interactiveElements.forEach(el => {
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
    }

    // Floating animation for specific floating icons or assets
    const floatingAssets = document.querySelectorAll('.floating-asset');
    
    floatingAssets.forEach((asset, index) => {
        // Slight random delay so they don't move exactly together
        const delay = index * 0.2;
        asset.style.animation = `float 6s ease-in-out infinite ${delay}s`;
    });

    // Service → Contact Form: Dynamic context capture & message pre-fill
    const serviceLinks = document.querySelectorAll('.service-contact-link');
    const messageField = document.querySelector('.contact-form form textarea[name="message"]');

    serviceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Get the service name from the parent card's data attribute
            const card = link.closest('[data-service]');
            if (card && messageField) {
                const serviceName = card.getAttribute('data-service');
                messageField.value = `I am interested in discussing your ${serviceName} services. Please get in touch with me at your earliest convenience.`;
            }
        });
    });

    // Check URL parameters for pre-filling the contact form (used when coming from services.html)
    const urlParams = new URLSearchParams(window.location.search);
    const requestedService = urlParams.get('service');
    if (requestedService && messageField) {
        messageField.value = `I am interested in discussing your ${requestedService} services. Please get in touch with me at your earliest convenience.`;
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Mandatory fields validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'phone'];
            
            // Remove previous error states
            contactForm.querySelectorAll('.shake-error').forEach(el => el.classList.remove('shake-error'));

            requiredFields.forEach(fieldName => {
                const input = contactForm.querySelector(`[name="${fieldName}"]`);
                if (!input.value.trim()) {
                    isValid = false;
                    // Trigger reflow to restart CSS animation
                    void input.offsetWidth;
                    input.classList.add('shake-error');
                }
            });

            if (!isValid) return;
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'SENDING...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3001/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Failed to send message.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Please try again.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = '...';
            submitBtn.disabled = true;

            const emailInput = form.querySelector('input[type="email"]');
            const data = { email: emailInput.value };

            try {
                const response = await fetch('http://localhost:3001/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Successfully subscribed to the newsletter!');
                    form.reset();
                } else {
                    alert('Failed to subscribe.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Please try again.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    });

    // Custom Desktop Cursor
    if (!isTouchDevice && matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Hover states for interactive elements
        const hoverElements = document.querySelectorAll('a, button, input, textarea, .interactive-element');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }
});

// Add floating keyframes dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-15px);
    }
    100% {
        transform: translateY(0px);
    }
}
`;
document.head.appendChild(style);
