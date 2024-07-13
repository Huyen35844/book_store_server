const messageTag = document.getElementById("message")

window.addEventListener("DOMContentLoaded", async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop)
        }
    })

    const token = params.token
    const id = params.id

    const res = await fetch("auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token, id }),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    })
    console.log(res);
    if (!res.ok) {
        //return res.json({message:"Thanks ..."})
        const { message } = await res.json();
        messageTag.innerText = message;
        messageTag.classList.add("error")
        return
    }

    const { message } = await res.json();
    messageTag.innerText = message
})


/**
 * khi gửi dữ liệu lên server, chuyển đổi từ kiểu đối tượng javascript sang json (JSON.stringify())
 * mục đích giúp server dễ dàng đọc hiểu, khi ta dùng dữ liệu đó lại đổi từ json sang javascript (express.json())
 */