import React, { useState } from 'react';
import styles from './AssignDriver.module.css';

const AssignDriver = ({ onAssignDriver }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(true);  // State for "Show All" toggle

  const drivers = [
    { id: 1, name: 'Driver 1', status: 'available', region: 'In a region', profileImage: 'driver1.jpg' },
    { id: 2, name: 'Driver 2', status: 'busy', region: '', profileImage: 'driver2.jpg' },
    { id: 3, name: 'Driver 3', status: 'offline', region: '', profileImage: 'driver3.jpg' },
    { id: 4, name: 'Driver 4', status: 'available', region: '', profileImage: 'driver4.jpg' },
    { id: 5, name: 'Driver 5', status: 'available', region: '', profileImage: 'driver4.jpg' },
    { id: 6, name: 'Driver 6', status: 'available', region: 'In a region', profileImage: 'driver1.jpg' },
    { id: 7, name: 'Driver 7', status: 'busy', region: '', profileImage: 'driver2.jpg' },
    { id: 8, name: 'Driver 8', status: 'offline', region: '', profileImage: 'driver3.jpg' },
    { id: 9, name: 'Driver 9', status: 'available', region: '', profileImage: 'driver4.jpg' },
    { id: 10, name: 'Driver 10', status: 'available', region: '', profileImage: 'driver4.jpg' },
  ];

  const openModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(false);
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleDriverSelection = (driverId) => {
    setSelectedDriverId(driverId);
  };

  const handleAssign = () => {
    const selectedDriver = drivers.find(driver => driver.id === selectedDriverId);
    onAssignDriver(selectedDriver);
    closeModal();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ensure the selected driver is always visible
  const displayedDrivers = showAll ? drivers : filteredDrivers;
  if (selectedDriverId && !showAll) {
    const selectedDriver = drivers.find(driver => driver.id === selectedDriverId);
    if (selectedDriver && !filteredDrivers.includes(selectedDriver)) {
      displayedDrivers.push(selectedDriver);
    }
  }

  return (
    <div>
      <button className={styles.assignButton} onClick={openModal}>
        Assign Driver
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={handleModalClick}>
            <h2>Select a Driver</h2>
            <input
              type="text"
              placeholder="Search driver..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <div className={styles.toggleContainer}>
              <span>Show All </span>
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
              {displayedDrivers.map(driver => (
                <li 
                  key={driver.id} 
                  className={`${styles.driverItem} ${selectedDriverId === driver.id ? styles.selected : ''}`}
                  onClick={() => handleDriverSelection(driver.id)}
                >
                  <label className={styles.driverLabel}>
                    <img src={driver.profileImage} alt={`${driver.name}`} className={styles.profileImage} />
                    <div className={styles.driverInfo}>
                      <span className={styles.driverName}>{driver.name}</span>
                      <div>
                        <span className={styles.driverStatus}>{driver.region}</span>
                      </div>
                    </div>
                    <span className={`${styles.statusSignal} ${styles['status-' + driver.status]}`}></span>
                  </label>
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <button onClick={closeModal} className={styles.closeButton}>
                Cancel
              </button>
              <button onClick={handleAssign} className={styles.saveButton}>
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
