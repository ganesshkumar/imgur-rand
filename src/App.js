import React, {Component} from 'react';
import {
  Grommet,
  Box,
  Grid,
  FormField,
  TextInput,
  Button,
  Image,
  Anchor,
} from 'grommet';
import './App.css';

const theme = {
  global: {
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;',
      size: '14px',
      height: '20px',
    },
  },
};

const getRandomElements = (result, arr, dontSelectArr, n) => {
  while (
    result.length < n &&
    result.length < arr.length - dontSelectArr.length
  ) {
    const i = Math.floor (Math.random () * arr.length);
    var skip = false;

    result.forEach (img => {
      if (img.link === arr[i].link) {
        skip = true;
      }
    });
    if (skip) continue;

    dontSelectArr.forEach (link => {
      if (link === arr[i].link) {
        skip = true;
      }
    });
    if (skip) continue;

    result.push (arr[i]);
  }
  return result;
};

class App extends Component {
  constructor () {
    super ();

    this.state = {
      album: '3zqLX',
      n: 5,
      imgurAlbum: null,
      showImages: [],
      selectedImages: [],
      rejectedImages: [],
    };

    this.updateAlbum = this.updateAlbum.bind (this);
    this.updateN = this.updateN.bind (this);
    this.fetchImages = this.fetchImages.bind (this);
  }

  updateAlbum (event) {
    this.setState ({album: event.target.value});
  }

  updateN (event) {
    this.setState ({n: Number (event.target.value)});
  }

  fetchImages () {
    const {album} = this.state;

    fetch (`https://api.imgur.com/3/album/${album}`, {
      headers: {
        Authorization: 'Client-ID 7d23638f233ab99',
      },
    })
      .then (response => response.json ())
      .then (data => {
        this.setState ({
          imgurAlbum: data.data,
          showImages: getRandomElements (
            [],
            data.data.images,
            this.state.rejectedImages,
            this.state.n
          ),
        });
      });
  }

  selectImage (link) {
    const newSelections = this.state.selectedImages.slice ();
    newSelections.push (link);
    this.setState ({selectedImages: newSelections});
  }

  removeImage (link) {
    const newRejections = this.state.rejectedImages.slice ();
    newRejections.push (link);

    var ShowImages = this.state.showImages.slice ();
    var newShowImages = [];
    ShowImages.forEach (image => {
      if (image.link !== link) {
        newShowImages.push (image);
      }
    });

    newShowImages = getRandomElements (
      newShowImages,
      this.state.imgurAlbum.images,
      newRejections,
      this.state.n
    ).slice ();

    console.log (newRejections, newShowImages);
    this.setState ({
      rejectedImages: newRejections,
      showImages: newShowImages,
    });
  }

  clearSelections () {
    this.setState ({selectedImages: []});
  }

  clearRejected () {
    this.setState ({rejectedImages: []});
  }

  render () {
    var imagesView = null;

    if (this.state.showImages) {
      imagesView = this.state.showImages.map (image => {
        return (
          <div key={image.id} className="image">
            <div className="text-center">
              <Anchor href={image.link} primary label="Link" />{' | '}
              <span
                className="add"
                onClick={() => this.selectImage (image.link)}
              >
                + Select
              </span>{' | '}
              <span
                className="remove"
                onClick={() => this.removeImage (image.link)}
              >
                - Remove
              </span>{' | '}
            </div>
            <Image fit="contain" src={image.link} />
            <div className="text-center">
              <Anchor href={image.link} primary label="Link" />{' | '}
              <span
                className="add"
                onClick={() => this.selectImage (image.link)}
              >
                + Select
              </span>{' | '}
              <span
                className="remove"
                onClick={() => this.removeImage (image.link)}
              >
                - Remove
              </span>{' | '}
              <hr />
            </div>
          </div>
        );
      });
    }

    var linksView = null;
    if (this.state.selectedImages) {
      linksView = this.state.selectedImages.map (image => {
        return <span key={image}>* {image} <br /></span>;
      });
    }

    var rejectedView = null;
    if (this.state.rejectedImages) {
      rejectedView = this.state.rejectedImages.map (image => {
        return <span key={image}><s>* {image}</s> <br /></span>;
      });
    }

    return (
      <Grommet theme={theme}>
        <Grid
          areas={[
            {name: 'nav', start: [0, 0], end: [1, 0]},
            {name: 'controls', start: [0, 1], end: [1, 1]},
            {name: 'links', start: [0, 2], end: [0, 2]},
            {name: 'content', start: [1, 2], end: [1, 2]},
          ]}
          columns={['medium', 'flex']}
          rows={['small', 'small', 'flex']}
          gap="none"
        >
          <Box
            gridArea="nav"
            background="brand"
            align="center"
            justify="center"
            as="div"
          >
            <div className="title">imgur-rand</div>
            <div className="sub-title">
              Select n random images from an album
            </div>
          </Box>

          <Box gridArea="controls" margin={{top: '10pt'}}>
            <div className="controls">
              <FormField label="Album Hash">
                <TextInput placeholder="Ye8JD" onChange={this.updateAlbum} />
              </FormField>

              <FormField label="Number of Images">
                <TextInput placeholder="5" onChange={this.updateN} />
              </FormField>

              <Button
                label="Show Samples"
                reverse={true}
                onClick={this.fetchImages}
              />

              <Button
                label="Clear Selections"
                reverse={true}
                onClick={this.clearSelections.bind (this)}
              />

              <Button
                label="Clear Rejected"
                reverse={true}
                onClick={this.clearRejected.bind (this)}
              />
            </div>
          </Box>

          <Box gridArea="links" margin={{top: '10pt'}} align="center" as="div">
            <div className="content-container">
              <div className="links-title">Selected Images</div>
              <div className="selected-container">{linksView}</div>
              <div className="links-title">Rejected Images</div>
              <div className="rejected-container">{rejectedView}</div>
            </div>
          </Box>

          <Box gridArea="content" margin={{top: '10pt'}}>
            <div className="image-container">
              {imagesView}
            </div>

          </Box>
        </Grid>
      </Grommet>
    );
  }
}

export default App;
