import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import DropzoneComponent from '../Components/CustomDropZone.js';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import Tooltip from 'material-ui/Tooltip';
import FlashOn from 'material-ui-icons/FlashOn';
import FlashOff from 'material-ui-icons/FlashOff';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20,
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center'
  },
  dropzoneComponent: {
    margin: '0 auto',
    marginTop: '60px'
  },
  dropzone: {
    minHeight: '300px',
    borderStyle: 'dotted',
    borderColor: 'Black',
    backgroundColor: '#DCEDC8',
    borderRadius: '20px',
    borderWidth: '2px'
  },
  image: {
    width: '300px'
  },
  divImageStyle: {
    margin: '12px auto 30px auto'
  },
  deleteButtonStyle: {
    flip: false,
    position: 'absolute',
    background: 'red',
    color: 'white',
    bottom: 32,
    right: 32,
    transition: 'none'
  },
  animateButtonStyle: {
    flip: false,
    position: 'absolute',
    bottom: 96,
    right: 32,
    transition: 'none'
  },
  typoStyle: {
    marginTop: '20px'
  }
});

const mql = window.matchMedia(`(min-width: 500px)`);

class CustomImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mql: mql,
      docked: false,
      width: '',
      image: "",
      imageType: "",
      status: "Off"
    }

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
  }

  componentWillMount() {
    this.mediaQueryChanged();
    mql.addListener(this.mediaQueryChanged);
    this.setState({ mql: mql, docked: mql.matches });
    this.stopAnimateImage();
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged() {
    var width = ''
    if (this.state.mql.matches) {
      width = '400px'
    }
    else {
      width = '100%'
    }

    this.setState({
      mql: mql,
      docked: this.state.mql.matches,
      width: width
    });
  }

  complete = (file) => {
    this.setState({ image: file.dataURL, imageType: file.type });
  };

  animateImage = () => {
    if (this.state.image == null || this.state.imageType == '') {
      return;
    }

    this.setState({ status: "On" });

    Axios.post('/api/image', {
      Data: this.state.image,
      Type: this.state.imageType
    }).then(() => {
      this.props.ledStripStatus(1),
        this.props.switchFunction(this.animateImage.bind(this))
    });
  }

  stopAnimateImage = () => {
    this.setState({ status: "Off" });
    this.props.ledStripStatus(null)
    Axios.put('/api/stop');
  }

  complete = (file) => {
    this.setState({ image: file.dataURL, imageType: file.type });
  };

  delete = () => {
    this.setState({ image: "", imageType: "" });

    if (this.state.status == "On") {
      this.stopAnimateImage();
    }
  }

  animateButton = (props) => {
    if (this.state.image != "") {
      return (
        <Tooltip placement="left" title={'Animate Image'}>
          <Button fab className={props.classes.animateButtonStyle} onClick={this.animateImage} style={{ background: "#FFD700", color: "#FFFFFF" }}>
            <FlashOn />
          </Button>
        </Tooltip>
      )
    }

    return (
      <div />
    )
  }

  render() {
    const { classes } = this.props;

    var ReactDOMServer = require('react-dom/server');

    var componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true
    };

    var eventHandlers = {
      removedfile: () => this.delete(),
      complete: (file) => this.complete(file)
    }

    var djsConfig = {
      acceptedFiles: "image/jpeg,image/png",
      thumbnailHeight: 400,
      thumbnailWidth: 400,
      maxFiles: 1,
      dictDefaultMessage: ReactDOMServer.renderToString(
        <div className={classes.typoStyle}>
          <Typography type="title" component="h3">
            Touch to upload files
          </Typography>
        </div>
      ),
      previewTemplate: ReactDOMServer.renderToString(
        <div className={classes.divImageStyle}>
          <div>
            <br />
            <img style={{ width: '80%' }} data-dz-thumbnail dz-max-files-reached='true' />
            <div><span ></span></div>
          </div>

          <div>
            <Tooltip placement="left" title={'Delete image'}>
              <Button fab className={classes.deleteButtonStyle} data-dz-remove style={{ background: "#D32F2F", color: "#FFFFFF" }}>
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <div className={classes.dropzoneComponent} style={{ width: this.state.width }}>
          <DropzoneComponent config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}
            className={classes.dropzone}
          >
          </DropzoneComponent>

          <this.animateButton
            classes={classes}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CustomImage);