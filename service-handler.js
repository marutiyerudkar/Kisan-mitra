// ============================================================
// Service Request Form Handler
// Validates and submits service requests to Supabase
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('service-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        // Gather field values
        const farmerName = document.getElementById('service-name').value.trim();
        const phone = document.getElementById('service-phone').value.trim();
        const serviceType = document.getElementById('service-type').value;
        const details = document.getElementById('service-details').value.trim();

        // --- Validation ---
        if (!farmerName || !phone || !serviceType) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        // Phone: must be exactly 10 digits
        if (!/^\d{10}$/.test(phone)) {
            showToast('Phone number must be exactly 10 digits.', 'error');
            return;
        }

        // --- Submit to Supabase ---
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            submitBtn.style.opacity = '0.7';

            const { data, error } = await supabaseClient
                .from('service_requests')
                .insert([{
                    farmer_name: farmerName,
                    phone: phone,
                    service_type: serviceType,
                    details: details || null
                }]);

            if (error) {
                showToast('Failed to submit request: ' + error.message, 'error');
                console.error('Supabase error:', error);
            } else {
                showToast('Service request submitted! Our team will contact you soon.', 'success');
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
