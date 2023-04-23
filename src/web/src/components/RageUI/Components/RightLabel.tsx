import { replaceColors } from '../../../utils/replaceColors';

export const RightLabel = ({ rightLabel }: any) => {
  return (
    <div className="rageui-item-rightlabel">
      <span
        dangerouslySetInnerHTML={{
          __html: replaceColors(rightLabel),
        }}></span>
    </div>
  );
};
