import React, { Component } from 'react';
import Axios from 'axios';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import CustomPicker from '../Components/CustomPicker.jsx';
import Grid from 'material-ui/Grid';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle, } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/Add';
import Tooltip from 'material-ui/Tooltip';

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
        boxShadow: '2px 4px 5px #c2bebe'
    },
    iconButtonStyle: {
        height: '100%',
        width: '100%',
        margin: '0px 0px 2px 0px',
        color: 'Black'
    },
    colorPicker: {
        position: 'relative',
        width: '40%'
    },
    presetColorStyle: {
        paddingTop: 10,
        position: 'relative',
        width: '60%'
    },
    fabButtonAbsoluteStyle: {
        flip: false,
        position: 'absolute',
        bottom: 32,
        right: 32,
        transition: 'none'
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
            addOpen: false,
            deleteOpen: false,
            background: '#7ED321',
            presetName: '',
            color: [],
            displayColorPicker: false,
            presetColors: [{ color: '#D0021B', title: "Red" }, { color: '#F5A623', title: "Orange" }, { color: '#F8E71C', title: "Yellow" },
            { color: '#8B572A', title: "Brown" }, { color: '#7ED321', title: "Green" }, { color: '#3A5F0B', title: "Green Leaf" },
            { color: '#CC4AE2', title: "Pink" }, { color: '#9013FE', title: "Purple" }, { color: '#4A90E2', title: "Blue " }]
        };

        this.HandleAddDialogOpen = this.HandleAddDialogOpen.bind(this);
        this.HandleDeleteDialogOpen = this.HandleDeleteDialogOpen.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.SelectColor = this.SelectColor.bind(this);
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
                this.setState({
                    colors: this.state.colors.concat({ color: 'White', title: 'Add Color' })
                });
            });
    }

    ByteToHex = (c) => {
        var hex = c.toString(16);

        return hex.length == 1 ? "0" + hex : hex;
    };

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
        this.ResetValues()
    }

    SelectColor = (color) => {
        var rgb = this.HexToRGB(color.color)
        this.setState({ presetName: color.title })
        this.ChangeTextColor(rgb)
        this.ChangeBackgroundColor(color.color)
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

    ResetValues = () => {
        this.setState({ presetName: '', color: [] });
    }

    HandleAddDialogOpen = (rgb) => {
        this.setState({ addOpen: true, color: rgb });
    };

    HandleAddDialogClose = () => {
        this.setState({ addOpen: false });
        this.ResetValues()
    };

    HandleDeleteDialogOpen = () => {
        this.setState({ deleteOpen: true });
    };

    HandleDeleteDialogClose = () => {
        this.setState({ deleteOpen: false });
        this.ResetValues()
    };

    DeleteColor = () => {
        Axios.delete('/api/preset', {
            data: { Name: this.state.presetName }
        }).then(() => { this.GetColors() }, this.HandleDeleteDialogClose());
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
        }).then(() => { this.GetColors() }, this.HandleAddDialogClose());
    }

    ColorCard = (props) => {
        if (props.color.title != 'Add Color') {
            return (
                <div>
                    <Card aria-label="Recipe" className={props.classes.cardStyle} style={{ backgroundColor: props.color.color }} title={props.color.title}>
                        <CardActions style={{ padding: '0px' }}>
                            <IconButton
                                className={props.classes.iconButtonStyle}
                                aria-label="Select"
                                onClick={() => props.action(props.color)}
                            />
                        </CardActions>
                    </Card>

                </div>
            )
        }
        else {
            return (
                <Card aria-label="Recipe" className={props.classes.cardStyle} style={{ backgroundColor: 'white' }} title='Add Color'>
                    <IconButton
                        className={props.classes.iconButtonStyle}
                        aria-label="Select"
                        onClick={() => this.setState({ displayColorPicker: true })} >
                        <AddIcon />
                    </IconButton>
                </Card>
            )
        }
    }

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
                        addAction={this.HandleAddDialogOpen}
                        deleteAction={this.HandleDeleteDialogOpen}
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
                                            <this.ColorCard classes={props.classes} color={color} action={this.SelectColor} />
                                        </Grid>
                                    )
                                }
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
                    open={this.state.addOpen}
                    onClose={this.HandleAddDialogClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Save Preset</DialogTitle>
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
                        <Button onClick={this.HandleAddDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.AddColor} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.deleteOpen}
                    onClose={this.HandleDeleteDialogClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Delete Preset</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the name of the preset you want to delete.
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
                        <Button onClick={this.HandleDeleteDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.DeleteColor} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <br />
                <br />

                {/* Color picker */}
                <this.ColorPickerCom classes={classes} background={background} textColor={textColor} />

                {/* Tooltip */}
                <div>
                    <Tooltip placement="bottom" title={"Delete Selected Color"}>
                        <IconButton
                            className={classes.fabButtonAbsoluteStyle}
                            onClick={this.DeleteColor}
                            style={{ color: textColor, backgroundColor: background}} 
                        >
                        <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>

                <br />
            </div>
        );
    }
}

export default withStyles(styles)(SingleColor);