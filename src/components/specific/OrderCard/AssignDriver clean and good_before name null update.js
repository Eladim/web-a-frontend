import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './AssignDriver.module.css';

const AssignDriver = ({ drivers = [], onAssignDriver }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); // Add state to control save button

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDriverSelection = (driverId) => {
    setSelectedDriverId(driverId);
  };

  const handleAssign = () => {
    const selectedDriver = drivers.find(driver => driver.id === selectedDriverId);
    if (selectedDriver) {
      selectedDriver.status = 'on_the_road';
      onAssignDriver(selectedDriver);
      closeModal();
    } else {
      console.error('No driver selected');
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Update the isSaveDisabled state based on selected driver's status
  useEffect(() => {
    const selectedDriver = drivers.find(driver => driver.id === selectedDriverId);
    if (selectedDriver && selectedDriver.status === 'unavailable') {
      setIsSaveDisabled(true);
    } else {
      setIsSaveDisabled(false);
    }
  }, [selectedDriverId, drivers]);

  // Filter drivers based on search term and status
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearchTerm = driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showAll || driver.status === 'idle';
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <div>
      {/* Use FontAwesomeIcon instead of button with text */}
      <FontAwesomeIcon
        icon={faEdit}
        className={styles.assignButtonIcon}  // Apply a CSS class if needed
        onClick={(e) => {
          e.stopPropagation(); // Stop the event from propagating
          openModal(); // Call the openModal function
        }}
      />

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Select a Driver</h2>
            <input
              type="text"
              placeholder="Search for a driver..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <div className={styles.toggleContainer}>
              <span>Show All</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={handleToggleShowAll}
                  className={styles.toggleInput}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <ul className={styles.driverList}>
              {filteredDrivers.map(driver => (
                <li
                  key={driver.id}
                  className={`${styles.driverItem} ${selectedDriverId === driver.id ? styles.selected : ''}`}
                  onClick={() => handleDriverSelection(driver.id)}
                >
                  <label className={styles.driverLabel}>
                    <div className={styles.driverInfo}>
                      <span className={styles.driverName}>{driver.driver_name}</span>
                      <div>
                        <span className={styles.driverStatus}>{driver.current_area}</span>
                      </div>
                      {/* Status Indicator */}
                      <span className={`${styles.statusSignal} ${styles['status-' + driver.status]}`}></span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <button onClick={closeModal} className={styles.closeButton}>
                Cancel
              </button>
              <button onClick={handleAssign} className={styles.saveButton} disabled={isSaveDisabled}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignDriver;
