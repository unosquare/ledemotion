import React, { Component } from 'react';
import Axios from 'axios';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import DoneIcon from 'material-ui-icons/Done';
import { SketchPicker } from 'react-color';
import Typography from 'material-ui/Typography';
import { HuePickerProps } from 'react-color';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Info from 'material-ui-icons/Info';
import Input from 'material-ui/Input';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, } from 'material-ui/List';
import CustomPicker from '../Components/CustomPicker.jsx';
import Avatar from 'material-ui/Avatar';
import { CirclePicker } from 'react-color';
import Grid from 'material-ui/Grid';

const styles = theme => ({
    root: {
        flexgrow: 1,
        /* height: '380px', */
        /* position: 'absolute', */
        /* top: '0px', */
        /*right: '0px',
        left: '0px', */
        /* bottom: '0px',
        width: '100%' */


        /* marginTop: 20,
        paddingLeft: 50,
        paddingRight: 50, */
    },
    roote: {
        /* flexgrow: 1, */
        height: '380px',
        /* position: 'absolute', */
        top: '0px',
        /*right: '0px',
        left: '0px', */
        bottom: '0px',
        width: '100%',
        position: 'fixed'

        /* marginTop: 20,
        paddingLeft: 50,
        paddingRight: 50, */
    },
    typographyStyle: {
        color: '#FFF'
    },
    divSketchPickerStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paperStyle: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingBottom: 20,
        marginTop: theme.spacing.unit * 3,
        backgroundColor: '#2CCCE4',
    },
    iconStyle: {
        verticalAlign: "middle !important",
        paddingBottom: 3
    },
    typographyStyle: {
        color: '#FFF'
    },
    inputSelectedColorStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputStyle: {
        borderRadius: 6,
    },
    divSketchPickerStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        margin: "0 auto"
    },
    divStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /* width: "90%", */
        margin: "0 auto",
        /* height: "90%" */
    },
    cardStyle: {
        width: 50,
        height: 50,
        /* borderRadius : 60,
        alignItems: 'center',
        margin: '0 auto', */
        borderRadius: '50%',
        boxShadow: '4px 6px 20px grey'
    },
    shadowIconButtonStyle: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconButtonStyle: {
        width: 60,
        height: 60,
    },
    rowColorStyle: {
        /* width: '30%', */
        display: 'inline-block',
        margin: '0 auto'
    },
    rowTextStyle: {
        width: '50%',
        display: 'inline-block',
        /* margin: '0 auto' */
    },
    rowDeleteStyle: {
        width: '10%',
        display: 'inline-block',
        margin: '0 auto'
    },
    listItemStyle: {
        margin: '0 auto',
        width: '80%'
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
    colorPicker: {
        position: 'relative',
        width: '40%'
    },
    presetColorStyle: {
        paddingTop: 10,
        position: 'relative',
        width: '60%'
    }
});

class SingleColor extends Component {
    

    constructor(props){
        super(props)

        this.AddColor = this.AddColor.bind(this);

        this.state = {
            textColor: 'White',
            colors: [],
            background: '#7ED321',
            displayColorPicker: false,
            presetColors: [{ color: '#D0021B', title: "Arc" }, { color: '#F5A623', title: "Arc" }, { color: '#F8E71C', title: "Arc" },
            { color: '#8B572A', title: "Arc" }, { color: '#7ED321', title: "Arc" }, { color: '#417505', title: "Arc" },
            { color: '#BD10E0', title: "Arc" }, { color: '#9013FE', title: "Arc" }, { color: '#4A90E2', title: "Arc" }]
        };
    }

    componentDidMount = () => {
        this.GetColors()
    };

    GetColors = () => {
        Axios.get('/api/appstate')
            .then(response => {
                this.setState({ colors: this.state.presetColors })
                response.data.SolidColorPresets.forEach(element => {
                    var hexColor = '#' + this.ByteToHex(element.R) + this.ByteToHex(element.G) + this.ByteToHex(element.B);

                    this.setState({
                        colors: this.state.colors.concat({ color: hexColor, title: element.Name })
                    });

                });
            });
    }

    ByteToHex = (c) => {
        var hex = c.toString(16);

        return hex.length == 1 ? "0" + hex : hex;
    };

    AddColor = (result) => {
        console.log("Lok'tar Ogar")
        console.log(result)
        var presetName = prompt("Enter a name for the preset", "");

        if (presetName == null || presetName == "") {
            return;
        }

        /* var result = this.HexToRGB(this.state.background);
        console.log(result) */
        Axios.post('/api/preset', {
            Name: presetName,
            R: result.r,
            G: result.g,
            B: result.b
        }).then(() => { this.GetColors() });
    }

    DeleteColor = (presetName) => {
        Axios.delete('/api/preset', {
            data: { Name: presetName }
        }).then(() => { this.GetColors() });
    }

    ChangeTextColor = (rgb) => {
        var luma = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b; // per ITU-R BT.709

        if (luma < 170) {
            this.setState({ textColor: "White" })
        }
        else {
            this.setState({ textColor: "Black" })
        }
    }

