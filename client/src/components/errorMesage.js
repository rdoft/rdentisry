export const toastErrorMessage = (error) => {
  let message = "";

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400:
        message = error.response.data.message;
        break;
      case 401:
        message = "Lütfen oturum açınız";
        break;
      case 403:
        message = "Erişim reddedildi";
        break;
      case 404:
        message = error.response.data.message;
        break;
      default:
        message = "Bağlantı hatası, daha sonra yeniden deneyiniz";
        break;
    }
  } else {
    // The request was made but no response was received
    message = "Sunucuya bağlanılamadı, daha sonra tekrar deneyiniz";
  }

  return message;
};
