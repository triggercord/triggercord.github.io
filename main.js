const api_url = "https://sac.nombox.de";

async function logout(e, login_elem, logout_elem) {
    e.preventDefault();
    localStorage.clear();
    console.log("logged out");
    login_elem.style.display = "block";
    logout_elem.style.display = "none";

    // show login message
    let login_message = document.getElementById("login-message");
    login_message.style.display = "block";

    // hide description
    let description = document.getElementById("description");
    description.style.display = "none";

    // hide iamges
    let images = document.getElementById("images");
    images.style.display = "none";

    // todo: invalidate token thru discord 
}

// return -> [accessToken, tokenType]
async function login(login_elem, logout_elem) {
    let [accessToken, token_type] = [localStorage.getItem("access_token"), localStorage.getItem("token_type")];

    // do we already have a token in storage?
    if (!accessToken) {
        console.log("no access token in localStorage, trying fragment");

        // check url
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        accessToken = fragment.get("access_token");
        token_type = fragment.get("token_type");

        // display login link if we've still got no token
        if (!accessToken) {
            console.log("no access token in url, showing login button");
            login_elem.style.display = "block";
            return [null, null];
        }
        console.log("access token in url! Storing in localStorage");

        // we finally have a token. might as well store it
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_type", token_type);
    }

    console.log("Removing token from url");

    // remove token from url
    window.location.replace("#");
    // slice off the remaining '#' in HTML5:    
    if (typeof window.history.replaceState == "function") {
        history.replaceState({}, '', window.location.href.slice(0, -1));
    }

    console.log("Registering logout function");

    // register logout procedure
    // hide logout element, show login element
    logout_elem.onclick = async (e) => {
        await logout(e, login_elem, logout_elem);
    };

    // show logout element 
    logout_elem.style.display = "block";

    // hide login message
    let login_message = document.getElementById("login-message");
    login_message.style.display = "none";

    // show description
    let description = document.getElementById("description");
    description.style.display = "block";

    // show iamges
    let images = document.getElementById("images");
    images.style.display = "flex";

    return [accessToken, token_type];
}


async function likeEntry(entry, accessToken, tokenType) {
    return await _api("like", accessToken, tokenType, { entry: entry });
}

async function unlikeEntry(entry, accessToken, tokenType) {
    return await _api("unlike", accessToken, tokenType, { entry: entry });
}

// gets all the pictures already liked by this user
async function likesByUser(accessToken, tokenType) {
    return await _api("likes-by-user", accessToken, tokenType, {});
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
    let login_elem = document.getElementById("login");
    let logout_elem = document.getElementById("logout");

    let [accessToken, tokenType] = await login(login_elem, logout_elem);

    if (!accessToken) {
        // if we don't have a login token, don't run anything from hrere
        return;
    }

    let likedEntries = new Set(await likesByUser(accessToken, tokenType) || []);
    console.log(likedEntries);

    let buttons = document.getElementsByClassName("like-button");

    for (button of buttons) {
        // if a picture is already liked, replace red heart with green one
        let entry = button.dataset.picture;
        if (likedEntries.has(entry)) {
            button.innerText = "❤️";
        }

        button.onclick = async (e) => {
            let entry = e.target.dataset.picture;
            try {
                if (likedEntries.has(entry)) {
                    let json = await unlikeEntry(entry, accessToken, tokenType);
                    e.target.innerText = "🤍";
                    likedEntries.delete(entry);
                } else {
                    let json = await likeEntry(entry, accessToken, tokenType);
                    e.target.innerText = "❤️";
                    likedEntries.add(entry);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
};