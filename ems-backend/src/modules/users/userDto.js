export const validateUpdateProfile = ({ name }) => {
  if (!name) {
    throw new Error('Name is required');
  }
};
