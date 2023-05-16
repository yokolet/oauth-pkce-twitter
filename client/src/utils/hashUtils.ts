export const getHashParams = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce(function(initial: { [key: string]: any; }, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
}

export const getOAuthParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    access_token: urlParams.get('access_token'),
    expires_in: urlParams.get('expires_in'),
  };
}

export const removeHashParamsFromUrl = () => {
  window.history.pushState("", document.title, window.location.pathname);
}
