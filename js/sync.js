// [cite: 152-155, 277-282, 372-375]
const generateSupplierID = (cityCode) => {
    const serial = Math.floor(Math.random() * 1000000);
    return `SUP-${cityCode}-${serial.toString().padStart(6, '0')}`;
};

// [cite: 216-219, 470-474]
const submissionMetadata = {
    staffUID: currentUser.uid,
    deviceID: navigator.userAgent,
    timestamp: Date.now(),
    verificationStatus: 'pending' // [cite: 66, 113, 124]
};
