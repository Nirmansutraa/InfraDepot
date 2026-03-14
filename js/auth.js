handleLogin: async function() {
        const id = document.getElementById('login_id').value.trim();
        const pass = document.getElementById('login_pass').value.trim();

        if (!id || !pass) return alert("Enter credentials");

        try {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const userSnap = await getDoc(doc(window.db, "users", id));

            if (userSnap.exists() && userSnap.data().password === pass) {
                localStorage.setItem('infra_user', JSON.stringify({ id, ...userSnap.data() }));
                // FORCE REFRESH to trigger the new App.init() state
                window.location.reload(); 
            } else {
                alert("Invalid Credentials");
            }
        } catch (e) {
            alert("Connection Error");
        }
    }
