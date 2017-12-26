import React, { Component } from 'react';
import Axios from 'axios';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
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
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle, } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/Add';

const styles = theme => ({
    root: {
        flexgrow: 1
    },
    roote: {
        height: '380px',
        top: '0px',
        bottom: '0px',
        width: '100%',
        position: 'fixed'
    },
    typographyStyle: {
        color: '#FFF'
    },
    divSketchPickerStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        margin: "0 auto",
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
    divStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto"
    },
    cardStyle: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        boxShadow: '2px 4px 5px #bbbbbb'
    },
    iconButtonStyle: {
        height: '100%',
        width: '100%'
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

const mql = window.matchMedia(`(min-width: 800px)`);

class SingleColor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            mql: mql,
            docked: false,
            textColor: 'White',
            colors: [],
            open: false,
            background: '#7ED321',
            presetName: '',
            color: [],
            displayColorPicker: false,
            presetColors: [{ color: '#D0021B', title: "Arc" }, { color: '#F5A623', title: "Arc" }, { color: '#F8E71C', title: "Arc" },
            { color: '#8B572A', title: "Arc" }, { color: '#7ED321', title: "Arc" }, { color: '#417505', title: "Arc" },
            { color: '#BD10E0', title: "Arc" }, { color: '#9013FE', title: "Arc" }, { color: '#4A90E2', title: "Arc" }]
        };

        this.HandleDialogOpen = this.HandleDialogOpen.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    componentDidMount = () => {
        this.GetColors()
    };

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({ mql: mql, docked: mql.matches });
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        this.setState({
            mql: mql,
            docked: this.state.mql.matches,
        });
    }

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

    AddColor = () => {
        if (this.state.presetName == null || this.state.presetName == "") {
            return;
        }

        Axios.post('/api/preset', {
            Name: this.state.presetName,
            R: this.state.color.r,
            G: this.state.color.g,
            B: this.state.color.b
        }).then(() => { this.GetColors() }, this.HandleDialogClose());
    }

    ResetValues = () => {
        this.setState({ presetName: '', color: [] });
    }

    HandleDialogOpen = (rgb) => {
        this.setState({ open: true, color: rgb });
    };

    HandleDialogClose = () => {
        this.setState({ open: false });
        this.ResetValues()
    };

    ColorPickerCom = (props) => {
        var display = ''
        var colorPickerWidth = ''
        var presetColorWidth = ''

        if (this.state.docked == false) {
            display = 'grid'
            colorPickerWidth = '100%'
            presetColorWidth = '100%'
        }
        else {
            display = 'flex'
            colorPickerWidth = '40%'
            presetColorWidth = '60%'
        }

        return (
            <div style={{
                display: display,
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
                margin: "0 auto"
            }}
            >
                <Dialog
                    open={this.state.displayColorPicker}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <CustomPicker
                        action={this.HandleDialogOpen}
                        presetColors={[]}
                        disableAlpha
                        width={250}
                        color={props.background}
                        onChangeComplete={this.handleChange}
                    />
                </Dialog>

                <div className={props.classes.colorPicker} style={{ width: colorPickerWidth, marginBottom: '40px' }}>
                    <Typography style={{ color: props.textColor, textAlign: 'center' }} type="headline" component="h3">
                        Pick and drag to set a solid color. You can save your selection as a preset
                    </Typography>
                    <br />

                    <div style={{ textAlign: 'center' }}>
                        <Button raised onClick={this.handleClick} style={{ height: '40px', width: '60%' }}>Pick Color</Button>
                    </div>
                </div>

                <div className={props.classes.presetColorStyle} style={{ width: presetColorWidth, marginBottom: '40px' }}>
                    <Grid container className={props.classes.root}>
                        <Grid item xs={8} className={props.classes.divStyle}>
                            <Grid container justify="center" spacing={Number(8)}>
                                {
                                    this.state.colors.map((color, key) =>
                                        <Grid key={key} item>
                                            <Card aria-label="Recipe" className={props.classes.cardStyle} style={{ backgroundColor: color.color }} title={color.title}>
                                                <IconButton
                                                    className={props.classes.iconButtonStyle}
                                                    aria-label="Select"
                                                    onClick={() => this.SelectColor(color.color)} />
                                            </Card>
                                            
                                        </Grid>
                                    )
                                }

                                <Card aria-label="Recipe" className={props.classes.cardStyle} style={{ backgroundColor: 'white' }} title='Add Color'>
                                    <IconButton
                                        className={props.classes.iconButtonStyle}
                                        aria-label="Select"
                                        onClick={() => this.setState({ displayColorPicker: true })} >
                                        <AddIcon />
                                    </IconButton>
                                </Card>

                            </Grid>
                        </Grid>
                    </Grid>
                </div>

            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { textColor, selectedColor, background } = this.state;

        return (

            <div className={classes.root}  >
                <div className={classes.roote} style={{ backgroundColor: this.state.background }} />

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Preset Name</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the new preset name.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Preset Name"
                            type="text"
                            fullWidth
                            onChange={(event) => this.setState({ presetName: event.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.HandleDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.AddColor} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <br />
                <br />

                {/* Color picker */}
                <this.ColorPickerCom classes={classes} background={background} textColor={textColor} />

                <br />
            </div>
        );
    }
}

export default withStyles(styles)(SingleColor);