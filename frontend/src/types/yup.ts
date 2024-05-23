import { MAX_FILE_SIZE, VALID_IMAGE_TYPES } from "@/config/config";
import * as y from "yup";
import { InferType } from "yup";

export const email = y.string().email().required("An email is required");
export const setRequiredStr = (
    msg: string = "This field is required"
): y.StringSchema<string, y.AnyObject, undefined, ""> =>
    y.string().required(msg);
export const optionalStr = y.string().optional().nullable();
export const requiredStr = y.string().required();

export const password = setRequiredStr("A password is required").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,64}$/,
    "Must contain 8-64 characters, 1 uppercase letter, 1 lowercase letter, 1 special sharacter, and 1 number"
);
export const files = y
    .mixed<File>()
    .test("is-file-too-big", "File exceeds 50KB", (file) => {
        let valid = true;
        if (file && file.size > MAX_FILE_SIZE) valid = false;
        return valid;
    })
    .test(
        "is-file-of-correct-type",
        `File is not of supported type: ${VALID_IMAGE_TYPES.toString()}`,
        (file) => {
            let valid = true;
            if (file) {
                const type = file.type.split("/")[1];
                if (!VALID_IMAGE_TYPES.includes(type)) valid = false;
            }
            return valid;
        }
    );

// Thanks to https://stackoverflow.com/questions/61862252/yup-schema-validation-password-and-confirmpassword-doesnt-work password validation
export const RegistrationSchema = y.object().shape({
    firstName: setRequiredStr("A first name is required"),
    lastName: setRequiredStr("A last name is required"),
    email,
    password,
    passwordConfirm: setRequiredStr("Please confirm your passowrd").oneOf(
        [y.ref("password")],
        "Your passwords do not match."
    ),
    files,
    x: optionalStr,
    y: optionalStr,
    width: optionalStr,
    height: optionalStr,
});

export type RegistrationType = InferType<typeof RegistrationSchema>;

export const LoginSchema = y.object().shape({
    email,
    password: setRequiredStr("A password is required"),
});

export const EmailSchema = y.object().shape({
    email,
    body: setRequiredStr("A contact body is required"),
});
