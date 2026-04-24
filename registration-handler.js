// ============================================================
// Registration Form Handler
// Validates and submits farmer registration to Supabase
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        // Gather field values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const aadhar = document.getElementById('aadhar').value.trim();
        const state = document.getElementById('state').value;
        const landSize = document.getElementById('landSize').value;

        // --- Validation ---
        if (!firstName || !lastName || !phone || !aadhar || !state || !landSize) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        // Phone: must be exactly 10 digits
        if (!/^\d{10}$/.test(phone)) {
            showToast('Phone number must be exactly 10 digits.', 'error');
            highlightField('phone');
            return;
        }

        // Aadhar: must be exactly 12 digits
        if (!/^\d{12}$/.test(aadhar)) {
            showToast('Aadhar number must be exactly 12 digits.', 'error');
            highlightField('aadhar');
            return;
        }

        // Land size: must be positive
        if (parseFloat(landSize) <= 0) {
            showToast('Land size must be greater than 0.', 'error');
            highlightField('landSize');
            return;
        }

        // --- Submit to Supabase ---
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
            submitBtn.style.opacity = '0.7';

            const { data, error } = await supabaseClient
                .from('farmers')
                .insert([{
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    aadhar: aadhar,
                    state: state,
                    land_size: parseFloat(landSize)
                }]);

            if (error) {
                // Handle duplicate entries
                if (error.code === '23505') {
                    if (error.message.includes('phone')) {
                        showToast('This phone number is already registered.', 'error');
                    } else if (error.message.includes('aadhar')) {
                        showToast('This Aadhar number is already registered.', 'error');
                    } else {
                        showToast('A farmer with these details already exists.', 'error');
                    }
                } else {
                    showToast('Registration failed: ' + error.message, 'error');
                }
                console.error('Supabase error:', error);
            } else {
                showToast('Registration successful! Welcome to AgriConnect.', 'success');
                form.reset();

                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
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

    // Highlight invalid field with a red border briefly
    function highlightField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.style.borderColor = '#EF4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
        field.focus();
        setTimeout(() => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }, 3000);
    }
});
