async function logout(e, logout_elem, access_token, token_type) {
    e.preventDefault();

    try {
        let result = await apiLogout(access_token, token_type);
        localStorage.clear();
        logout_elem.style.display = "none";
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

// gets all the pictures already liked by this user
async function apiLogout(accessToken, tokenType) {
    return await _api("logout", accessToken, tokenType, {});
}


async function _api(action, accessToken, tokenType, options) {
    let params = new URLSearchParams();
    params.set("access_token", accessToken);
    params.set("token_type", tokenType);

    let url = api_url;
    switch (action) {
        case "like":
            url += `/like/${options.entry}`;
            break;
        case "unlike":
            url += `/unlike/${options.entry}`;
            break;
        case "likes-by-user":
            url += "/likes/by-user";
            break;
        case "logout":
            url += "/logout";
            break;
        default:
            throw "Unknown action";
    }
    url += `/?${params.toString()}`;
    console.log("Making request to: ", url);

    let result = await fetch(url);
    let json = await result.json();
    return json;
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