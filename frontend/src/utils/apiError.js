export const getApiErrorMessage = (error, fallback = 'Request failed') => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

export const alertApiError = (error, fallback) => {
  const message = getApiErrorMessage(error, fallback);
  if (typeof window !== 'undefined') {
    window.alert(message);
  }
  return message;
};

