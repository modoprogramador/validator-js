function validator(data, validations) {
	let error = {};
	const messages = {
		required: `Este campo é obrigatório.`,
		length: `Preencha exatamente [{var}] caractéres.`,
		min_length: `Preencha no mínimo [{var}] caractéres.`,
		max_length: `Preencha no máximo [{var}] caractéres.`,
		value: `O valor deve ser exatamente [{var}].`,
		min_value: `O valor deve ser no mínimo [{var}].`,
		max_value: `O valor deve ser no máximo [{var}].`,
		enum: `O valor deve ser uma das opções a seguir: [{var}]`,
		date: {
			format: `O formato da data deve ser [dd/mm/aaaa].`,
			day: `O dia deve ser entre [01-31].`,
			month: `O mês deve ser entre [01-12].`,
			february: `Fevereiro deve ter entre [01-29] dias.`,
			year: `O ano deve ser no mínimo [1900]`,
		},
		time: {
			format: `O formato do tempo deve ser [hh:mm]`,
			hour: `A hora deve estar entre [00-23]`,
			minute: `O minuto deve estar entre [00-59]`,
		},
		datetime: {
			format: `O formato da data&tempo deve ser [dd/mm/aaaa hh:aa].`,
		},
	};
	let methods = {
		required: (_field, _validations) => {
			if (!_validations.required) return;

			if (data[_field].trim().length <= 0) error = { ...error, [_field]: [...(error[_field] || []), messages.required] };
		},
		length: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (data[_field].trim().length != _validations.length)
				error = { ...error, [_field]: [...(error[_field] || []), messages.length.replace("{var}", _validations.length)] };
		},
		min_length: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (data[_field].trim().length < _validations.min_length)
				error = { ...error, [_field]: [...(error[_field] || []), messages.min_length.replace("{var}", _validations.min_length)] };
		},
		max_length: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (data[_field].trim().length > _validations.max_length)
				error = { ...error, [_field]: [...(error[_field] || []), messages.max_length.replace("{var}", _validations.max_length)] };
		},
		value: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (isNaN(data[_field]) || data[_field] != _validations.value)
				error = { ...error, [_field]: [...(error[_field] || []), messages.value.replace("{var}", _validations.value)] };
		},
		min_value: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (isNaN(data[_field]) || data[_field] < _validations.min_value)
				error = { ...error, [_field]: [...(error[_field] || []), messages.min_value.replace("{var}", _validations.min_value)] };
		},
		max_value: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (isNaN(data[_field]) || data[_field] > _validations.max_value)
				error = { ...error, [_field]: [...(error[_field] || []), messages.max_value.replace("{var}", _validations.max_value)] };
		},
		enum: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			const founded = _validations.enum.find((value) => value == data[_field]);

			if (!founded) error = { ...error, [_field]: [...(error[_field] || []), messages.enum.replace("{var}", _validations.enum.join(" ou "))] };
		},
		date: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (data[_field].trim().length != 10) return (error = { ...error, [_field]: [...(error[_field] || []), messages.date.format] });

			let date = data[_field].replaceAll("-", "/").split("/");
			date = date[0].length == 4 ? date.reverse() : date;

			if (date.length != 3 || isNaN(date[0]) || isNaN(date[1]) || isNaN(date[2]))
				return (error = { ...error, [_field]: [...(error[_field] || []), messages.date.format] });

			if (date[0].length != 2 || date[1].length != 2 || date[2].length != 4)
				return (error = { ...error, [_field]: [...(error[_field] || []), messages.date.format] });

			date[0] *= 1;
			date[1] *= 1;
			date[2] *= 1;

			if (date[0] < 1 || date[0] > 31) return (error = { ...error, [_field]: [...(error[_field] || []), messages.date.day] });

			if (date[1] < 1 || date[1] > 12) return (error = { ...error, [_field]: [...(error[_field] || []), messages.date.month] });

			if (date[1] == 2 && date[0] > 29) return (error = { ...error, [_field]: [...(error[_field] || []), messages.date.february] });

			if (date[2] < 1900) return (error = { ...error, [_field]: [...(error[_field] || []), messages.date.year] });
		},
		time: (_field, _validations) => {
			if (!_validations.required && data[_field].trim().length <= 0) return;

			if (data[_field].trim().length != 5) return (error = { ...error, [_field]: [...(error[_field] || []), messages.time.format] });

			let time = data[_field].split(":");

			if (time.length != 2 || isNaN(time[0]) || isNaN(time[1])) return (error = { ...error, [_field]: [...(error[_field] || []), messages.time.format] });

			if (time[0].length != 2 || time[1].length != 2) return (error = { ...error, [_field]: [...(error[_field] || []), messages.time.format] });

			time[0] *= 1;
			time[1] *= 1;

			if (time[0] < 0 || time[0] > 23) return (error = { ...error, [_field]: [...(error[_field] || []), messages.time.hour] });

			if (time[1] < 0 || time[1] > 59) return (error = { ...error, [_field]: [...(error[_field] || []), messages.time.minute] });
		},
	};

	methods.datetime = (_field, _validations) => {
		if (!_validations.required && data[_field].trim().length <= 0) return;

		if (data[_field].trim().length != 16) return (error = { ...error, [_field]: [...(error[_field] || []), messages.datetime.format] });

		let datetime = data[_field].replaceAll("T", " ").split(" ");

		data[_field] = datetime[0];
		methods.date(_field, _validations), (data[_field] = datetime[1]);
		methods.time(_field, _validations);
	};

	function validate() {
		Object.keys(validations).forEach((field) => {
			Object.keys(validations[field]).forEach((method) => {
				if (method in methods) methods[method](field, validations[field]);
			});
		});

		return Object.keys(error).length > 0 ? error : false;
	}

	return validate();
}
