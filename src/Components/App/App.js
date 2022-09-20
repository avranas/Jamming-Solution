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
    this.state = {
      searchResults: [
        // {
        //   name: 'default name 1',
        //   artist: 'default artist 1',
        //   album: 'default album 1',
        //   id: 'default id 1'
        // },
        // {
        //   name: 'default name 2',
        //   artist: 'default artist 2',
        //   album: 'default album 2',
        //   id: 'default id 2'
        // },
        // {
        //   name: 'default name 3',
        //   artist: 'default artist 3',
        //   album: 'default album 3',
        //   id: 'default id 3'
        // }
      ],
      playlistName: "My playlist",
      playlistTracks: [
        // {
        //   name: 'playlist name 1',
        //   artist: 'playlist artist 1',
        //   album: 'playlist album 1',
        //   id: 'playlist id 1'
        // },
        // {
        //   name: 'playlist name 2',
        //   artist: 'playlist artist 2',
        //   album: 'playlist album 2',
        //   id: 'playlist id 2'
        // },
      ]
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

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    const newList = tracks.filter( i => track.id !== i.id );
    this.setState({playlistTracks: newList})
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    const foundTrack = tracks.find( i => track.id === i.id );
     if(!foundTrack){
      tracks.push(track);
    }
    this.setState({playlistTracks: tracks})
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
