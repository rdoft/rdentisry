const errorHandler = (error) => {
  let code = 500;
  let message = "";

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400:
        code = 400;
        message = error.response.data.message;
        break;
      case 401:
        code = 401;
        message = "Oturumunuzun süresi doldu, lütfen tekrar giriş yapınız";
        break;
      case 403:
        code = 403;
        message = "Erişim reddedildi";
        break;
      case 404:
        code = 404;
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

  return { code, message };
};

export default errorHandler;
