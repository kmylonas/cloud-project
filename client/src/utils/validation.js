import Joi from "joi";

export function validateField(name, value, schema){

    const obj = { [name]: value};
    const rule = schema.extract([name])
    const tmpSchema = Joi.object({[name]: rule});
    const {error} = tmpSchema.validate(obj);
    return error ? error.details[0].message : null;

}

export function validateForm(data, schema){
    
    const options = { abortEarly: false };
    const {error} = schema.validate(data, options);
    
    if(!error) return null;

    const tmpErrors = {};
    for (let item of error.details) tmpErrors[item.path[0]] = item.message;
    return tmpErrors;

}