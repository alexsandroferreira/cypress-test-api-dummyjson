
import Ajv from "ajv";

export function validateSchema(schema, data) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  return {
    valid,
    errors: validate.errors || []
  };
}
