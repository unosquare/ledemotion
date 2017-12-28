import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import DropzoneComponent from 'react-dropzone-component';
/* import DropzoneComponent from 'react-dropzone-component/src/react-dropzone.js'; */
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';

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
    backgroundColor: '#e4e1e1',
    borderRadius: '20px',
    borderWidth: '2px'
  },
  image: {
    width: '300px'
  },
  iconButtonStyle: {
    /* height: '100%',
    width: '100%', */
    /* margin: '0px 0px 2px 0px', */
    color: 'Black'
  }
});

const mql = window.matchMedia(`(min-width: 500px)`);

class CustomImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mql: mql,
      docked: false,
      width: ''
    }

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
  }

  componentWillMount() {
    this.mediaQueryChanged()
    mql.addListener(this.mediaQueryChanged);
    this.setState({ mql: mql, docked: mql.matches });
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

  Image = (dz, file) => {
    console.log("Krokun")
    console.log(dz)
    console.log(file)
    /* console.log(file.DataURL)
    console.log(file.name) */

    /* Axios.post('/api/image', {
      DataURL: file.DataURL,
      name: file.name
    }) */
  }

  render() {
    const { classes } = this.props;

    var ReactDOMServer = require('react-dom/server');

    var componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      /* postUrl: 'api/image' */
      postUrl: 'no-url'
    };

    var eventHandlers = {
      init: dz => console.log(dz),
      addedfile: (file) => this.Image(file),
      /* maxfilesreached: (arc) => console.log(arc) */
    }

    var djsConfig = {
      /* acceptedFiles: "image/jpeg,image/png,image/gif", */
      thumbnailHeight: 400,
      thumbnailWidth: 400,
      maxFiles: 1,
      dictDefaultMessage: ReactDOMServer.renderToString(
        <div>
          <Typography style={{ textAlign: 'center' }} type="headline" component="h3">
            Drop files here to upload
          </Typography>
        </div>
      ),
      previewTemplate: ReactDOMServer.renderToString(
        <div>
          <div>
            <div><span data-dz-name="true"></span></div>
            <div data-dz-size></div>
            <img /* className={classes.image} */ style={{ width: '80%' }} data-dz-thumbnail />
          </div>
          <div ><span data-dz-uploadprogress></span></div>

          <IconButton
            /* className={props.classes.iconButtonStyle} */
            aria-label="Select"
            onClick={() => this.setState({ displayColorPicker: true })}
          >
            <AddIcon />
          </IconButton>

          <IconButton
            /* className={props.classes.iconButtonStyle} */
            aria-label="Select"
            onClick={() => this.setState({ displayColorPicker: true })}
            data-dz-remove
          >
            <DeleteIcon />
          </IconButton>

        </div>
      )
    }



    return (
      <div className={classes.root}>
        {/* <Typography type="headline" component="h3">Custom Image</Typography> */}

        <div className={classes.dropzoneComponent} style={{ width: this.state.width }}>
          <DropzoneComponent config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}
            className={classes.dropzone}
            style={{ height: this.state.width }}
          >


          </DropzoneComponent>
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(CustomImage);