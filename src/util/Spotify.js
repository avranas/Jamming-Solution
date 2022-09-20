let userAccessToken;
const clientId = 'f998a560e9734c858498d34bd0e7afd9'
const redirectUri = 'http://localhost:3000/';

const Spotify = {
  getAccessToken(){
    if(userAccessToken){
      return userAccessToken;
    } else {
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if(accessTokenMatch && expiresInMatch){
        userAccessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return userAccessToken;
      } else {
        window.location = 
          `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      }
    }
  },

  async search(searchTerm){
    const accessToken = Spotify.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    });
    const jsonResponse = ( await response.json()); //Why is this async?
    if(!jsonResponse.tracks){
      return [];
    } else {
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      });
    }
  },

  async savePlaylist(playlistName, trackURIs){
    if(!playlistName || !trackURIs){
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`} //like this?
    //Get user id
    const idResponse = await fetch(`https://api.spotify.com/v1/me`, {
      headers: headers
    });
    const idResponseJSON = await idResponse.json();
    const userId = idResponseJSON.id
    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({name: playlistName})
    });
    const playlistJSON = await createPlaylistResponse.json();
    const playlistId = playlistJSON.id;
    const addToPlaylistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({uris: trackURIs})
    });
  }
}

export default Spotify;
