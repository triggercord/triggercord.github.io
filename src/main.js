const api_url = "https://sac.nombox.de";

window.onload = () => {
    let [accessToken, token_type] = [localStorage.getItem("access_token"), localStorage.getItem("token_type")];

    // do we already have a token in storage?
    if (!accessToken) {
        console.log("no access token in localStorage, trying fragment");

        // check url
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        accessToken = fragment.get('access_token');
        token_type = fragment.get('token_type');

        // display login link if we've still got no token
        if (!accessToken) {
            console.log("no access token in url, showing login button");
            document.getElementById('login').style.display = 'block';
            return
        } else {
            console.log("access token in url! Storing in localStorage");
            // we finally have a token. might as well store it
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("token_type", token_type);
        }
    }

    let params = new URLSearchParams();
    params.set("token_type", token_type);
    params.set("access_token", accessToken);

    // example, nothing more
    fetch(`${api_url}/likes/?${params.toString()}`)
        .then(result => result.json())
        .then(console.log)
        .catch(console.error);
};