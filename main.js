const api_url = "https://sac.nombox.de";

window.onload = () => {
    let [accessToken, token_type] = [localStorage.getItem("access_token"), localStorage.getItem("token_type")];
    let login_elem = document.getElementById("login");
    let logout_elem = document.getElementById("logout");
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
            return
        }
        console.log("access token in url! Storing in localStorage");

        // we finally have a token. might as well store it
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_type", token_type);

    }

    // remove token from url
    window.location.replace("#");
    // slice off the remaining '#' in HTML5:    
    if (typeof window.history.replaceState == "function") {
        history.replaceState({}, '', window.location.href.slice(0, -1));
    }

    // show logout element 
    logout_elem.style.display = "block";
    
    // register logout procedure
    // hide logout element, show login element
    logout_elem.onclick = ((e) => {
        e.preventDefault();
        localStorage.clear();
        console.log("logged out");
        login_elem.style.display = "block";
        logout_elem.style.display = "hidden";
    });


    let params = new URLSearchParams();
    params.set("token_type", token_type);
    params.set("access_token", accessToken);

    // example, nothing more
    fetch(`${api_url}/likes/?${params.toString()}`)
        .then(result => result.json())
        .then(console.log)
        .catch(console.error);
};