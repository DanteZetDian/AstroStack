// AstroStack - ADVANCED FORM HANDLER
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 AstroStack Advanced Form Handler loaded');

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Элементы формы
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('formMessage');
    
    if (!submitBtn) return;

    // Валидация в реальном времени
    const emailInput = contactForm.querySelector('#email');
    const phoneInput = contactForm.querySelector('#phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#ff4444';
                showFieldError(this, 'Введите корректный email');
            } else {
                this.style.borderColor = '';
                hideFieldError(this);
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }

    // Обработчик отправки
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Валидация перед отправкой
        if (!validateForm()) return;

        const originalText = submitBtn.textContent;
        const originalHTML = submitBtn.innerHTML;
        
        // Красивое состояние загрузки
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this);
            
            // Добавляем дополнительную информацию
            formData.append('page_url', window.location.href);
            formData.append('user_agent', navigator.userAgent);
            formData.append('timestamp', new Date().toISOString());

            const response = await fetch(this.action, {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            
            if (response.ok && result === 'success') {
                showMessage('✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Плавный сброс формы
                setTimeout(() => {
                    this.reset();
                    hideMessage();
                }, 3000);
                
                // Можно добавить отправку в Analytics
                console.log('Form submitted successfully');
                
            } else {
                throw new Error(result || 'Unknown error');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('❌ Ошибка при отправке: ' + error.message, 'error');
        } finally {
            // Плавное восстановление кнопки
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 500);
        }
    });

    // Функции валидации
    function validateForm() {
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const message = contactForm.querySelector('#message').value.trim();
        
        let isValid = true;

        // Валидация имени
        if (name.length < 2) {
            showFieldError(contactForm.querySelector('#name'), 'Имя должно содержать минимум 2 символа');
            isValid = false;
        }

        // Валидация email
        if (!email || !isValidEmail(email)) {
            showFieldError(contactForm.querySelector('#email'), 'Введите корректный email');
            isValid = false;
        }

        // Валидация сообщения
        if (message.length < 10) {
            showFieldError(contactForm.querySelector('#message'), 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function formatPhoneNumber(phone) {
        return phone.replace(/\D/g, '')
            .replace(/^7|^8/, '+7')
            .replace(/(\+\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
    }

    function showFieldError(input, message) {
        hideFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #ff4444;
            font-size: 12px;
            margin-top: 5px;
        `;
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#ff4444';
    }

    function hideFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }

    function showMessage(text, type) {
        if (!messageDiv) {
            alert(text);
            return;
        }
        
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
        messageDiv.style.background = type === 'success' ? '#4CAF50' : '#f44336';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '15px';
        messageDiv.style.borderRadius = '10px';
        messageDiv.style.marginTop = '20px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.transition = 'all 0.3s ease';
    }

    function hideMessage() {
        if (messageDiv) {
            messageDiv.style.display = 'none';
        }
    }

    // Автосохранение в localStorage (опционально)
    contactForm.addEventListener('input', function() {
        const formData = {
            name: contactForm.querySelector('#name').value,
            email: contactForm.querySelector('#email').value,
            phone: contactForm.querySelector('#phone').value,
            subject: contactForm.querySelector('#subject').value,
            message: contactForm.querySelector('#message').value
        };
        localStorage.setItem('astrostack_form_draft', JSON.stringify(formData));
    });

    // Восстановление данных при загрузке
    const savedData = localStorage.getItem('astrostack_form_draft');
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach(key => {
            const input = contactForm.querySelector(`#${key}`);
            if (input) input.value = formData[key];
        });
    }

    // Очистка сохранённых данных после успешной отправки
    contactForm.addEventListener('reset', function() {
        localStorage.removeItem('astrostack_form_draft');
    });
});