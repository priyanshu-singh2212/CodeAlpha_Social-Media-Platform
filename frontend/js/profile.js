const API_URL = "http://localhost:5000/api/users/profile";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// Load Profile
async function loadProfile() {

    const response = await fetch(
        API_URL,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const user = await response.json();

    const container =
        document.getElementById("profileContainer");

   container.innerHTML = `

<div class="profile-card">

    <div class="profile-left">

        ${
            user.profileImage
            ? `<img
                src="http://localhost:5000${user.profileImage}"
                class="profile-image"
            >`
            : `<img
                src="https://via.placeholder.com/120"
                class="profile-image"
            >`
        }

    </div>

    <div class="profile-right">

        <h3>${user.username}</h3>

        <div class="profile-stats-row">

            <div>
                <strong>${user.postCount}</strong>
                <span>Posts</span>
            </div>

            <div>
                <strong>${user.followers.length}</strong>
                <span>Followers</span>
            </div>

            <div>
                <strong>${user.following.length}</strong>
                <span>Following</span>
            </div>

        </div>

    </div>

</div>

`;
}

// Upload Profile Photo
async function uploadProfileImage() {

    const file =
        document.getElementById(
            "profileImageInput"
        ).files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    const formData = new FormData();

    formData.append(
        "profileImage",
        file
    );

    const response =
        await fetch(
            "http://localhost:5000/api/users/profile-image",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

    const data =
        await response.json();

    alert(data.message);

    loadProfile();
}

// Logout
function logout() {

    localStorage.removeItem("token");

    window.location.href =
        "login.html";
}

loadProfile();