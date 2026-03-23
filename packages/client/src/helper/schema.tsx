const isRequiredErrorMessage = "is required.";
export const emailSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  email: { message: "Doesn't look like email" },
};
export const passwordSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  format: {
    pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}$",
    message:
      " needs at least one numeric digit, uppercase , lowercase letter and special character .",
  },
};
export const confirmPasswordSchema = {
  equality: "password",
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
};
export const commentSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
};
export const catagorySchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
};
export const taskTitleSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  length: { minimum: 4  , maximum: 100},
};
export const requiredSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
};
export const projectNameSchema = {
 presence: { allowEmpty: false, message: isRequiredErrorMessage },
 length: { minimum: 4  , maximum: 50},
};
export const estimationHoursSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  format: {
    pattern: "^([0-9]+):([0-5][0-9]|59)$",
    message: "Doesn't match the required pattern",
  },
};
export const actualHoursSchema = {
  format: {
    pattern: "^([0-9]+):([0-5][0-9]|59)$",
    message: "Doesn't match the required pattern",
  },
};
export const containOnlyAlphabedSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  format: {
    pattern: "[a-zA-Z][a-zA-Z ]*",
    message: "can only contain alphabets.",
  },
}
export const startDateSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
}
export const endDateSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
}
export const projectCodeSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  length: { minimum: 3  , maximum: 20},
}
export const budgetSchema = {
  // presence: { allowEmpty: false, message: isRequiredErrorMessage },
  numericality: {
    // onlyInteger: true,
    greaterThanOrEqualTo: 0,
  }
};
  export const descriptionSchema = {
  length: { minimum:0  , maximum: 250},
};
  export const subTaskDetailsSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  length: { minimum: 10  , maximum: 250},
};
export const permissionSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  length: { minimum: 4  , maximum: 30},
};
export const OrgIdSchema =  {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  length: {
    maximum: 12,
    minimum: 3,
    message: 'length must be more than 3 and less that 12 digit .',
  },
  
}
export const OrNameSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  format: {
      pattern: '[a-zA-Z][a-zA-Z ]*',
      message: 'can only contain alphabets.',
  },
}

export const groupNameSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  length: { minimum: 2, maximum: 30 },
  format: {
    pattern: /^[a-zA-Z0-9 !@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/,
    message: 'can contain alphabets, numbers, special characters, and spaces.',
  },
};


export const groupDescriptionSchema = {
  presence: { allowEmpty: false, message: isRequiredErrorMessage },
  length: { minimum: 7 , maximum: 500},
}
export const addressSchema = {
  length: { minimum: 0 , maximum: 500},
}