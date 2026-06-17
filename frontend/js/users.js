const API_URL = "http://localhost:5000/api/users";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// Load Users
async function loadUsers() {

    // Current User Profile
    const profileResponse = await fetch(
        `${API_URL}/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const currentUser = await profileResponse.json();

    // All Users
    const response = await fetch(
        API_URL,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const users = await response.json();

    const container =
        document.getElementById("usersContainer");

    container.innerHTML = "";

    users.forEach(user => {

        // Khud ko list me mat dikhao
        if (user._id === currentUser._id) {
            return;
        }

        container.innerHTML += `
        
        <div class="post">

            <h3>${user.username}</h3>

            <p>${user.email}</p>

            <p>
                Followers: ${user.followers.length}
            </p>

            <button
                onclick="followUser('${user._id}')">
                Follow
            </button>

            <button
                onclick="unfollowUser('${user._id}')">
                Unfollow
            </button>

        </div>

        `;
    });
}

// Follow User
async function followUser(id) {

    const response =
        await fetch(
            `${API_URL}/follow/${id}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    const data =
        await response.json();

    alert(data.message);

    loadUsers();
}

// Unfollow User
async function unfollowUser(id) {

    const response =
        await fetch(
            `${API_URL}/unfollow/${id}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    const data =
        await response.json();

    alert(data.message);

    loadUsers();
}

// Initial Load
loadUsers();
function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}