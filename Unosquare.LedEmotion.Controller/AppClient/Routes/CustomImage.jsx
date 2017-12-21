import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root : {
    flexGrow : 1,
    marginTop: 20,
    paddingLeft : 50,
    paddingRight: 50
  }
});

class CustomImage extends Component {
  render() {

    const { classes } = this.props;

    return (
      <div className = { classes.root }>
        <Typography type = "headline" component = "h3">Custom Image</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(CustomImage);