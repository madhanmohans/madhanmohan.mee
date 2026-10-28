// Floating zoom buttons; zoom in/out are omitted when no handler is given
export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onFit,
}: {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit: () => void;
}) {
  return (
    <div className="graph-zoom-controls">
      {onZoomIn && (
        <>
          <button
            className="graph-zoom-btn"
            onClick={onZoomIn}
            title="Zoom in"
            aria-label="Zoom in"
          >
            +
          </button>
          <div className="graph-zoom-divider" />
        </>
      )}
      {onZoomOut && (
        <>
          <button
            className="graph-zoom-btn"
            onClick={onZoomOut}
            title="Zoom out"
            aria-label="Zoom out"
          >
            −
          </button>
          <div className="graph-zoom-divider" />
        </>
      )}
      <button
        className="graph-zoom-btn graph-zoom-fit"
        onClick={onFit}
        title="Fit to view"
        aria-label="Fit to view"
      >
        ⤢
      </button>
    </div>
  );
}
