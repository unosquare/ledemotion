import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import SettingsIcon from 'material-ui-icons/Settings';
import PropTypes from 'prop-types';
import Routes from './Constants/Routes.jsx';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { Link, Redirect, HashRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import WbSunny from 'material-ui-icons/WbSunny';
import SettingsDialog from './Components/SettingsDialog.jsx';

const drawerWidth = 240;
const primary = '#8BC34A';

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        marginTop: 0,
        zIndex: 1,
        overflow: 'hidden'
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    appBar: {
        backgroundColor: primary,
        position: 'absolute',
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`
        }
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    drawerHeader: theme.mixins.toolbar,
    drawerPaper: {
        width: 250,
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            position: 'relative',
            height: '100%'
        },
        borderRightStyle: 'none'
    },
    content: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: '100%',
        marginTop: 66,
        overflowY: 'scroll',
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 70
        },
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`
        }
    },
    routes: {
        minHeight: 'calc(100% - 75px)'
    },
    link: {
        textDecoration: 'none',
        color: '#FFFFFF'
    },
    unosquareLink : {
        textDecoration: 'none',
        color : "#8BC34A",
    },
    spacer: {
        flex: '1 1 100%'
    },
    footer: {
        padding: 16,
        textAlign: 'center'
    }
  });

class App extends Component {
    state = {
        mobileOpen: false,
        isSettingsDialogOpen: false
    }
  
    handleDrawerToggle = () => this.setState({ 
        mobileOpen : !this.state.mobileOpen 
    });

    handleDialogClose = () => this.setState({
            isSettingsDialogOpen : false
        })

    handleDialogOpen = () => this.setState({
            isSettingsDialogOpen : true
        })

    render() {
        const { classes } = this.props;
        const drawer = (
            <div>
                <div>
                    <div className={classes.drawerHeader} style={{ display: 'flex', justifyContent: 'center' }} >
                        <Typography style = {{overflow : 'visible', margin: 'auto', width: 'auto', display: 'block'}} type='title' noWrap><WbSunny /> LED Emotion</Typography>
                    </div>
                    <Divider />
                    <List>
                    {
                        Routes.map((route, index) =>
                            route.linkTo && 
                                <Link key={index} className={classes.link} to={route.linkTo}>
                                    <ListItem button>
                                        <ListItemIcon>{ route.icon() }</ListItemIcon>
                                        <ListItemText primary = {route.iconText} />
                                    </ListItem>
                                </Link>
                        )
                    }
                    </List>
                    
                </div>
            </div>
      );

      return (
          <Router>
            <div className = { classes.root }>
                <div className = { classes.appFrame }>
                    <AppBar className = { classes.appBar }>
                        <Toolbar>
                            <IconButton color = 'default' aria-label = 'open drawer' onClick = { this.handleDrawerToggle } className = { classes.navIconHide }>
                                <MenuIcon color = "contrast" />
                            </IconButton>
                            {Routes.map((route, index) => (
                                <Route key={index} path={route.path} exact={route.exact} component={route.title} />
                            ))}
                            <div className={classes.spacer}></div>
                            <IconButton onClick={this.handleDialogOpen}>
                                <SettingsIcon color = "contrast" />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                        <Drawer type='temporary' open={this.state.mobileOpen} classes = {{ paper: classes.drawerPaper }} onClose = { this.handleDrawerToggle } ModalProps = {{
                                keepMounted: true // Better open performance on mobile.
                            }}>
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden mdDown implementation = 'css'>
                        <Drawer type = 'permanent' open classes = {{ paper: classes.drawerPaper }}>
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <main className = { classes.content }>
                        <div className={classes.routes}>
                            <Switch>
                                {Routes.map((route, index) => (
                                    <Route key = { index } path = { route.path } exact = { route.exact } component = { route.main } />
                                ))}
                            </Switch>
                        </div>
                        <Typography type = 'caption' className = { classes.footer }>
                            Copyright © 2017 - 2018 <a href = 'https://www.unosquare.com/' target = '_blank' className = { classes.unosquareLink }>Unosquare</a> - All rights reserved
                        </Typography>
                    </main>
                </div>                
                <SettingsDialog open={this.state.isSettingsDialogOpen} handleClose={this.handleDialogClose} /> 
            </div>
        </Router>
      );
    }
  }

App.propTypes = {
    classes : PropTypes.object.isRequired
};

export default withStyles(styles)(App);