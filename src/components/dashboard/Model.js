import React, { useState } from "react";
import "./Modal.css"; // Import custom CSS for the modal styling

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App">
      {/* Button to trigger the modal */}
      <button className="btn-primary" onClick={openModal}>
        Launch Demo Modal
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="modal-header">
              <h5 className="modal-title">Modal Title</h5>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">This is the modal body content...</div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button className="btn-primary" onClick={() => alert("Saved!")}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
