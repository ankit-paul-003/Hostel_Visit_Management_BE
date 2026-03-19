import yup from "yup"

export const userSchema = yup.object({
    name:yup
    .string()
    .trim()
    .min(3, 'Name is must be at least 3 characters.')
    .required(),
    email:yup
    .string()
    .trim()
    .email('The email is not valid one.')
    .matches(
      /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/,
      'The email must be a valid address (e.g. name@gmail.com).'
    )
    .required(),
    password:yup
    .string()
    .min(4, 'Password must be at least 4 characters.')
    .required()
})

export const validateUser = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body)
        next()
    } catch (err) {
        return res.status(400).json({errors: err.errors})
    }
}