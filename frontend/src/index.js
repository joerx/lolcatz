import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const API_URL="http://localhost:8000";

class UploadButton extends React.Component {

  render() {
    const classNames=["upload-button", this.props.enabled ? "" : "disabled"]

    return (
      <div className={classNames.join(" ")}>
        <label htmlFor="file-upload">
          <span className="caption">{this.props.caption}</span>
        </label>
        <input type="file" id="file-upload" className="file-upload" onChange={this.props.onChange}/>
      </div>
    )
  }
}

class Thumbnail extends React.Component {
  render() {
    return (
      <img src={this.props.src}/>
    )
  }
}

class LolCatz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uploading: false,
      images: Array(9).fill({src: "placeholder.png"})
    }
  }

  render() {
    return (<div className="app">
      <h1 className="main-title">LolCatz App</h1>
        <ul className="thumbnails">
          <li><UploadButton 
            onChange={(e) => this.onFileSelected(e)}
            enabled={this.state.uploading}
            caption={this.state.uploading ? "Uploading..." : "Upload"}
          /></li>
          {this.state.images.map((img) => <li><Thumbnail src={img.src} /></li>)}
        </ul>
    </div>)
  }

  onFileSelected(e) {
    if (this.state.uploading) {
      return
    }

    this.setState({uploading: true})

    const files = Array.from(e.target.files);

    const data = new FormData()
    files.forEach((file, i) => {
      data.append(i, file);
    })

    fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: data
    })
    .then(res => res.json())
    .then(() => {
      this.setState({uploading: false})
    });
  }
}


ReactDOM.render(
  <LolCatz />,
  document.getElementById('root')
);
