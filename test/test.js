let T = require("../index.js");
let { test } = require("./test_util.js");

class MyClass {
    prop = true;
    func() {}
    static static_func() {}
}
const instance = new MyClass();

test(T.check("Hello World!", T.Defined));
test(T.check(null, T.Defined));
test(!T.check(undefined, T.Defined));

test(T.check(undefined, T.Undefined));

test(T.check(42, Number));
test(T.check("John", String));
// `instance` is instace of `MyClass` not `Array`
test(!T.check(instance, Array));

test(T.check("", T.Empty));
test(T.check(null, T.Empty));
test(T.check([], T.Empty));
test(T.check(undefined, T.Empty));
test(!T.check(" ", T.Empty)); // " " is not empty

test(T.check(new TypeError("err"), T.instance_of(Error)));

// an array as type means `check if any type in array is ok`
test(T.check(null, T.either(Number, null)));
test(!T.check("John", T.either(Number, null))); // "John" is a `string` not a `number` or `null`

test(T.check(null, T.not(String))); // null is `null` which is not a `string`
test(!T.check(null, T.not(null)));

// `not` and array as type combined
test(T.check(true, T.not(T.either(null, Number))));
test(!T.check(null, T.not(T.either(null, Number))));


test(T.check([1,2,3,4], T.array_of(Number)));
test(!T.check([1,2,"x"], T.array_of(Number))); // "x" is not a `number`

// `array_of` and array as type combined
test(T.check([1,2,"x"], T.array_of(T.either(Number, String))));
test(!T.check([1,2,[4] ], T.array_of(T.either(Number, String)))); // [4] is not a `number` or `string`

test(T.check("hello world", T.not(T.array_of(Number))));
test(!T.check([1,2,3], T.not(T.array_of(Number))));

test(T.check([[1,2],[4,5]], T.array_of(T.array_of(Number))));
test(!T.check([[1,2],["x"]], T.array_of(T.array_of(Number))));

test(T.check([[1,2],["x"]], T.array_of(T.array_of(T.either(Number, String)))));

test(T.check([1,"x",["y"],true,NaN], T.array_of(T.not(RegExp))));
test(!T.check([1,"x",["y"],true,NaN], T.array_of(T.not(String))));

test(T.check([1,"x",["y"],true,NaN], T.array_of(T.not(T.either(RegExp, Date)))));
test(!T.check([1,"x",["y"],true,NaN], T.array_of(T.not(T.either(String, Date)))));

let all_num_3 = T.interface([Number, Number, Number]);
let other = T.interface([Number, T.array_of(String), Number]);
let obj_style = T.interface({
    first_name: String,
    last_name: String,
});
let with_rest = T.interface([String, null], Number)
test(T.check([1,2,3], all_num_3));
test(!T.check([1,2,"x"], all_num_3));
test(T.check([1,["x","y"],3], other));
test(!T.check([1,["x",6],3], other));
test(T.check({
    first_name:"John",
    last_name: "Doe",
}, obj_style));
test(!T.check({
    first_name:"John",
    last_name: 66,
}, obj_style));
test(T.check(["x",null,4,5,6], with_rest));
test(T.check(["x",null], with_rest));
test(!T.check(["x",null,4,5,6,"y"], with_rest));
// `rest_type` is undefined but array overflows interface
test(!T.check([1,2,3,4], all_num_3));

test(T.whatis(""), String);
test(T.whatis(32), Number);
test(T.whatis(null), null);
test(T.whatis([3,2,"x"]), Array);
