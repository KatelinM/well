import validate from 'validate.js';

const fieldSelector = '.js-form-field';
const inputSelector = '.contact-form__input';

function showErrors(field, errors) {
	if (field) {
		const input = field.querySelector(inputSelector);
		const name = input.getAttribute('name');
		const inputErrors = errors[name] || [];
		let errorsContainer = field.querySelector('.contact-form__errors');

		if (!errorsContainer) {
			errorsContainer = document.createElement('div');
			errorsContainer.className = 'contact-form__errors';
			field.appendChild(errorsContainer);
		}

		errorsContainer.innerHTML = '';

		inputErrors.forEach(error => {
			errorsContainer.innerHTML += `<div class="contact-form__error">${error}</div>`;
		});
	}
}

function generateConstraints(form) {
	const fields = form.querySelectorAll(fieldSelector);
	const constraints = {};

	[].forEach.call(fields, field => {
		const input = field.querySelector(inputSelector);

		const type = input.getAttribute('type');
		const name = input.getAttribute('name');
		const isRequired = input.hasAttribute('required');

		switch (type) {
			case 'checkbox':
				constraints[name] = {
					inclusion: {
						within: [isRequired],
						message: '^You need to accept Terms and Conditions'
					}
				};
				break;
			case 'text':
				constraints[name] = {
					presence: isRequired ? {message: 'is required'} : false
				};
				break;
			case 'email':
				constraints[name] = {
					presence: isRequired ? {message: 'is required'} : false,
					email: {message: 'is invalid'}
				};
				break;
			default:
				constraints[name] = {
					presence: isRequired ? {message: 'is required'} : false
				};
		}
	});

	return constraints;
}

function addListeners(form, constraints) {
	const fields = form.querySelectorAll(fieldSelector);

	[].forEach.call(fields, field => {
		field.addEventListener('input', () => {
			const errors = validate(form, constraints) || {};

			showErrors(field, errors);
		});
	});
}

export default function addValidation(form) {
	form.noValidate = true;
	const constraints = generateConstraints(form);

	const fields = form.querySelectorAll(fieldSelector);

	addListeners(form, constraints);

	form.addEventListener('submit', event => {
		event.preventDefault();
		event.stopPropagation();
		const headers = {};
		const formData = new FormData(form);

		console.log(formData);

		const errors = validate(form, constraints) || {};

		[].forEach.call(fields, field => {
			showErrors(field, errors);
		});

		if (Object.keys(errors).length === 0) {
			const formContainer = form.parentNode;

			fetch(form.action, {
				method: 'POST',
				headers,
				body: formData,
				mode: 'no-cors'
			})
				.then(() => {
					formContainer.innerHTML =
						'<div class="contact-form__response">Thank you for your request!</div>';
				})
				.catch(() => {
					formContainer.innerHTML =
						'<div class="contact-form__response">Something went wrong</div>';
				});
			formContainer.innerHTML = '<div class="contact-form__spinner"></div>';
		}
		return false;
	});
}
