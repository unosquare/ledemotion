import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
// import Slider, { Range } from 'rc-slider';
// import 'rc-slider/assets/index.css';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Axios from 'axios';
import CustomPicker from '../Components/CustomPicker.jsx'
import AddIcon from 'material-ui-icons/Add';
import Tooltip from 'material-ui/Tooltip';
import FlashOn from 'material-ui-icons/FlashOn';
import Dialog from 'material-ui/Dialog/Dialog';
import styled, { keyframes } from 'styled-components';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import FlashOff from 'material-ui-icons/FlashOff';

const styles = theme => ({
    root: {
        flexgrow: 1,
        marginTop: 20,
        paddingLeft: 50,
        paddingRight: 50
    },
    divPaperStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paperStyle: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingBottom: 20,
        marginTop: theme.spacing.unit * 3,
        backgroundColor: '#FAFAFA',
        height: 50,
        width: 700,
        borderRadius: 6
    },
    iconStyle: {
        verticalAlign: 'middle !important',
        paddingBottom: 3
    },
    typographyStyle: {
        color: '#FFF'
    },
    inputSelectedColorStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputStyle: {
        borderRadius: 6
    },
    paperInfoStyle: {
        backgroundColor: '#FAFAFA'
    },
    divSketchPickerStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sketchPickerStyle: {
        width: 500
    },
    popover: {
        position: 'absolute',
        zIndex: '2'
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
    },
    cardStyle: {
        width: 60,
        height: 60,
        borderRadius: 60
    },
    shadowIconButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconButtonStyle: {
        width: 60,
        height: 60
    },
    divRCSliderStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rcSliderStyle: {
        width: 500
    },
    fabButtonAbsoluteStyle: {
        flip: false,
        position: 'absolute',
        bottom: 32,
        right: 32
    },
    fabButtonAbsoluteStyleAux: {
        flip: false,
        position: 'absolute',
        bottom: 96,
        right: 32
    },
    spacer20: {
        height: '20px',
        width: '100%',
        fontSize: '0',
        margin: '0',
        padding: '0',
        border: '0',
        display: 'block'
    }
});

class Transition extends Component {
    state = {
        colors: [],
        selectedColor: {},
        seconds: 1,
        displayColorPicker: false
    };

    componentToHex = (c) => {
        var hex = c.toString(16);

        return hex.length === 1 ? `0${hex}` : hex;
    }

    rgbToHex = (r, g, b) => {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    /** Adds the color */
    handleChangeComplete = (color) => {
        const { r, g, b } = color;
        const colorHexadecimal = this.rgbToHex(r, g, b);

        this.setState(prevState => ({
            colors: [...prevState.colors, { id: this.state.colors.length, name: colorHexadecimal, rgb: { r, g, b } }],
            selectedColor: color
        }));
    }

    /** Sets the delay */
    handleValueSliderChange = (value) => {
        this.setState(prevState => ({
            seconds: value
        }));
    }

    /** Removes the color */
    handleColorRemove = (value) => {
        this.setState(prevState => ({
            colors: prevState.colors.filter((color) => {
                return color.id !== value;
            })
        }))
    }

    /** SetTransition */
    setTransition = () => {
        const colors = this.state.colors;
        const delay = this.state.seconds;

        Axios.put('/api/transition', {
            Colors: colors.map((color) => {
                const { r, g, b } = color.rgb;
                return [r, g, b];
            }),
            Delay: delay
        }).then(response => {
            // placeholder
        });
    }

    /** Stop all */
    stopAll = () => {
        console.log('Reseting all');

        this.setState({
            colors : [],
            seconds : 1
        });

        Axios.put('/api/stop', {
            value : 1
        }).then(response => {
            console.log(response);
        });
    }

    /** Popover for the color picker */
    handleClick = () => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
    }

    handleClose = () => {
        this.setState({
            displayColorPicker: false
        });
    }

