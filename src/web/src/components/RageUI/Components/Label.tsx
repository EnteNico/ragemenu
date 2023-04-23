import { replaceColors } from '../../../utils/replaceColors';

export const Label = ({ label }: any) => {
  return (
    <div className="rageui-item-label">
      <span
        dangerouslySetInnerHTML={{
          __html: replaceColors(label),
        }}></span>
    </div>
  );
};