    ChangeBackgroundColor = (color) => {
        this.setState(prevState => ({
            background: color
        }));
    }

    handleChange = (color, event) => {
        this.ChangeTextColor(color.rgb)
        this.ChangeBackgroundColor(color.hex)
        this.SetColor(color.rgb, true)
    }

    SelectColor = (color) => {
        var rgb = this.HexToRGB(color)
        this.ChangeTextColor(rgb)
        this.ChangeBackgroundColor(color)
        this.SetColor(rgb, true)
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    SetColor = (color, sendToApi) => {
        if (sendToApi !== true)
            return;

        Axios.put('/api/color', {
            F: 6,
            R: color.r,
            G: color.g,
            B: color.b
        }).then(() => { this.GetColors() });
    }

    HexToRGB = (a) => {
        var first = a[1] + a[2];
        var second = a[3] + a[4];
        var third = a[5] + a[6];
        var res = [first, second, third];

        for (var i = 0; i < res.length; i++) {
            res[i] = parseInt(res[i], 16);
        }

        var rgbColor = {
            r: res[0],
            g: res[1],
            b: res[2]
        }

        return rgbColor;
    }

    render() {
        const { classes } = this.props;
        const { textColor, selectedColor, background } = this.state;

        return (

            <div className={classes.root}  >
                <div className={classes.roote} style={{ backgroundColor: this.state.background }} />

                {/* Paper */}
                {/* <div >
                    <Paper className={classes.paperStyle} elevation={4}>
                        <Typography type="headline" component="h3" className={classes.typographyStyle}>
                            <Info className={classes.iconStyle} /> Pick and drag to set a solid color. You can save your selection as a preset
                        </Typography>
                    </Paper>
                </div> */}

                {/* Display color selected */}
                {/* <div className={classes.inputSelectedColorStyle}>
                    <Input
                        className={classes.inputStyle}
                        value={"\xa0\xa0" + background.toUpperCase()}
                        style={{ backgroundColor: background, color: textColor }}
                        disabled
                        disableUnderline>
                    </Input>

                    <IconButton
                        onClick={() => this.AddColor()}
                        color='default'>
                        <DoneIcon />
                    </IconButton>
                </div> */}
                <br/>
                <br/>
                {/* Color picker */}
                <div className={classes.divSketchPickerStyle}>
                    {/* <div className={classes.divStyle}> */}
                    {/* <CirclePicker
                        color={this.state.background}
                        onChangeComplete={this.handleChange}
                        width={400}
                        circleSize={54}
                        active={this.state.background}
                    /> */}
                    <div className={classes.colorPicker}>
                        <Typography type="headline" component="h3" className={classes.typographyStyle}>
                            Pick and drag to set a solid color. You can save your selection as a preset
                        </Typography>
                        <br />
                        <button onClick={this.handleClick}>Pick Color</button>

                        {this.state.displayColorPicker ? <div className={classes.popover}>
                            <div className={classes.cover} onClick={this.handleClose} />
                            <CustomPicker
                                action={this.AddColor}
                                presetColors={[]}
                                disableAlpha
                                color={background}
                                onChangeComplete={this.handleChange}
                            />

                        </div> : null}

                    </div>
                    <div className={classes.presetColorStyle}>
                        <Grid container className={classes.root}>
                            <Grid item xs={8} className={classes.divStyle}>
                                <Grid container justify="center" spacing={Number(8)}>
                                    {
                                        this.state.colors.map((color, key) =>


                                            <Grid key={key} item>
                                                <Card aria-label="Recipe" className={classes.cardStyle} style={{ backgroundColor: color.color }}>
                                                    <CardActions className={classes.shadowIconButtonStyle}>
                                                        <IconButton
                                                            className={classes.iconButtonStyle}
                                                            aria-label="Select"
                                                            onClick={() => this.SelectColor(color.color)} />
                                                    </CardActions>
                                                </Card>
                                            </Grid>

                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>

                    
                    {/* <CustomPicker
                        presetColors={[]}
                        width={400}
                        height={1}
                        disableAlpha
                        color={background}
                        onChangeComplete={this.handleChange}
                        fields={false}
                    /> */}
                    {/* </div> */}
                </div>

                {/* List of colors */}
                {/* <div className={classes.presetColorStyle}>
                    <Grid>
                        {
                            this.state.colors.map((color, key) =>


                                <div className={classes.rowColorStyle}>
                                    <Card aria-label="Recipe" className={classes.cardStyle} style={{ backgroundColor: color.color }}>
                                        <CardActions className={classes.shadowIconButtonStyle}>
                                            <IconButton
                                                className={classes.iconButtonStyle}
                                                aria-label="Select"
                                                onClick={() => this.SelectColor(color.color)} />
                                        </CardActions>
                                    </Card>
                                </div>

                            )
                        }
                    </Grid>
                </div> */}
                <br />

            </div>
        );
    }
}

export default withStyles(styles)(SingleColor);