    render() {
        const { classes } = this.props;
        const { colors, selectedColor, seconds, displayColorPicker } = this.state;

        const gradient = keyframes`
            0% {
                background-position: 0% 50%
            }
            50% {
                background-position: 100% 50%
            }
            100% {
                background-position: 0% 50%
            }
        `;

        const CustomPaper = styled(Paper) `
            && {
                background: ${ (colors.length === 0) ? `${'#FFFFFF'}` :
                                (colors.length === 1) ? `${colors.map((color) => color.name)}` :
                                 `linear-gradient(to right, ${colors.map((color) => color.name)})`}; 
                background-size: 200% 200%;
                background-position: 0 0;
                background-repeat: repeat-x;
                animation: ${gradient} 15s linear infinite;
            }
        `;

        return (
            <div>
                <div className={classes.root}>

                    {/* Color selected */}
                    <div className={classes.divPaperStyle}>
                        <CustomPaper className={classes.paperStyle} elevation={4}></CustomPaper>
                    </div>
                    <br /><br />

                    {/* Dialog color picker */}
                    <Dialog open={displayColorPicker} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <CustomPicker fields={false} presetColors={[]} disableAlpha color={selectedColor} addAction={this.handleChangeComplete} />
                    </Dialog>

                    {/* Color picker */}
                    <div className={classes.divSketchPickerStyle}>
                        <div>
                            <Button fab color="primary" aria-label="add" className={classes.button} onClick={this.handleClick} >
                                <AddIcon />
                            </Button>
                        </div>
                    </div>
                    <br /><br />

                    {/* Array of colors */}
                    <div>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container justify="center" spacing={8}>
                                    {
                                        colors.length === 0
                                            ?
                                            <Paper className={classes.paperInfoStyle} elevation={0}>
                                                <Typography type="caption" component="p">
                                                    Pick multiple colors. Click the button to open the dialog color picker, click outside the dialog to close it. Remove a color by taping on the colored circles appearing here
                                                </Typography>
                                            </Paper>
                                            :
                                            colors.map((color, key) =>
                                                <Grid key={key} item>
                                                    <Card className={classes.cardStyle} style={{ backgroundColor: color.name }}>
                                                        <CardActions className={classes.shadowIconButtonStyle}>
                                                            <IconButton className={classes.iconButtonStyle} aria-label="Delete" onClick={() => this.handleColorRemove(color.id)}>
                                                            </IconButton>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    <br /><br />

                    {/* Slider */}
                    <div className = { classes.divRCSliderStyle }>
                        {/* <Slider min={1} max={300} onChange={this.handleValueSliderChange} className={classes.rcSliderStyle} /> */}
                        <Slider min = { 1 } max = { 300 } value = { seconds } onChange={this.handleValueSliderChange} orientation = 'horizontal' className = { classes.rcSliderStyle } />
                    </div>
                    <br />
                    <div className = { classes.divRCSliderStyle }>
                        <Typography type="subheading" component="p">
                            {seconds} seconds
                        </Typography>
                    </div>
                    <br /><br />

                    {/* Button */}
                    {
                        colors.length > 0 &&
                            <div>
                                <div>
                                    <Tooltip placement="left" title={'Animate ' + colors.length + ' colors over ' + seconds + ' seconds'}>
                                        <Button fab mini color="accent" disabled = {colors.length === 0} onClick={this.setTransition} className={classes.fabButtonAbsoluteStyle} 
                                                style = { colors.length === 0 ? { color : "#A3A3A3", background : "#DCDCDC" } : { color : "#FFFFFF", background : "#FFD700" } }>
                                            <FlashOn />
                                        </Button>
                                    </Tooltip>
                                </div>
                                <br />
                                <div>
                                    <Tooltip placement="left" title = {'Reset All'}>
                                        <Button fab mini color="accent" disabled = {colors.length === 0} onClick={this.stopAll} className={classes.fabButtonAbsoluteStyleAux} 
                                                style = { colors.length === 0 ? { color : "#A3A3A3", background : "#DCDCDC" } : { color : "#FFFFFF", background : "#000000" } }>
                                            <FlashOff />
                                        </Button>
                                    </Tooltip>
                                </div>
                                <br />
                            </div>
                    }

                </div>
            </div>
        );
    }
}

Transition.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Transition);