import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
/* import DropzoneComponent from 'react-dropzone-component'; */
/* import DropzoneComponent from 'react-dropzone-component/src/react-dropzone.js'; */
import DropzoneComponent from '../Components/CustomDropZone.js';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import Tooltip from 'material-ui/Tooltip';

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
  divImageStyle: {
    margin: '12px auto 30px auto'
  },
  fabButtonAbsoluteStyle: {
      flip: false,
      position: 'absolute',
      bottom: 32,
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
    /* console.log("Krokun")
    console.log(dz)
    console.log(file) */
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
      /* init: dz => console.log(dz),
      maxfilesexceeded: () => console.log("Lok'tar Ogar"), */
      addedfile: (file) => this.Image(file),
      /* maxfilesreached: (arc) => console.log(arc) */
    }

    var djsConfig = {
      /* acceptedFiles: "image/jpeg,image/png,image/gif", */
      thumbnailHeight: 400,
      thumbnailWidth: 400,
      maxFiles: 2,
      /* maxFilesize: 1, */
      dictDefaultMessage: ReactDOMServer.renderToString(
        <div className={classes.typoStyle}>
          <Typography /* style={{ textAlign: 'center', maringTop:'20px' }} */ type="headline" component="h3">
            Drop files here to upload
          </Typography>
        </div>
      ),
      previewTemplate: ReactDOMServer.renderToString(
        <div className={classes.divImageStyle}>
          <div>
            <div><span data-dz-name></span></div>
            <div data-dz-size></div>
            <img style={{ width: '80%' }} data-dz-thumbnail dz-max-files-reached='true'/>
            <div><span ></span></div>
          </div>
          
          <div>
            <Tooltip placement="bottom" title={"Delete Selected Color"}>
              <IconButton
                className={classes.fabButtonAbsoluteStyle}
                
                style={{ color: "White", backgroundColor: "Red" }}
                data-dz-remove
              >
                <DeleteIcon />
              </IconButton>
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
            style={{ height: this.state.width }}
          >


          </DropzoneComponent>
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(CustomImage);