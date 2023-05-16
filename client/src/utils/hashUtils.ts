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
