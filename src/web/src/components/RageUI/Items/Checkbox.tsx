export const Checkbox = ({ item }: any) => {
  return (
    <div className="rageui-checkbox">
      {item.options.checked ? (
        <img
          src={`assets/ActionMenu/icons/commonmenu/shop_box_${
            item.options.style || 'tick'
          }.png`}
        />
      ) : (
        <img src="assets/ActionMenu/icons/commonmenu/shop_box_blank.png" />
      )}
    </div>
  );
};
