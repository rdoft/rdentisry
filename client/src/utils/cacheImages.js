const cacheImages = async (srcList) => {
  const promises = srcList.map((src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = resolve;
      image.onerror = reject;
    });
  });

  await Promise.all(promises);
};

export default cacheImages;
