// Improved FAQ Accordion Toggle with ARIA

(function () {
    const items = Array.from(document.querySelectorAll('.faq-item'));
    items.forEach((item, idx) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        if (!button || !answer) return;

        // Ensure unique IDs and ARIA linkage
        const answerId = answer.id || `faq-answer-${idx + 1}`;
        answer.id = answerId;
        button.setAttribute('aria-controls', answerId);
        button.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');

        function closeAll() {
            items.forEach((it) => {
                it.classList.remove('active');
                const btn = it.querySelector('.faq-question');
                const ans = it.querySelector('.faq-answer');
                const ic = it.querySelector('.faq-icon');
                if (btn) btn.setAttribute('aria-expanded', 'false');
                if (ans) ans.setAttribute('aria-hidden', 'true');
                if (ic) ic.textContent = '+';
            });
        }

        function openItem() {
            item.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
            answer.setAttribute('aria-hidden', 'false');
            if (icon) icon.textContent = '–';
        }

        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            closeAll();
            if (!isActive) openItem();
        });

        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
})();
