const PRICE_URL = process.env.REACT_APP_PRICING_URL;

const handleError = (error) => {
  if (error.name === "CanceledError") {
    return {
      status: 0,
      message: null,
    };
  } else if (!error.response || error.response.status === 500) {
    return {
      status: 500,
      message:
        "Bağlantı hatası! İnternet bağlantınızı kontrol edin ve daha sonra tekrar deneyiniz",
    };
  } else if (error.response.status === 401) {
    // If the status is 401, show a session expired message or redirect to the pricing page
    return {
      status: 401,
      message: "Oturumunuzun süresi doldu, lütfen tekrar giriş yapınız",
    };
  } else if (error.response.status === 402) {
    // If the status is 402, redirect to the pricing page
    window.open(PRICE_URL, "_blank");
    return {
      status: 402,
      message:
        "Mevcut üyeliğiniz bu işlem için yetersizdir. Üyeliğinizi yükselterek daha fazla içeriğe erişebilirsiniz. Daha fazla bilgi için: www.disheki.me/pricing",
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
