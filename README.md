# antd-console

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



#  表单验证 

https://github.com/yiminghe/async-validator#type

#### Type

Indicates the `type` of validator to use. Recognised type values are:

- `string`: Must be of type `string`. `This is the default type.`
- `number`: Must be of type `number`.
- `boolean`: Must be of type `boolean`.
- `method`: Must be of type `function`.
- `regexp`: Must be an instance of `RegExp` or a string that does not generate an exception when creating a new `RegExp`.
- `integer`: Must be of type `number` and an integer.
- `float`: Must be of type `number` and a floating point number.
- `array`: Must be an array as determined by `Array.isArray`.
- `object`: Must be of type `object` and not `Array.isArray`.
- `enum`: Value must exist in the `enum`.
- `date`: Value must be valid as determined by `Date`
- `url`: Must be of type `url`.
- `hex`: Must be of type `hex`.
- `email`: Must be of type `email`.
- `any`: Can be any type.

#### 

#### Required

The `required` rule property indicates that the field must exist on the source object being validated.

#### 

#### Pattern

The `pattern` rule property indicates a regular expression that the value must match to pass validation.

#### 

#### Range

A range is defined using the `min` and `max` properties. For `string` and `array` types comparison is performed against the `length`, for `number` types the number must not be less than `min` nor greater than `max`.

#### 

#### Length

To validate an exact length of a field specify the `len` property. For `string` and `array` types comparison is performed on the `length` property, for the `number` type this property indicates an exact match for the `number`, ie, it may only be strictly equal to `len`.

If the `len` property is combined with the `min` and `max` range properties, `len` takes precedence.