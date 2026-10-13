/*
 * Поле телефону з вибором країни (прапор + префікс + маска).
 * Автономна версія countryDropdown.js + functions/phones.js — працює без збірки.
 *
 * Залежності (підключити ДО цього файлу):
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
 *   <script src="phone-country-dropdown.js"></script>
 *
 * Необхідна розмітка — див. index.html поруч (класи з префіксом js-, .country-select*,
 * .flag, .country-code та data-атрибути обов'язкові). Стилі — ../phone-country-dropdown.css.
 *
 * Поведінка:
 *   - клік по кнопці перемикає клас `open` на `.country-select` (показ списку — у CSS);
 *   - вибір країни підставляє прапор, префікс і маску;
 *   - введення префікса вручну (напр. +48) автоматично перемикає країну;
 *   - якщо у формі є поле name="country_code" (або назва з data-country-code-name на input),
 *     у нього записується код обраної країни.
 *
 * Ініціалізація — автоматично після window load. Для динамічно доданих блоків:
 *   PhoneCountryDropdown.attach(element)  // element = .js-call-trigger-modal__input-group
 *   PhoneCountryDropdown.getSelectedCountry(input)  // -> 'UA' | 'PL' | ...
 */
(function ($) {
    'use strict';

    const DEFAULT_MASK = '+ZZZ (ZZ) ZZZ-ZZ-ZZ';

    function getMask(cep) {
        if (cep.length <= 3) {
            return DEFAULT_MASK;
        }
        switch (true) {
            // UA
            case cep.startsWith('+380'):
                return '+380 (ZZ) ZZZ-ZZZZ';
            // PL
            case cep.startsWith('+48'):
                return '+48 (ZZZ) ZZZ-ZZZ';
            // GB
            case cep.startsWith('+44'):
                return '+44 (ZZZZ) ZZZZZZ';
            // US
            case cep.startsWith('+1'):
                return '+1 (ZZZ) ZZZ-ZZZZ';
            // AE — лише мобільні номери
            case cep.startsWith('+971'):
                return '+971 (ZZ) ZZZ-ZZZZ';
            default:
                return DEFAULT_MASK;
        }
    }

    function phoneNumbersMask($input) {
        $input.each(function () {
            const currentValue = $(this).val();
            const initialMask = getMask(currentValue);

            $(this).mask(initialMask, {
                byPassKeys: [0],
                translation: {
                    'Z': {
                        pattern: /[0-9]/, optional: false
                    },
                    '0': {
                        pattern: /[0]/, optional: false
                    }
                },
                onKeyPress: function (cep, e, field, options) {
                    $(field).mask(
                        getMask(cep),
                        options
                    );
                }
            });
        });
    }

    function attachCountryDropdown(inputGroup) {
        if (inputGroup.dataset.initialized === 'true') {
            return;
        }
        inputGroup.dataset.initialized = 'true';

        const phoneInput = inputGroup.querySelector('input');
        let countrySelect, flagImg, options, button;
        let countryPrefix = '';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initPhoneNumberDropdown();
                } else {
                    cleanUpPhoneNumberDropdown();
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        observer.observe(phoneInput);

        function initPhoneNumberDropdown() {
            button = inputGroup.querySelector('.js-selected-country');
            options = inputGroup.querySelectorAll('.country-select__option');
            countrySelect = inputGroup.querySelector('.country-select');
            flagImg = button ? button.querySelector('img') : null;

            if (!button || !options.length || !countrySelect || !flagImg) {
                return;
            }

            phoneNumbersMask($(phoneInput));

            let selectedCode = button.getAttribute('data-country') || '+';
            updatePhoneInput(selectedCode);

            options.forEach(option => {
                option.addEventListener('click', handleOptionClick);
            });

            button.addEventListener('click', handleButtonClick);
            phoneInput.addEventListener('focus', handleInputFocus);
            document.addEventListener('click', handleDocumentClick);
        }

        function cleanUpPhoneNumberDropdown() {
            if (!options) return;

            options.forEach(option => {
                option.removeEventListener('click', handleOptionClick);
            });

            if (button) button.removeEventListener('click', handleButtonClick);
            phoneInput.removeEventListener('focus', handleInputFocus);
            document.removeEventListener('click', handleDocumentClick);
        }

        function handleOptionClick() {
            const countryCode = this.getAttribute('data-country-value');
            if (countryCode !== 'NEUTRAL') {
                updatePhoneInput(countryCode);
            } else {
                updateNeutral('NEUTRAL');
            }
            countrySelect.classList.remove('open');
        }

        function handleButtonClick() {
            countrySelect.classList.toggle('open');
        }

        function handleInputFocus() {
            if (countrySelect.classList.contains('open')) {
                countrySelect.classList.remove('open');
            }
        }

        function handleDocumentClick(event) {
            if (!countrySelect.contains(event.target) && !phoneInput.contains(event.target)) {
                countrySelect.classList.remove('open');
            }
        }

        function setValue(phoneInput, value) {
            const $phoneInput = $(phoneInput);
            $phoneInput.unmask();
            phoneInput.value = value;
            phoneNumbersMask($phoneInput);
        }

        function updateNeutral(countryCode) {
            const selectedOption = inputGroup.querySelector(`.country-select__option[data-country-value="${countryCode}"]`);
            const flagSrc = selectedOption.querySelector('.flag').src;
            const countryPrefixText = selectedOption.querySelector('.country-code').textContent.trim();
            flagImg.src = flagSrc;
            phoneInput.placeholder = countryPrefixText;
            setValue(phoneInput, countryPrefixText);
            button.setAttribute('data-country', countryCode);

            countryPrefix = countryPrefixText;
            updateCountryCodeInput(phoneInput, countryCode);
        }

        function updatePhoneInput(countryCode) {
            const selectedOption = inputGroup.querySelector(`.country-select__option[data-country-value="${countryCode}"]`);
            const flagSrc = selectedOption.querySelector('.flag').src;
            const countryPrefixText = selectedOption.querySelector('.country-code').textContent.trim();
            flagImg.src = flagSrc;
            phoneInput.placeholder = countryPrefixText;
            button.setAttribute('data-country', countryCode);

            if (!phoneInput.value.startsWith(countryPrefixText)) {
                setValue(phoneInput, countryPrefixText);
            }

            countryPrefix = countryPrefixText;
            updateCountryCodeInput(phoneInput, countryCode);
        }

        function updateCountryCodeInput(phoneInput, countryCode) {
            const form = phoneInput?.form;
            if (!form) {
                return;
            }

            const countryCodeName = phoneInput.dataset.countryCodeName ?? 'country_code',
                countryCodeInput = form.elements.namedItem(countryCodeName);

            if (!countryCodeInput) {
                return;
            }

            countryCodeInput.value = countryCode;
        }

        phoneInput.addEventListener('input', () => {
            const phoneValue = phoneInput.value;

            if (!phoneValue.startsWith(countryPrefix)) {
                phoneInput.value = countryPrefix + phoneValue.slice(countryPrefix.length);
            }

            const matchingOption = [...options].find(option => phoneValue.startsWith(option.getAttribute('data-value')));

            if (matchingOption) {
                const newCountryCode = matchingOption.getAttribute('data-country-value');
                if (newCountryCode !== 'NEUTRAL' && newCountryCode !== button.getAttribute('data-country')) {
                    updatePhoneInput(newCountryCode);
                }
            }
        });
    }

    function getSelectedCountry(input) {
        const inputGroup = input.closest('.js-call-trigger-modal__input-group'),
            button = inputGroup.querySelector('.js-selected-country');

        return button.dataset.country;
    }

    function attachAll() {
        document.querySelectorAll('.js-call-trigger-modal__input-group').forEach(inputGroup => {
            attachCountryDropdown(inputGroup);
        });
    }

    if (document.readyState === 'complete') {
        attachAll();
    } else {
        window.addEventListener('load', attachAll);
    }

    window.PhoneCountryDropdown = {
        attach: attachCountryDropdown,
        getSelectedCountry: getSelectedCountry
    };
})(window.jQuery);
