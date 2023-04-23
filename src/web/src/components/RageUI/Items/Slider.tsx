export const Slider = (props: any) => {
  return (
    <div
      className="rageui-item-slider-container"
      {...props}>
      <div
        className={`rageui-item-slider ${
          props.item.options?.indicator ? 'indicator' : ''
        }`}
        style={{
          width: `${
            (props.item.options.current / props.item.options.max) * 100
          }%`,
        }}></div>
    </div>
  );
};
