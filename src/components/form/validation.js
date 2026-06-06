// /// validationRules.js

import { message } from "antd";
import dayjs from "dayjs";

// // ==========================
// // REGEX CONSTANTS
// // ==========================
// export const REGEX = {
//   EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

//   PHONE: /^[0-9]{10}$/,

//   PASSWORD:
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

//   ALPHABETS: /^[A-Za-z ]+$/,

//   ALPHANUMERIC: /^[A-Za-z0-9 ]+$/,

//   NUMBER: /^[0-9]+$/,

//   URL: /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/,

//   CANDIDATE_ID: /^[A-Za-z0-9-]+$/,

//   REMARKS: /^[A-Za-z0-9\s.,'"\-()!?/@#$%&]*$/,

//   DESIGNATION: /^[a-zA-Z0-9\s,.\-&()]{2,100}$/,

//   DOB: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,

//   LINKEDIN:
//     /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-_%]+\/?$/i,

//   COMPANY_NAME: /^[A-Za-z0-9\s&.,'()-]+$/,
// };

// // ==========================
// // COMMON VALIDATION MESSAGES
// // ==========================
// export const VALIDATION_MESSAGES = {
//   REQUIRED: (field) => `Mandatory field`,

//   INVALID_EMAIL: "Please enter valid email.",

//   INVALID_PHONE: "Phone number must contain exactly 10 digits.",

//   INVALID_PASSWORD:
//     "Password must contain uppercase, lowercase, number, special character and minimum 8 characters.",

//   INVALID_ALPHABETS: "Only alphabets and spaces are allowed.",

//   INVALID_ALPHANUMERIC:
//     "Only letters, numbers and spaces are allowed.",

//   INVALID_NUMBER: "Only numbers are allowed.",

//   INVALID_URL: "Please enter a valid URL.",

//   INVALID_CANDIDATE_ID:
//     "Candidate ID can contain only letters, numbers and hyphens.",

//   INVALID_REMARKS: "Remarks contain invalid characters.",

//   INVALID_DESIGNATION:
//     "Designation contains invalid characters.",

//   INVALID_DOB: "DOB must be in MM/DD/YYYY format.",

//   INVALID_LINKEDIN:
//     "Please enter a valid LinkedIn URL.",

//   INVALID_COMPANY_NAME:
//     "Company name contains invalid characters.",
// };

// // ==========================
// // COMMON RULE GENERATOR
// // ==========================
// export const validationRules = {
//   required: (fieldName = "Field") => ({
//     required: true,
//     message: VALIDATION_MESSAGES.REQUIRED(fieldName),
//   }),

//   email: () => ({
//     pattern: REGEX.EMAIL,
//     message: VALIDATION_MESSAGES.INVALID_EMAIL,
//   }),

//   phone: () => ({
//     pattern: REGEX.PHONE,
//     message: VALIDATION_MESSAGES.INVALID_PHONE,
//   }),

//   password: () => ({
//     pattern: REGEX.PASSWORD,
//     message: VALIDATION_MESSAGES.INVALID_PASSWORD,
//   }),

//   alphabets: () => ({
//     pattern: REGEX.ALPHABETS,
//     message: VALIDATION_MESSAGES.INVALID_ALPHABETS,
//   }),

//   alphanumeric: () => ({
//     pattern: REGEX.ALPHANUMERIC,
//     message: VALIDATION_MESSAGES.INVALID_ALPHANUMERIC,
//   }),

//   number: () => ({
//     pattern: REGEX.NUMBER,
//     message: VALIDATION_MESSAGES.INVALID_NUMBER,
//   }),

//   url: () => ({
//     pattern: REGEX.URL,
//     message: VALIDATION_MESSAGES.INVALID_URL,
//   }),

//   candidateId: () => ({
//     pattern: REGEX.CANDIDATE_ID,
//     message: VALIDATION_MESSAGES.INVALID_CANDIDATE_ID,
//   }),

//   remarks: () => ({
//     pattern: REGEX.REMARKS,
//     message: VALIDATION_MESSAGES.INVALID_REMARKS,
//   }),

//   designation: () => ({
//     pattern: REGEX.DESIGNATION,
//     message: VALIDATION_MESSAGES.INVALID_DESIGNATION,
//   }),

//   dob: () => ({
//     pattern: REGEX.DOB,
//     message: VALIDATION_MESSAGES.INVALID_DOB,
//   }),

//   linkedin: () => ({
//     pattern: REGEX.LINKEDIN,
//     message: VALIDATION_MESSAGES.INVALID_LINKEDIN,
//   }),

//   companyName: () => ({
//     pattern: REGEX.COMPANY_NAME,
//     message: VALIDATION_MESSAGES.INVALID_COMPANY_NAME,
//   }),
// };




/// validationRules.js

