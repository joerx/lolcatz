import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Passed at build time, see https://create-react-app.dev/docs/adding-custom-environment-variables/
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";


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
    const url = this.props.img.s3_url || "placeholder.png";
    return (
      <img src={url} alt={this.props.img.filename}/>
    )
  }
}

class LolCatz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uploading: false,
      images: []
    }
  }

  componentDidMount() {
    this.fetchImages()
    setInterval(() => this.fetchImages(), 5000);
  }

  fetchImages() {
    fetch(`${API_URL}/list`, {method: 'GET'})
      .then(res => res.json())
      .then(data => {
        console.log("Received", data.length,"images")
        this.setState({images: data})
      })
      .catch(err => console.error(err))
  }

  render() {
    return (<div className="app">
      <h1 className="main-title">TransferCatz</h1>
        <ul className="thumbnails">

          <li>
            <UploadButton 
              onChange={(e) => this.onFileSelected(e)}
              enabled={this.state.uploading}
              caption={this.state.uploading ? "Uploading..." : "Upload"}
            />
          </li>

          {this.state.images.map(img => (
            <li key={img.id}>
              <Thumbnail img={img}/>
            </li>
          ))}

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
      data.append("file", file);
    })

    fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: data
    })
    .then(res => res.json())
    .then(data => {
      console.debug("Upload successful:", data);
      this.setState({
        uploading: false,
        images: [data].concat(this.state.images)
      });
    })
    .catch(err => console.error("Upload failed:", err))
    .finally(() => this.setState({uploading: false}))
  }
}


ReactDOM.render(
  <LolCatz />,
  document.getElementById('root')
);
