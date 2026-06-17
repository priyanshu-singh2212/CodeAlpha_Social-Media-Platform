const API_URL = "http://localhost:5000/api/posts";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const postForm = document.getElementById("postForm");

postForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const content =
            document.getElementById("content").value;

        const image =
            document.getElementById("image").files[0];

        const formData = new FormData();

        formData.append("content", content);

        if (image) {
            formData.append("image", image);
        }

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

        const data =
            await response.json();

        alert(data.message);

        document.getElementById("content").value = "";
        document.getElementById("image").value = "";

        loadPosts();

    }
);

// Load Posts
async function loadPosts() {

    const response =
        await fetch(API_URL);

    const posts =
        await response.json();

    const container =
        document.getElementById("postsContainer");

    container.innerHTML = "";

    posts.forEach(post => {

        let commentsHTML = "";

        post.comments.forEach(comment => {

            commentsHTML += `
            <p>💬 ${comment.text}</p>
            `;

        });

        container.innerHTML += `

        <div class="post">

            <h3>${post.user.username}</h3>

            <p>${post.content}</p>

            ${
                post.image
                    ?
                    `<img
                        src="http://localhost:5000${post.image}"
                        width="300"
                        style="margin-top:10px;border-radius:10px;"
                    >`
                    :
                    ""
            }

            <p>
                ❤️ ${post.likes.length} Likes
            </p>

            <button
                onclick="likePost('${post._id}')">
                Like
            </button>

            <button
                onclick="commentPost('${post._id}')">
                Comment
            </button>

            ${commentsHTML}

        </div>

        `;

    });

}

// Like Post
async function likePost(id) {

    const response =
        await fetch(
            `${API_URL}/${id}/like`,
            {
                method: "PUT",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    const data =
        await response.json();

    alert(data.message);

    loadPosts();

}

// Comment Post
async function commentPost(id) {

    const text =
        prompt("Enter Comment");

    if (!text) return;

    const response =
        await fetch(
            `${API_URL}/${id}/comment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${token}`
                },
                body: JSON.stringify({
                    text
                })
            }
        );

    const data =
        await response.json();

    alert(data.message);

    loadPosts();

}

// Initial Load
loadPosts();
function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}