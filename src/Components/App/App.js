import React from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    Spotify.getAccessToken(); //Get an access token first thing when the app loads

    //If there's playlist data in localStorage, get it now
    const playlistName = localStorage.getItem('playlistName');
    const playlistTracks = JSON.parse(localStorage.getItem('playlistTracks'));
    if(!playlistName || !playlistTracks){
      playlistName = 'New playlist';
      playlistTracks = [];
    }


    this.state = {
      searchResults: [],
      playlistName: playlistName,
      playlistTracks: playlistTracks
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  updatePlaylistName(name){
    this.setState({playlistName: name})
  }

  savePlaylistToLocalStorage(newTracks){
    localStorage.setItem('playlistName', this.state.playlistName);
    localStorage.setItem('playlistTracks', JSON.stringify(newTracks));
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    const newList = tracks.filter( i => track.id !== i.id );
    this.setState({playlistTracks: newList})
    this.savePlaylistToLocalStorage(newList);
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    const foundTrack = tracks.find( i => track.id === i.id );
     if(!foundTrack){
      tracks.push(track);
    }
    this.setState({playlistTracks: tracks})
    this.savePlaylistToLocalStorage(tracks);
  }

  async savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(i => i.uri);
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      }
    );
  }

  async search(term){
    const response = await Spotify.search(term);
    this.setState({searchResults: response});
  }

  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
