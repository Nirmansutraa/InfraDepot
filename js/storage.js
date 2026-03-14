/**
 * INFRA DEPOT - STORAGE LOGIC
 */
export async function pushSurveyToCloud(data) {
    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    return await addDoc(collection(window.db, "surveys"), {
        ...data,
        timestamp: serverTimestamp()
    });
}
