const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const validations = {
		username: { required: false, datetime: true },
		password: { required: false },
	};

	const data = {
		username: document.querySelector("form #username").value,
		password: document.querySelector("form #password").value,
	};

	console.log(validator(data, validations));
});
