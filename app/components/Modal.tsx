interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | null;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, selectedDate }) => {
    if (!isOpen || !selectedDate) return null;
  
    const formattedDate = selectedDate.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
          <div className="py-4 text-left px-6">
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold">Selected Date</p>
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring"
              >
                ✕
              </button>
            </div>
            <div className="text-xl font-semibold">{formattedDate}</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  