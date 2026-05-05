type ConfirmModalProps = {
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({ onConfirm, onClose }: ConfirmModalProps) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Confirm booking?</h2>

        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}