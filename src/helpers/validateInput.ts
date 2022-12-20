const validateInput = (email: string, password: string) => {
  if (!email || !password || password.length < 6) return false;
  return true;
};
export default validateInput;
