// Находим обе формы в DOM.
const formNew = document.querySelector('.popup__form[name="new"]');
const formUser = document.querySelector('.popup__form[name="user"]')

// Добавляем слушатели на первую форму.
// Слушатель сабмита формы.
formNew.addEventListener('submit', handleFormSubmit);
// Слушатель ввода на полях формы.
formNew.addEventListener('input', function (event) {
    // Поле ввода, на котором произошло изменение.
    const input = event.target;
    // Устанавливаем кастомные тексты ошибок.
    setCustomError(input);
    // Записываем текст ошибок в специальные контейнеры под каждым полем.
    setFieldError(input);
    // Включаем или выключаем кнопку отправки формы.
    setSubmitButtonState(formNew);
});

// Добавляем слушатели на первую форму.
// Слушатель сабмита формы.
formUser.addEventListener('submit', handleFormSubmit);
// Слушатель ввода на полях формы.
formUser.addEventListener('input', function (event) {
    // Поле ввода, на котором произошло изменение.
    const input = event.target;
    // Форма, на которую было повешено событие.
    // Тут можно было бы просто использовать переменную `formUser` из внешнего контекста
    const form = event.currentTarget;
    // Устанавливаем кастомные тексты ошибок.
    setCustomError(input);
    validatePasswordsMatch(formUser);
    // Записываем текст ошибок в специальные контейнеры под каждым полем.
    setFieldError(input);
    // Включаем или выключаем кнопку отправки формы.
    setSubmitButtonState(formUser);
});

/* Функция-коллбэк, обрабатывающая событие отправки формы. */
function handleFormSubmit(event) {
    event.preventDefault();
    // Форма - элемент, на котором было *установлено* событие, поэтому используем `event.currentTarget`.
    const form = event.currentTarget;
    // Если форма валидна, то сбросим её.
    // В любом случае выведем сообщение в консоль.
    const isValid = form.checkValidity();
    if (isValid) {
        console.log('Форма валидна!');
        form.reset();
    } else {
        console.log('Форма НЕ валидна!');
    }
}

/* Функция для копирования текста ошибки из свойства поля ввода в span под ним. */
function setFieldError(field) {
    // span, куда будем класть ошибку, у нас всегда находится сразу после поля ввода.
    // Поэтому простейшим способом его найти в документе будет взять следующий элемент после инпута.
    const span = field.nextElementSibling;
    // Возьмём `validationMessage` из инпута и переложим его в span.
    span.textContent = field.validationMessage;
}

/* Функция для изменения состояния кнопки отправки формы. */
function setSubmitButtonState(form) {
    // Найдём кнопку в форме.
    const button = form.querySelector('.popup__button');
    // Проверим, валидна ли форма?
    const isValid = form.checkValidity(); // Форма валидна в целом или нет?

    if (isValid) {
        // Если форма валидна, атрибут `disabled` и классы ошибок с кнопки нужно снять.
        button.removeAttribute('disabled');
        button.classList.add('popup__button_valid');
        button.classList.remove('popup__button_invalid');
    } else {
        // Если форма НЕ валидно, атрибут `disabled` и классы ошибок на кнопке нужно установить.
        button.setAttribute('disabled', true);
        button.classList.remove('popup__button_valid');
        button.classList.add('popup__button_invalid');
    }
}

/* Функция для установки кастомных текстов ошибок при одной из стандартных ошибок валидации формы. */
function setCustomError(input) {
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
function validatePasswordsMatch(form) {
    // Находим поля ввода пароля.
    const inputPassword = form.querySelector('.popup__input[name="password"]');
    const inputPasswordConfirm = form.querySelector('.popup__input[name="password_confirm"]');

    // Сбрасываем кастомную ошибку.
    inputPasswordConfirm.setCustomValidity('');
    // Если значения в полях не совпадают, покажем текст ошибки.
    if (inputPassword.value !== inputPasswordConfirm.value) {
        inputPasswordConfirm.setCustomValidity('Пароли не совпадают!');
    }
    // Установим ошибку даже если ввод произошёл на первом поле ввода с паролем.
    setFieldError(inputPasswordConfirm);
}
