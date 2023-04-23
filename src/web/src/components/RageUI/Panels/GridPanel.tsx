export const GridPanel = ({
  currentMenu,
  activeItem,
  setDraggingGrid,
}: any) => {
  return (
    <div className="rageui-grid-container">
      <div className="rageui-grid-img">
        <img src="assets/ActionMenu/grid/grid.png" />
        <div className="rageui-grid-circle">
          <div className="rageui-grid-circle-inner">
            <div
              className="rageui-grid-circle-img"
              style={
                {
                  '--x': `${currentMenu.items[activeItem].options.x}`,
                  '--y': `${currentMenu.items[activeItem].options.y}`,
                } as React.CSSProperties
              }
              onMouseDown={() => setDraggingGrid(true)}
              onMouseUp={() => setDraggingGrid(false)}>
              <img
                src="assets/ActionMenu/grid/grid.circle.png"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="rageui-grid-texts">
          <div className="rageui-grid-text up">Up</div>
          <div className="rageui-grid-text down">Down</div>
          <div className="rageui-grid-text left">Left</div>
          <div className="rageui-grid-text right">Right</div>
        </div>
      </div>
    </div>
  );
};
