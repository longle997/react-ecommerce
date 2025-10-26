// The Popup Modal Component
export default function Popup({ show, closePopup, children }) {
  // Styles
  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // overlay background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const popupStyles = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  };
  console.log("==================show====================", show);
  if (!show) return null; // Don't render if 'show' is false

  return (
    <div style={overlayStyles}>
      <div style={popupStyles}>
        {children}
        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}
