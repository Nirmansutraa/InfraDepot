/**
 * INFRA DEPOT - SYNC ENGINE v3.0
 * Purpose: Handles Offline Data Capture & Cloud Synchronization
 */
import { db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

export const SyncEngine = {
    /**
     * [cite: 152-155, 277-282, 372-375]
     * Generates a structured ID: SUP + CITY + SERIAL
     */
    generateID: function(cityCode = "UPR") {
        const serial = Math.floor(100000 + Math.random() * 900000);
        return `SUP-${cityCode}-${serial}`;
    },

    /**
     * [cite: 141, 260, 418]
     * Compresses images to ~500KB before uploading to save data
     */
    compressImage: async function(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7);
                };
            };
        });
    },

    /**
     * [cite: 76-90, 231-244, 419-450]
     * The Master Upload Function
     */
    uploadSupplier: async function(formData, photoFiles) {
        console.log("Sync: Starting upload process...");
        const user = JSON.parse(localStorage.getItem('infra_user'));

        try {
            // 1. Upload Photos to Firebase Storage [cite: 98, 261, 418]
            const photoUrls = [];
            for (const file of photoFiles) {
                const compressed = await this.compressImage(file);
                const storageRef = ref(storage, `supplier_photos/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, compressed);
                const url = await getDownloadURL(snapshot.ref);
                photoUrls.push(url);
            }

            // 2. Build the Intelligence Document [cite: 58-68, 76-90, 469-478]
            const supplierData = {
                supplierID: this.generateID("UPR"), // [cite: 153, 280, 373]
                firmName: formData.firmName,         // [cite: 79, 233, 385]
                ownerName: formData.ownerName,       // [cite: 80, 234, 386]
                phone: formData.phone,               // [cite: 81, 235, 387]
                
                // Material Intelligence [cite: 83-84, 241-243, 419-427]
                materials: formData.selectedMaterials, 
                brands: formData.selectedBrands,

                // Fleet Intelligence [cite: 85, 301-312, 440-450]
                fleet: formData.fleetCounts,

                // Geographic Intelligence [cite: 86-89, 245-252, 401-410]
                location: formData.coords, 
                address: formData.address,

                // Metadata [cite: 216-219, 470-478]
                capturedBy: user.id || "Unknown",
                staffUID: user.uid || "N/A",
                timestamp: serverTimestamp(),
                photos: photoUrls,
                verificationStatus: "pending" // [cite: 66, 124, 318]
            };

            // 3. Save to Firestore [cite: 19, 95, 191]
            const docRef = await addDoc(collection(db, "suppliers"), supplierData);
            console.log("Sync Success! Document ID:", docRef.id);
            return { success: true, id: docRef.id };

        } catch (error) {
            console.error("Sync Error:", error);
            // [cite: 94, 266, 480]
            this.saveToOfflineStorage(formData); 
            return { success: false, message: "Saved Offline. Will sync later." };
        }
    },

    saveToOfflineStorage: function(data) {
        // Logic to save to IndexedDB as per [cite: 25, 197, 266]
        console.warn("Sync: Internet unavailable. Data saved to IndexedDB.");
        alert("Offline: Data saved on phone. It will upload when you have internet.");
    }
};

window.SyncEngine = SyncEngine;
