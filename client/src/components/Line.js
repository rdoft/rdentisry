const Line = ({
  title,
  data,
  titleFont = "semibold",
  titleWidth = "40",
  titleColor,
  dataFont,
  dataColor,
  centered,
  titleTextSize,
  dataTextSize,
  minWidth,
  itemsPosition = "center",
}) => {
  return (
    <div
      className={`d-flex justify-content-${centered ? "center" : "start"} align-items-${itemsPosition}`}
    >
      <span
        style={{ color: titleColor, width: `${titleWidth}%`, minWidth }}
        className={`font-${titleFont} flex-grow-1 flex-shrink-0 text-${titleColor} text-${titleTextSize}`}
      >
        {title}
      </span>
      <span
        className={`font-${titleFont} flex-grow-1 flex-shrink-0 text-${titleTextSize}`}
      >
        :
      </span>
      <span
        style={{ color: dataColor }}
        className={`pl-2 font-${dataFont} flex-shrink-1 text-${dataColor} text-${dataTextSize}`}
      >
        {data}
      </span>
    </div>
  );
};

export default Line;
