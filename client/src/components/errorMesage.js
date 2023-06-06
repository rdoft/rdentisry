export const toastErrorMessage = (error) =>
  error.response?.status < 500
    ? error.response.data
    : "Bağlantı hatası, bir süre sonra yeniden deneyiniz";
