class TypeIndicator {
    check(value) {
	return true;
    }
}
class Not extends TypeIndicator {
    constructor(type_instance) {
	super();
	this.type_instance = type_instance;
    }
    check(value) {
	return !Type.check(value, this.type_instance);
    }
}
class ArrayOf extends TypeIndicator {
    constructor(type_instance) {
	super();
	this.type_instance = type_instance;
    }
    check(value) {
	if (!value instanceof Array) {
	    return false;
	}
	for (let v of value) {
	    if (!Type.check(v, this.type_instance)) {
		return false;
	    }
	}
	return true;
    }
}
class Interface extends TypeIndicator {
    constructor(type_instance, rest_type) {
	super();
	this.type_instance = type_instance;
	this.rest_type = rest_type;
    }
    check(value) {
	let type = this.type_instance;
	for (let i in type) {
	    if (!Type.check(value[i], type[i])) {
		return false;
	    }
	}
	if (value instanceof Array && value.length > type.length) {
	    if (this.rest_type === undefined) {
		return false;
	    }
	    let rest = value.slice(type.length);
	    if (!Type.check(rest, new ArrayOf(this.rest_type))) {
		return false;
	    }

	}
	return true;
    }
}
class Either extends TypeIndicator {
    constructor(...type_instances) {
	super();
	this.type_instances = type_instances;
    }
    check(value) {
	let types = this.type_instances;
	for (let t of types) {
	    if (Type.check(value, t)) {
		return true;
	    }
	}
	return false;
    }
}
class InstanceOf extends TypeIndicator {
    constructor(type_instance) {
	super();
	this.type_instance = type_instance;
    }
    check(value) {
	return value instanceof this.type_instance;
    }
}
// type_instance: Type
class Type {
    static Any = Symbol("any")
    static Empty = Symbol("empty");
    static Defined = Symbol("defined");
    static Undefined = Symbol("undefined");

    
    static not(type_instance) {
	return new Not(type_instance);
    }
    static array_of(type_instance) {
	return new ArrayOf(type_instance);
    }
    static interface(type_instance, rest_type) {
	return new Interface(type_instance, rest_type);
    }
    static either(...type_instances) {
	return new Either(...type_instances);
    }
    static instance_of(type_instance) {
	return new InstanceOf(type_instance);
    }

    static whatis(value) {
	switch (value) {
	case null:
	    return null;
	    break;
	case undefined:
	    return undefined;
	    break;
	case NaN:
	    return NaN;
	    break;
	}
	return value.constructor;
    }
    
    static check(value, type_instance) {
	switch (type_instance) {
	case Type.Any:
	    return true;
	case Type.Defined:
	    return typeof value !== "undefined";
	case Type.Undefined:
	    return typeof value === "undefined";
	case Type.Empty:
	    return value === ""
		|| value === null
		|| (Array.isArray(value) && value.length === 0)
		|| value === undefined;
	}
	if (type_instance instanceof TypeIndicator) {
	    return type_instance.check(value);
	}
	return Type.whatis(value) === type_instance;
    }
}

module.exports = Type
