class FormValidation {
    constructor(config) {
        this._config = config;
    }

    enableValidation() {
        const formNew = document.querySelector(this._config.form);
        formNew.addEventListener('submit', this._handleFormSubmit);
        formNew.addEventListener('input', (event) => this._handleFormInput(event, this._config));
    }

    /* Функция-коллбэк, обрабатывающая событие отправки формы. */
    _handleFormSubmit = (event) => {
        event.preventDefault();
        // Форма - элемент, на котором было *установлено* событие, поэтому используем `event.currentTarget`.
        const form = event.currentTarget;
        // Если форма валидна, то сбросим её.
        // В любом случае выведем сообщение в консоль.
        const isValid = form.checkValidity();
        if (isValid) {
            alert('Форма валидна!');
            form.reset();
        } else {
            alert('Форма НЕ валидна!');
        }
    }

    _handleFormInput = (event, config) => {
        // Поле ввода, на котором произошло событие.
        const input = event.target;
        // Форма - элемент, на котором было *установлено* событие, поэтому используем `event.currentTarget`.
        const form = event.currentTarget;
        // Устанавливаем кастомные тексты ошибок.
        this._setCustomError(input);
        // Валидация паролей
        this._validatePasswordsMatch(form, config);
        // Записываем текст ошибок в специальные контейнеры под каждым полем.
        this._setFieldError(input);
        // Включаем или выключаем кнопку отправки формы.
        this._setSubmitButtonState(form, config);
    }

    /* Функция для копирования текста ошибки из свойства поля ввода в span под ним. */
    _setFieldError(field) {
        // span, куда будем класть ошибку, у нас всегда находится сразу после поля ввода.
        // Поэтому простейшим способом его найти в документе будет взять следующий элемент после инпута.
        const span = field.nextElementSibling;
        // Возьмём `validationMessage` из инпута и переложим его в span.
        span.textContent = field.validationMessage;
    }

    /* Функция для изменения состояния кнопки отправки формы. */
    _setSubmitButtonState(form, config) {
        // Найдём кнопку в форме.
        const button = form.querySelector(config.button);
        // Проверим, валидна ли форма?
        const isValid = form.checkValidity(); // Форма валидна в целом или нет?

        if (isValid) {
            // Если форма валидна, атрибут `disabled` и классы ошибок с кнопки нужно снять.
            button.removeAttribute('disabled');
            button.classList.add(config.buttonValid);
            button.classList.remove(config.buttonInvalid);
        } else {
            // Если форма НЕ валидно, атрибут `disabled` и классы ошибок на кнопке нужно установить.
            button.setAttribute('disabled', true);
            button.classList.remove(config.buttonValid);
            button.classList.add(config.buttonInvalid);
        }
    }

    /* Функция для установки кастомных текстов ошибок при одной из стандартных ошибок валидации формы. */
    _setCustomError(input) {
        const validity = input.validity;

        // Устанавливаем validity.customError в false
        input.setCustomValidity('');

        // Если сработало ограничение на `minlength` или `maxlength`, установим свой текст ошибки.
        if (validity.tooShort || validity.tooLong) {
            // Используем `template strings`, чтобы сделать красивую ошибку.
            const current = input.value.length;
            const min = input.getAttribute('minlength');
            const max = input.getAttribute('maxlength')
            input.setCustomValidity(`Строка слишком короткая. Введено ${current} символов, а должно быть от ${min} до ${max}`);
        }

        // Если сработало ограничение по установленному типу элемента, и тип - ссылка, то выведем соответствующую ошибку.
        else if (validity.typeMismatch && input.type === 'url') {
            input.setCustomValidity('Здесь должна быть ссылка');
        }
    }

    /* Функция для проверки совпадения паролей в двух полях ввода. */
    _validatePasswordsMatch(form, config) {
        if(!(config.password || config.passwordConfirm)) {
            return;
        }

        // Находим поля ввода пароля.
        const inputPassword = form.querySelector(config.password);
        const inputPasswordConfirm = form.querySelector(config.passwordConfirm);

        if (!(inputPassword || inputPasswordConfirm)) {
            return;
        }

        // Сбрасываем кастомную ошибку.
        inputPasswordConfirm.setCustomValidity('');
        // Если значения в полях не совпадают, покажем текст ошибки.
        if (inputPassword.value !== inputPasswordConfirm.value) {
            inputPasswordConfirm.setCustomValidity('Пароли не совпадают!');
        }
        // Установим ошибку даже если ввод произошёл на первом поле ввода с паролем.
        this._setFieldError(inputPasswordConfirm);
    }
}

const form1 = new FormValidation({
    form: '.popup__form[name="new"]',
    button: '.popup__button',
    buttonValid: 'popup__button_valid',
    buttonInvalid: 'popup__button_invalid'
});
form1.enableValidation()


form2 = new FormValidation({
    form: '.popup__form[name="user"]',
    button: '.popup__button',
    buttonValid: 'popup__button_valid',
    buttonInvalid: 'popup__button_invalid',
    password: '.popup__input[name="password"]',
    passwordConfirm: '.popup__input[name="password_confirm"]'
});
form2.enableValidation();
