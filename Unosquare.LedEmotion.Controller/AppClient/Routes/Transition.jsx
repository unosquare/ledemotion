import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { PhotoshopPicker, SketchPicker, HuePicker } from 'react-color';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Axios from 'axios';
import CustomPicker from '../Components/CustomPicker.jsx'
import AddIcon from 'material-ui-icons/Add';
import reactCSS from 'reactCSS';
import Tooltip from 'material-ui/Tooltip';
import FlashOn from 'material-ui-icons/FlashOn';
import Input from 'material-ui/Input';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  root : {
    flexgrow : 1,
    marginTop : 20,
    paddingLeft : 50, 
    paddingRight : 50
  },
  paperStyle : {
    paddingTop : 20,
    paddingLeft : 10,
    paddingBottom : 20,
    marginTop : theme.spacing.unit * 3,
    backgroundColor : '#2CCCE4',
  },
  iconStyle : {
    verticalAlign: "middle !important",
    paddingBottom: 3
  },
  typographyStyle : {
    color : '#FFF'
  },
  inputSelectedColorStyle : {
    display : "flex",
    alignItems : "center",
    justifyContent : "center",
  },
  inputStyle : {
    borderRadius: 6,
  },
  divSketchPickerStyle : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sketchPickerStyle : {
    width : 500,
  },
  paperInfoStyle : {
    backgroundColor : "#FAFAFA",
  },
  cardStyle : {
    width : 60,
    height : 60,
    borderRadius: 60,
  },
  shadowIconButtonStyle : {
    alignItems : "center",
    justifyContent : "center",
  },
  iconButtonStyle : {
    width : 60,
    height : 60,
  },
  divRCSliderStyle : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rcSliderStyle : {
    width : 500,
  },
  fabButtonAbsoluteStyle: {
    flip: false,
    position: 'absolute',
    bottom: 32,
    right: 32,
  },
});

class Transition extends Component {
  state = {
    colors : [],
    selectedColor : {},
    seconds : 1,

    displayColorPicker: false,
  };

  /** Adds the color */
  handleChange = (color, event) => {
    console.log(color);
    const {r, g, b} = color.rgb;

    this.setState(prevState => ({
      colors : [...prevState.colors, { id : this.state.colors.length, name : color.hex, rgb : {r, g, b} }],
      selectedColor : color.hex
    }));
  }

  /** Sets the delay */
  handleValueSliderChange = (value) => {
    console.log(value);

    this.setState(prevState => ({
      seconds : value
    }));
  }

  /** Removes the color */
  handleColorRemove = (value) => {
    console.log("Color to remove: " + value);

    this.setState(prevState => ({
      colors : prevState.colors.filter((color, key) => {
        return color.id !== value;
      })
    }))
  }

  /** SetTransition */
  setTransition = () => {
    let colors = this.state.colors;
    let delay = this.state.seconds;

    console.log("Entró");

    Axios.put('/api/transition', {
      Colors : colors.map((color) => {
        const {r, g, b} = color.rgb
        return [r, g, b];
      }),
      Delay : delay
    }).then(response => {
      console.log(response);
    });
  }

  handleClick = () => {
    this.setState({
      displayColorPicker : !this.state.displayColorPicker
    });
  }

  handleClose = () => {
    this.setState({
      displayColorPicker : false
    });
  }

  render() {

    const { classes } = this.props;
    const { colors, selectedColor, seconds, displayColorPicker } = this.state;

    const styles = reactCSS({
      'default': {
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div className = { classes.root }>
        <div className = { classes.inputSelectedColorStyle }>
          <Input className = { classes.inputStyle } value = { Object.keys(selectedColor).length === 0 ? "" : "\xa0\xa0" + selectedColor.toUpperCase() } style = {{ backgroundColor : selectedColor, color : "#FFFFFF" }} disabled disableUnderline></Input>
        </div>
        <br /><br /><br />

        {/* Array of colors */}
        <div>
          <Grid container>
            <Grid item xs = { 12 }>
              <Grid container justify = "center" spacing = { 8 }>
              {
                colors.length == 0
                  ?
                    <Paper className = { classes.paperInfoStyle } elevation = { 0 }>
                      <Typography type = "caption" component = "p">
                        Pick multiple colors. Click the button to open de color picker, click outside to close it. Remove a color by taping on the colored circles appearing here
                      </Typography>              
                    </Paper>
                  :
                    colors.map((color, key) => 
                      <Grid key = { key } item>
                        <Card className = { classes.cardStyle } style = {{ backgroundColor : color.name }}>
                          <CardActions className = { classes.shadowIconButtonStyle }>
                            <IconButton className = { classes.iconButtonStyle } aria-label = "Delete" onClick = { () => this.handleColorRemove(color.id) }>
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    )
              }
              <div>
                <Button fab color="primary" aria-label="add" className = { classes.button } onClick = { this.handleClick } >
                  <AddIcon />
                </Button>
              
              {
                displayColorPicker 
                  ? 
                    <div style = { styles.popover }>
                      <div style = { styles.cover } onClick = { this.handleClose } />
                        <CustomPicker fields = { false } presetColors = { [] } disableAlpha color = { selectedColor } onChangeComplete = { this.handleChange } />
                      </div>
                  :
                    null
              }
              </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <br /><br />

        {/* Slider */}
        <div className = { classes.divRCSliderStyle }>
          <Slider min = { 1 } max = { 300 } onChange = { this.handleValueSliderChange } className = { classes.rcSliderStyle } />
        </div>
        <br />

        {/* Button */}
        <div>
          <Tooltip placement = "bottom" title = {"Animate " + colors.length + " colors over " + seconds + " seconds" }>
            <Button fab color = "accent" disabled = { colors.length == 0 } onClick = { this.setTransition } className = { classes.fabButtonAbsoluteStyle }>
              <FlashOn />
            </Button>
          </Tooltip>
        </div>
        <br />

      </div>
    );
  }
}

Transition.propTypes = {
  classes : PropTypes.object.isRequired,
};

export default withStyles(styles)(Transition);