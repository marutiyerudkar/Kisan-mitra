// ============================================================
// Contact Form Handler
// Validates and submits contact inquiries to Supabase
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        // Gather field values
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // --- Validation ---
        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        // --- Submit to Supabase ---
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';

            const { data, error } = await supabaseClient
                .from('contact_messages')
                .insert([{
                    name: name,
                    email: email,
                    subject: subject || null,
                    message: message
                }]);

            if (error) {
                showToast('Failed to send message: ' + error.message, 'error');
                console.error('Supabase error:', error);
            } else {
                showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
            }
        } catch (err) {
            showToast('Network error. Please check your connection.', 'error');
            console.error('Network error:', err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    });
});
