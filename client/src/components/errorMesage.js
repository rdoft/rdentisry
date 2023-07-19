export const toastErrorMessage = (error) =>
  error.response?.status < 500
    ? error.response.data.message
    : "Bağlantı hatası, bir süre sonra yeniden deneyiniz";
