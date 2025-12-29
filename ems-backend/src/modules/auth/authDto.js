export const validateRegister = ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error('Name, email, password required');
  }
};

export const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password required');
  }
};
