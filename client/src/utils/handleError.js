const PRICE_URL = `https://disheki.me/pricing`;

const handleError = (error) => {
  if (!error.response || error.response.status === 500) {
    return {
      status: 500,
      message: "Sunucuya bağlanılamadı, daha sonra tekrar deneyiniz",
    };
  } else if (error.response.status === 401) {
    return {
      status: 401,
      message: "Oturumunuzun süresi doldu, lütfen tekrar giriş yapınız",
    };
  } else if (error.response.status === 402) {
    window.open(PRICE_URL, "_blank");
    return {
      status: 402,
      message: null,
    };
  } else if (error.response.status === 403) {
    return {
      status: 403,
      message: "Erişim reddedildi",
    };
  } else if (error.response.status === 404) {
    return {
      status: 404,
      message: error.response.data.message,
    };
  } else if (error.response.status === 400) {
    return {
      status: 400,
      message: error.response.data.message,
    };
  } else {
    return {
      status: 500,
      message: "Bilinmeyen bir hata oluştu, daha sonra tekrar deneyiniz",
    };
  }
};

export default handleError;
