async function logout(e, logout_elem, access_token, token_type) {
    e.preventDefault();
    localStorage.clear();
    logout_elem.style.display = "none";

    try {
        let response = await fetch("https://discord.com/api/oauth2/token/revoke", {
            headers: {
                authorization: `${token_type} ${access_token}`,
            },
        });
        let json = await response.json();
        console.log(json);
        console.log("logged out");
    } catch (err) {
        console.error(err);
    }
}

// consider this the main function
window.onload = async () => {
    let [accessToken, tokenType] = [localStorage.getItem("access_token"), localStorage.getItem("token_type")];
    let logout_elem = document.getElementById("logout");

    if (!accessToken) {
        // if we don't have a login token, don't run anything from hrere
        return;
    }
    
    logout_elem.style.display = "block";
    logout_elem.onclick = async (e) => {
        await logout(e, logout_elem, accessToken, tokenType);
    };
};