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
    margin: '0 auto'
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
    var width=''
    if(this.state.mql.matches){
      width='400px'
    }
    else {
      width='100%'
    }
    console.log(width)
    this.setState({
      mql: mql,
      docked: this.state.mql.matches,
      width: width
    });
  }

  Image = (file) => {
    console.log(file)
  }

  render() {
    const { classes } = this.props;

    var componentConfig = { postUrl: 'no-url' };

    var eventHandlers = { addedfile: (file) => this.Image(file) }

    var ReactDOMServer = require('react-dom/server');

    var djsConfig = {
      previewTemplate: ReactDOMServer.renderToString(
        <div>
          <div>
            <div><span data-dz-name="true"></span></div>
            <img /* className={classes.image} */ style={{width:'80%'}} data-dz-thumbnail="true" />
          </div>
          <div ><span data-dz-uploadprogress="true"></span></div>
          
          <IconButton
            /* className={props.classes.iconButtonStyle} */
            aria-label="Select"
            onClick={() => this.setState({ displayColorPicker: true })} >
            <AddIcon />
          </IconButton>

          <IconButton
            /* className={props.classes.iconButtonStyle} */
            aria-label="Select"
            onClick={() => this.setState({ displayColorPicker: true })} >
            <DeleteIcon />
          </IconButton>
          
        </div>
      )
    }

    

    return (
      <div className={classes.root}>
        {/* <Typography type="headline" component="h3">Custom Image</Typography> */}

        <div className={classes.dropzoneComponent} style={{width:this.state.width}}>
          <DropzoneComponent config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig} />
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(CustomImage);