// ==========================
// REGEX CONSTANTS
// ==========================
export const REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z-]*\.[a-zA-Z]{2,}$/,

    PHONE: /^[0-9]{10}$/,

    PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

    ALPHABETS: /^[A-Za-z ]+$/,

    ALPHANUMERIC: /^(?!\s)[A-Za-z0-9 ]+$/,

    NUMBER: /^[0-9]+$/,

    URL: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+(com|org|net|in|co|io|gov|edu)(\/[^\s]*)?$/i,

    CANDIDATE_ID: /^[A-Za-z0-9-]+$/,

    REMARKS: /^[A-Za-z0-9\s.,'"\-()!?/@#$%&]*$/,

    DESIGNATION: /^[a-zA-Z0-9\s,.\-&()]{2,100}$/,

    DOB: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,

    COMPANY_NAME: /^[A-Za-z0-9\s&.,'()-]+$/,

    // First Letter Caps + No Spaces
    FIRST_NAME: /^[A-Z][a-zA-Z]*$/,

    // Capitalize Every Word + No Double Spaces
    FULL_NAME: /^[A-Z][a-zA-Z]*(?: [A-Z][a-zA-Z]*)*$/,

    // No Spaces Allowed
    NO_SPACES: /^\S+$/,

    // Starts With Capital
    STARTS_WITH_CAPITAL: /^[A-Z].*$/,
};
export const FILE_VALIDATION = {
    SINGLE_FILE_COUNT: 1,
    MULTI_FILE_COUNT: 5,

    MAX_FILE_SIZE: 2, // MB

    ALLOWED_FILE_TYPES: [
        "image/jpeg",
        "image/png",
        "application/pdf",
    ],
};
// ==========================
// VALIDATION MESSAGES
// ==========================
export const VALIDATION_MESSAGES = {
    REQUIRED: (field) => `Mandatory Field`,

    INVALID_EMAIL: "Please enter a valid email address.",

    INVALID_PHONE: "Phone number must contain exactly 10 digits.",

    INVALID_PASSWORD:
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters.",

    INVALID_ALPHABETS: "Only alphabets and spaces are allowed.",

    INVALID_ALPHANUMERIC:
        "Only letters, numbers and spaces are allowed.",

    INVALID_NUMBER: "Only numbers are allowed.",

    INVALID_URL: "Please enter a valid URL.",

    INVALID_CANDIDATE_ID: (field) => `${field} can contain only letters, numbers and hyphens.`,

    INVALID_REMARKS: "Remarks contain invalid characters.",

    INVALID_DESIGNATION:
        "Designation contains invalid characters.",

    INVALID_DOB: "DOB must be in MM/DD/YYYY format.",

    INVALID_LINKEDIN:
        "Please enter a valid LinkedIn URL.",

    INVALID_COMPANY_NAME:
        "Company name contains invalid characters.",

    INVALID_FIRST_NAME:
        "First letter must be capital and spaces are not allowed.",

    INVALID_FULL_NAME:
        "Each word must start with a capital letter.",

    NO_SPACES_ALLOWED: "Spaces are not allowed.",

    MUST_START_WITH_CAPITAL:
        "First letter must be capital.",

    INVALID_FILE_TYPE:
        "Only JPG, PNG and PDF files are allowed.",

    INVALID_FILE_SIZE:
        `File upload must be ${FILE_VALIDATION.MAX_FILE_SIZE} MB below.`,

    INVALID_FILE_TYPE:
        "Only JPG, PNG and PDF files are allowed.",

    SINGLE_FILE_ONLY:
        "Only one file can be uploaded.",
};

// ==========================
// COMMON FORMATTERS
// ==========================
export const VALIDATION_LENGTH_NAME = {
    FIRST_NAME_MIN: 3,
    FIRST_NAME_MAX: 30,
};

export const VALIDATION_LENGTH_REMARKS = {
    REMARKS_MIN: 10,
    REMARKS_MAX: 250,
};
export const formatters = {
    // Remove all spaces
    removeSpaces: (value = "") => value.replace(/\s/g, ""),

    // First letter capital
    capitalizeFirstLetter: (value = "") =>
        value.charAt(0).toUpperCase() + value.slice(1),

    // Capitalize every word
    capitalizeWords: (value = "") =>
        value.replace(/\b\w/g, (char) => char.toUpperCase()),

    // Remove extra spaces
    removeExtraSpaces: (value = "") =>
        value.replace(/\s+/g, " ").trim(),

    // First Name Formatter
    firstNameFormatter: (value = "") => {
        return value
            .replace(/\s+/g, " ") // remove extra spaces
            .trimStart() // no starting spaces
            .replace(/\b\w/g, (char) => char.toUpperCase());
    },

    // Full Name Formatter
    fullNameFormatter: (value = "") => {
        return value
            .replace(/\s+/g, " ")
            .trimStart()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    phoneFormatter: (value = "") =>
        value.replace(/\D/g, "").slice(0, 10),

    dobFormatter: (value = "") => {

        // remove non-numeric
        const cleaned = value.replace(/\D/g, "");

        // format DD/MM/YYYY
        if (cleaned.length <= 2) {
            return cleaned;
        }

        if (cleaned.length <= 4) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        }

        return `${cleaned.slice(0, 2)}/${cleaned.slice(
            2,
            4
        )}/${cleaned.slice(4, 8)}`;
    },
};

// ==========================
// COMMON RULE GENERATOR
// ==========================
export const validationRules = {
    required: (fieldName = "Field") => ({
        required: true,
        message: VALIDATION_MESSAGES.REQUIRED(fieldName),
    }),

    email: () => ({
        pattern: REGEX.EMAIL,
        message: VALIDATION_MESSAGES.INVALID_EMAIL,
    }),

    phone: () => ({
        pattern: REGEX.PHONE,
        message: VALIDATION_MESSAGES.INVALID_PHONE,
    }),

    password: () => ({
        pattern: REGEX.PASSWORD,
        message: VALIDATION_MESSAGES.INVALID_PASSWORD,
    }),

    alphabets: () => ({
        pattern: REGEX.ALPHABETS,
        message: VALIDATION_MESSAGES.INVALID_ALPHABETS,
    }),

    alphanumeric: () => ({
        pattern: REGEX.ALPHANUMERIC,
        message: VALIDATION_MESSAGES.INVALID_ALPHANUMERIC,
    }),

    number: () => ({
        pattern: REGEX.NUMBER,
        message: VALIDATION_MESSAGES.INVALID_NUMBER,
    }),

    url: () => ({
        pattern: REGEX.URL,
        message: VALIDATION_MESSAGES.INVALID_URL,
    }),

    // candidateId: () => ({
    //     pattern: REGEX.CANDIDATE_ID,
    //     message: VALIDATION_MESSAGES.INVALID_CANDIDATE_ID,
    // }),
    candidateId: (field = "ID") => ({
        pattern: REGEX.CANDIDATE_ID,
        message:
            VALIDATION_MESSAGES.INVALID_CANDIDATE_ID(
                field
            ),
    }),
    remarks: () => ({
        pattern: REGEX.REMARKS,
        message: VALIDATION_MESSAGES.INVALID_REMARKS,
        REMARKS_MIN:
            `Remarks must be at least ${VALIDATION_LENGTH_REMARKS.REMARKS_MIN} characters.`,
        REMARKS_MAX:
            `Remarks must not exceed ${VALIDATION_LENGTH_REMARKS.REMARKS_MAX} characters.`,
    }),

    designation: () => ({
        pattern: REGEX.DESIGNATION,
        message: VALIDATION_MESSAGES.INVALID_DESIGNATION,
    }),

    dob: (required = true) => ({
        validator: (_, value) => {

            // Required check
            if (!value) {
                return required
                    ? Promise.reject(
                        new Error("Date of Birth is required.")
                    )
                    : Promise.resolve();
            }

            // MM/DD/YYYY regex check
            if (!REGEX.DOB.test(value)) {
                return Promise.reject(
                    new Error(
                        VALIDATION_MESSAGES.INVALID_DOB
                    )
                );
            }

            // Strict date validation
            const dob = dayjs(
                value,
                "MM/DD/YYYY",
                true
            );

            if (!dob.isValid()) {
                return Promise.reject(
                    new Error(
                        VALIDATION_MESSAGES.INVALID_DOB
                    )
                );
            }

            // Future date validation
            const today = dayjs().endOf("day");

            if (dob.isAfter(today)) {
                return Promise.reject(
                    new Error(
                        "Date of Birth cannot be a future date."
                    )
                );
            }

            // Age validation
            const age = today.diff(dob, "year");

            if (age < 21) {
                return Promise.reject(
                    new Error(
                        "Age must be at least 21 years."
                    )
                );
            }

            return Promise.resolve();
        },
    }),

    linkedin: () => ({
        pattern: REGEX.LINKEDIN,
        message: VALIDATION_MESSAGES.INVALID_LINKEDIN,
    }),

    companyName: () => ({
        pattern: REGEX.COMPANY_NAME,
        message: VALIDATION_MESSAGES.INVALID_COMPANY_NAME,
    }),

    firstName: () => ({
        pattern: REGEX.FIRST_NAME,
        message: VALIDATION_MESSAGES.INVALID_FIRST_NAME,
        FIRST_NAME_MIN:
            `First Name must be at least ${VALIDATION_LENGTH_NAME.FIRST_NAME_MIN} characters.`,
        FIRST_NAME_MAX:
            `First Name must not exceed ${VALIDATION_LENGTH_NAME.FIRST_NAME_MAX} characters.`,
    }),
    firstNameMinLength: () => ({
        min: VALIDATION_LENGTH_NAME.FIRST_NAME_MIN,
        message: VALIDATION_MESSAGES.FIRST_NAME_MIN,
    }),

    firstNameMaxLength: () => ({
        max: VALIDATION_LENGTH_NAME.FIRST_NAME_MAX,
        message: VALIDATION_MESSAGES.FIRST_NAME_MAX,
    }),

    remarksMinLength: () => ({
        min: VALIDATION_LENGTH_REMARKS.REMARKS_MIN,
        message: VALIDATION_MESSAGES.REMARKS_MIN,
    }),

    remarksMaxLength: () => ({
        max: VALIDATION_LENGTH_REMARKS.REMARKS_MAX,
        message: VALIDATION_MESSAGES.REMARKS_MAX,
    }),
    fullName: () => ({
        pattern: REGEX.FULL_NAME,
        message: VALIDATION_MESSAGES.INVALID_FULL_NAME,
    }),

    noSpaces: () => ({
        pattern: REGEX.NO_SPACES,
        message: VALIDATION_MESSAGES.NO_SPACES_ALLOWED,
    }),

    startsWithCapital: () => ({
        pattern: REGEX.STARTS_WITH_CAPITAL,
        message: VALIDATION_MESSAGES.MUST_START_WITH_CAPITAL,
    }),
    fileUpload: () => ({
        validator: (_, fileList) => {

            if (!fileList || fileList.length === 0) {
                return Promise.resolve();
            }

            for (let fileObj of fileList) {

                const file =
                    fileObj.originFileObj || fileObj;

                // File size validation
                const isValidSize =
                    file.size / 1024 / 1024 <=
                    FILE_VALIDATION.MAX_FILE_SIZE;

                if (!isValidSize) {

                    message.error(
                        VALIDATION_MESSAGES.INVALID_FILE_SIZE
                    );

                    return Promise.reject(
                        new Error(
                            VALIDATION_MESSAGES.INVALID_FILE_SIZE
                        )
                    );
                }

                // File type validation
                const isValidType =
                    FILE_VALIDATION.ALLOWED_FILE_TYPES.includes(
                        file.type
                    );

                if (!isValidType) {
                    return Promise.reject(
                        new Error(
                            VALIDATION_MESSAGES.INVALID_FILE_TYPE
                        )
                    );
                }
            }

            return Promise.resolve();
        },
    }),
    singleFileUpload: () => ({
        validator: (_, fileList) => {

            if (!fileList || fileList.length === 0) {
                return Promise.resolve();
            }

            // Single file check
            if (
                fileList.length >
                FILE_VALIDATION.SINGLE_FILE_COUNT
            ) {
                return Promise.reject(
                    new Error(
                        VALIDATION_MESSAGES.SINGLE_FILE_ONLY
                    )
                );
            }

            const file = fileList[0];

            // File size validation
            const isValidSize =
                file.size / 1024 / 1024 <
                FILE_VALIDATION.MAX_FILE_SIZE;

            if (!isValidSize) {
                return Promise.reject(
                    new Error(
                        VALIDATION_MESSAGES.INVALID_FILE_SIZE
                    )
                );
            }

            // File type validation
            const isValidType =
                FILE_VALIDATION.ALLOWED_FILE_TYPES.includes(
                    file.type
                );

            if (!isValidType) {
                return Promise.reject(
                    new Error(
                        VALIDATION_MESSAGES.INVALID_FILE_TYPE
                    )
                );
            }

            return Promise.resolve();
        },
    }),

    // Multiple File Upload
    multiFileUpload: () => ({
        validator: (_, fileList) => {

            if (!fileList || fileList.length === 0) {
                return Promise.resolve();
            }

            // File count validation
            if (
                fileList.length >
                FILE_VALIDATION.MULTI_FILE_COUNT
            ) {
                return Promise.reject(
                    new Error(
                        VALIDATION_MESSAGES.INVALID_FILE_COUNT
                    )
                );
            }

            for (let file of fileList) {

                // File size validation
                const isValidSize =
                    file.size / 1024 / 1024 <
                    FILE_VALIDATION.MAX_FILE_SIZE;

                if (!isValidSize) {
                    return Promise.reject(
                        new Error(
                            VALIDATION_MESSAGES.INVALID_FILE_SIZE
                        )
                    );
                }

                // File type validation
                const isValidType =
                    FILE_VALIDATION.ALLOWED_FILE_TYPES.includes(
                        file.type
                    );

                if (!isValidType) {
                    return Promise.reject(
                        new Error(
                            VALIDATION_MESSAGES.INVALID_FILE_TYPE
                        )
                    );
                }
            }

            return Promise.resolve();
        },
    }),
};
