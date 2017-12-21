import React, { Component } from 'react';
import Typography from 'material-ui/Typography';

import Status from '../Routes/Status.jsx';
import Info from 'material-ui-icons/Info';

import SingleColor from '../Routes/SingleColor.jsx';
import ColorLens from 'material-ui-icons/ColorLens';

import Transition from '../Routes/Transition.jsx';
import InsertChart from 'material-ui-icons/InsertChart';

import CustomImage from '../Routes/CustomImage.jsx';
import CropOriginal from 'material-ui-icons/CropOriginal';

const style = {
    overflow: 'visible',
    color: 'black'
};

const routes = [
    {
        path: '/',
        exact: true,
        title: () => <Typography style={style} noWrap type='title' noWrap>Status</Typography>,
        main: () => <Status />,
        linkTo: '/',
        icon: () => <Info />,
        iconText: 'Status'
    },
    {
        path : '/singlecolor',
        exact: true,
        title: () => <Typography style={style} noWrap type='title' noWrap>Single Color</Typography>,
        main: () => <SingleColor />,
        linkTo: 'singlecolor',
        icon: () => <ColorLens />,
        iconText: 'Single Color'
    },
    {
        path : '/transition',
        exact: true,
        title: () => <Typography style={style} noWrap type='title' noWrap>Transition</Typography>,
        main: () => <Transition />,
        linkTo: 'transition',
        icon: () => <InsertChart />,
        iconText: 'Transition'
    },
    {
        path : '/customimage',
        exact: true,
        title: () => <Typography style={style} noWrap type='title' noWrap>Custom Image</Typography>,
        main: () => <CustomImage />,
        linkTo: 'customimage',
        icon: () => <CropOriginal />,
        iconText: 'Custom Image'
    }
];

module.exports = routes;