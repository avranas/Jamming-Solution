import React from "react";
import TrackList from '../TrackList/TrackList'

class Playlist extends React.Component {

  constructor(props){
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event){
    this.props.onNameChange(event.target.value);
  }

  render(){
    return(
      <div className="Playlist">
        <input
          defaultValue={'New Playlist'}
          onChange={this.handleNameChange}
        />
        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}
        />
        <button
          className="Playlist-save"
          onClick={this.props.onSave}
        >
          SAVE TO SPOTIFY
        </button>
      </div>
    )
  }
}

//spotify:track:5lXNcc8QeM9KpAWNHAL0iS
//spotify:track:6gRY4HZcHxx1QWIEpvdAxm
//spotify:track:31NiyZrUd1r4icY7xkvnWv

export default Playlist;
