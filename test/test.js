let { Type: t } = require("../index.js");
let { test } = require("./test_util.js");

class MyClass {
    prop = true;
    func() {}
    static static_func() {}
}
const instance = new MyClass();

test(t.is_string("John"));
test(!t.is_string(42));

test(t.is_number(42));
test(t.is_number(new Number(42)));
test(t.is_number(3/0)); // Infinity
test(t.is_number(0/0)); // NaN
test(!t.is_number("42"));

test(t.is_array(["x", 3, false]));
test(t.is_array(new Array(["x", 3, false])));
test(t.is_array(Array(["x", 3, false])));
test(t.is_array(Array.of(["x", 3, false])));

test(t.is_function( () => {} ));
test(t.is_function(instance.func));
test(t.is_function(MyClass.static_func));

test(t.is_object( { first_name: "John", last_name: "Doe" } ));
test(!t.is_object(instance)); // an instance of `MyClass`
test(!t.is_object(["John", "Doe"])); // an `Array`

test(t.is_null(null));
test(!t.is_null(undefined));

test(t.is_nan(NaN));

test(t.is_empty(""));
test(t.is_empty([]));
test(t.is_empty(undefined));
test(t.is_empty(null));
test(!t.is_empty(0));
test(!t.is_empty(false));

test(t.is_undefined(undefined));

test(t.is_defined("John"));
test(t.is_defined(null));
test(!t.is_defined(undefined));

test(t.is_boolean(false));
test(!t.is_boolean(undefined));

test(t.is_regexp(/.*/g));
test(t.is_regexp(new RegExp(".*", "g")));

test(t.is_error(new Error("err")));
test(t.is_error(new TypeError("err")));

test(t.is_date(new Date));

test(t.is_symbol(Symbol(42)));

// `true` means `is_defined`
test(t.check("Hello World!", true));
test(t.check(null, true));
test(!t.check(undefined, true));

// `false` means `is_undefined`
test(t.check(undefined, false));

test(t.check(42, "number"));
test(t.check("John", "string"));
test(!t.check(instance, Array)); // `instance` is instace of `MyClass` not `Array`

test(t.check("", "empty"));
test(t.check(null, "empty"));
test(t.check([], "empty"));
test(t.check(undefined, "empty"));
test(!t.check(" ", "empty")); // " " is not empty

test(t.check(new TypeError("err"), "error"));

// an array as type means `check if any type in array is ok`
test(t.check(null, ["number", "null"]));
test(!t.check("John", ["number", "null"])); // "John" is a `string` not a `number` or `null`

test(t.check(null, t.not("string"))); // null is `null` which is not a `string`
test(!t.check(null, t.not("null")));

// `not` and array as type combined
test(t.check(true, t.not(["null", "number"])));
test(!t.check(null, t.not(["null", "number"])));

test(t.check([1,2,3,4], t.array_of("number")));
test(!t.check([1,2,"x"], t.array_of("number"))); // "x" is not a `number`

// `array_of` and array as type combined
test(t.check([1,2,"x"], t.array_of(["number", "string"])));
test(!t.check([1,2,[4] ], t.array_of(["number", "string"]))); // [4] is not a `number` or `string`

test(t.check("hello world", t.not(t.array_of("number"))));
test(!t.check([1,2,3], t.not(t.array_of("number"))));

test(t.check([[1,2],[4,5]], t.array_of(t.array_of("number"))));
test(!t.check([[1,2],["x"]], t.array_of(t.array_of("number"))));

test(t.check([[1,2],["x"]], t.array_of(t.array_of(["number", "string"]))));

test(t.check([1,"x",["y"],true,NaN], t.array_of(t.not(RegExp))));
test(!t.check([1,"x",["y"],true,NaN], t.array_of(t.not("string"))));

test(t.check([1,"x",["y"],true,NaN], t.array_of(t.not([RegExp, Date]))));
test(!t.check([1,"x",["y"],true,NaN], t.array_of(t.not(["string", Date]))));

// interface
let all_num_3 = t.interface(["number", "number", "number"]);
let other = t.interface(["number", t.array_of("string"), "number"]);
let obj_style = t.interface({
    first_name: "string",
    last_name: "string",
});
let with_rest = t.interface(["string", "null"], "number")
test(t.check([1,2,3], all_num_3));
test(!t.check([1,2,"x"], all_num_3));
test(t.check([1,["x","y"],3], other));
test(!t.check([1,["x",6],3], other));
test(t.check({
    first_name:"John",
    last_name: "Doe",
}, obj_style));
test(!t.check({
    first_name:"John",
    last_name: 66,
}, obj_style));
test(t.check(["x",null,4,5,6], with_rest));
test(t.check(["x",null], with_rest));
test(!t.check(["x",null,4,5,6,"y"], with_rest));
test(!t.check([1,2,3,4], all_num_3)); // `rest_type` is undefined but array overflows interface

test(t.whatis(""), "string");
test(t.whatis(32), "number");
test(t.whatis(null), "null");
test(t.whatis([3,2,"x"]), Array);
