const Type = {
	not(value) {
		return {
			TYPE_SECURITY_NOT: true,
			value
		};
	},
	array_of(value) {
		return {
			TYPE_SECURITY_ARRAY_OF: true,
			value
		};
	},
	interface(value) {
		if (value && !value.TYPE_SECURITY_ARRAY_OF && !value.TYPE_SECURITY_NOT && !value.TYPE_SECURITY_INTERFACE) {
			if (this.is_array(value) || this.is_object(value)) {
				return {
					value,
					TYPE_SECURITY_INTERFACE: true
				};
			}
			else {
				console.error(new TypeError("an `interface` prefix can only created from `Array` or `Object`"));
			}
		}
        else {
            console.error(new TypeError("it's impossible to create `interface` from `array_of` or `not` prefixed values."))
        }
	},
	is_string(value) {
		return typeof value === 'string' || value instanceof String;
	},
	is_number(value) {
		return (typeof value === 'number' || value instanceof Number);
	},
	is_array(value) {
		return value && Array.isArray(value);
	},
	is_function(value) {
		return typeof value === 'function';
	},
	is_object(value) {
		return typeof value === 'object' && value.constructor === Object;
	},
	is_null(value) {
		return value === null;
	},
	is_nan(value) {
		return isNaN(value);
	},
	is_empty(value) {
		return value==="" || value===null || (Array.isArray(value) && value.length === 0) || value===undefined;
	},
	is_undefined(value) {
		return typeof value === 'undefined';
	},
	is_defined(value) {
		return typeof value !== 'undefined';
	},
	is_boolean(value) {
		return typeof value === 'boolean';
	},
	is_regexp(value) {
		return value instanceof RegExp;
	},
	is_error(value) {
		return value instanceof Error && typeof value.message !== 'undefined';
	},
	is_date(value) {
		return value instanceof Date;
	},
	is_symbol(value) {
		return typeof value === 'symbol'
	},
	is_custom(value, data_type=true) {
        // `true` means `is_defined` for type
		if (data_type === true) {
			return this.is_defined(value);
		}
        // `false` means `is_undefined` for type
        else if (data_type === false) {
            return this.is_undefined(value);
        }
		else if (data_type === "empty") {
			return this.is_empty(value);
		}
		else if (data_type.TYPE_SECURITY_NOT) {
			return !this.check(value, data_type.value);
		}
		else if (data_type.TYPE_SECURITY_ARRAY_OF) {
			if (!this.is_array(value)) {
				return false;
			}

			for (let v of value) {
				if (!this.check(v, data_type.value)) {
					return false;
				}
			}
			return true;
		}
		else if (data_type.TYPE_SECURITY_INTERFACE) {
			let type = data_type.value;
			for (let i in type) {
				if (!this.check(value[i], type[i])) {
                    return false;
				}
			}
			return true;
		}
		else {
			return this.whatis(value) === data_type;
		}
	},
	whatis(value) {
		if (value === null) {
			return "null";
		}
		else if (typeof value !== "object") {
			return typeof value;
		}
		else if (typeof value === "object") {
			return value.constructor;
		}
	},
	check(value, type) {
		if (type === "any") {
			return true;
		}
		if (this.is_array(type)) {
			for (let t of type) {
				if (this.is_custom(value, t)) {
					return true;
				}
			}
			return false;
		}
		else if (this.is_custom(value, type)) {
			return true;
		}
		return false;
	},
};

module.exports = {
    Type,
}