[![Build Status](https://travis-ci.org/unosquare/ledemotion.svg?branch=LedEmotion-UI)](https://travis-ci.org/unosquare/ledemotion)

# LedEmotion

A very cool, Web-based RGB LED strip controller for the Raspberry Pi

This program drives an RGB LED Strip (```APA102C```) available from Adafruit ([Adafruit DotStar Digital LED Strip - Black 60 LED - Per Meter - BLACK](https://www.adafruit.com/products/2239)). It does so by using one of the ```SPI``` channels available on the RPi.

You will need a fairly powerful power supply to drive a 4m strip of 60 LEDs per meter ([5V 10A switching power supply](https://www.adafruit.com/product/658)).

*A Raspberry Pi 3 is recommended just because it's faster.*

## Table of Contents

- [Software Components](#software-components)
- [Running](#running)
  - [1. Installing mono on the Raspberry Pi](#1-installing-mono-on-the-raspberry-pi)
  - [2. Enable SPI](#2-enable-spi)
  - [3. Deploy and test continuously](#3-deploy-and-test-continuously)
  - [4. The ```rc.local``` file](#4-the-rclocal-file)
- [Miscellaneous](#miscellaneous)
  - [A. Practical example](#a-practical-example)
  - [B. Setting up dotnet-sshdeploy](#b-setting-up-dotnet-sshdeploy)

## Software Components
 - [EmbedIO](https://github.com/unosquare/embedio), to drive the web-based UI.
 - [RaspberryIO](https://github.com/unosquare/raspberryio), to interface with our hardware.
 - [SWAN](https://github.com/unosquare/swan), to avoid rewriting some basic building blocks like logging and bitmap management in out app.
 - [dotnet-sshdeploy](https://github.com/unosquare/sshdeploy), to perform continuous deployments to the RPi

*[Check](#a-practical-example) our proposed diagram to test the project*

## Running

### 1. Installing mono on the Raspberry Pi

```bash
# First, update and upgrade the distro
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install mono-complete
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
# If the command line above doesn't work for you, you need to install dirmngr:
# $ sudo apt-get install dirmngr
# and execute the command again
$ echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
$ sudo apt-get update
$ sudo apt-get dist-upgrade
$ sudo apt-get autoremove
$ sudo apt-get clean 
```

Now, go ahead and verify the version of mono

```bash
$ mono --version
```

You should get something above ```5.4.1.6```

### 2. Enable ```SPI```

```bash
$ sudo raspi-config
```

You'll get a GUI like this:

![Raspberry Pi Software Configuration Tool (raspi-config)](https://i.imgur.com/V4uQMYH.png)

Select  ```5 Interfacing Options``` from the menu and then select ```P4 SPI``` to enable SPI

![SPI](https://i.imgur.com/pU2ghgw.png)

### 3. Deploy and test continuously

*Before to continue with this tutorial, check [this](#b-setting-up-dotnet-sshdeploy)*


To kill the current mono process: 

```bash
$ sudo pkill mono
```

To start the mono process again:

```bash
$ sudo mono /home/pi/[container folder]/Unosquare.LedEmotion.Controller.exe
```

To see a list of processes:

* ```top```
* ```ps```
* ```htop``` (might need ```sudo apt-get install htop```)

### 4. The ```rc.local``` file

In the command line edit this file:

```bash
sudo nano /etc/rc.local
```

Then add the following line before ```exit 0```:
```bash
mono /home/pi/[container folder]/Unosquare.LedEmotion.Controller.exe &
```

 Just like this:

```bash
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.

# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

mono /home/pi/[container folder]/Unosquare.LedEmotion.Controller.exe &

exit 0
```

## Miscellaneous

#### A. Practical example

![Diagram](https://i.imgur.com/1xW8pXM.png)

![Schematic](https://i.imgur.com/VOH6h9p.png)

What do you need?

* 1 protoboard
* 1 Raspberry Pi 3 modelo B, v. 1.2
* 1 level shifter (```TXB0108```)
* 1 LED strip (```APA102C```. Available [here](https://www.adafruit.com/product/2239))
* 1 DC barrel jack adapter (female. Available [here](https://www.sparkfun.com/products/10288))
* 1 USB to micro USB wire (you'll only need a piece of wire that goes to the micro USB)
* Wires

Expectation:

![Expected](https://i.imgur.com/RWH5yBr.jpg)

Notes about the ```TXB0108```:

![TXB0108](https://i.imgur.com/xF7dDmx.jpg)

The ```TXB0108``` works bidirectionally. The A side works with a range voltage of ```1.2 V ~ 3.6 V```, and the B side with ```1.7 V ~ 7.5 V```. There's only one ground (```GND```/```MASA```). The wires that are connected in the ```MOSI``` and ```SCLK``` pins goes connected to the A input in the level shifter (choose between ```A1-A8 I/O```). In our case, we choose ```A1``` and ```A2``` and the outputs ```B1``` and ```B2``` (these ones goes connected to the LED strip).

*[back to the tutorial](#running)*

#### B. Setting up dotnet-sshdeploy

* SSHDeploy comes preconfigured with some default properties inside the .csproj file like:
``` xml
<PropertyGroup>
    <RunPostBuildEvent>OnBuildSuccess</RunPostBuildEvent>
    <SshDeployHost>172.16.17.54</SshDeployHost>
    <SshDeployTargetPath>/home/pi/ledemotion</SshDeployTargetPath>
    <SshDeployUsername>pi</SshDeployUsername>
    <SshDeployPassword>raspberry</SshDeployPassword>
</PropertyGroup>
```
These are just arguments for deploying LedEmotion via SSH using dotnet-sshdeploy and they can be modified to suit your needs. Click [here](https://github.com/unosquare/sshdeploy) for more information about dotnet-sshdeploy
``` xml
<Target Condition="$(BuildingInsideSshDeploy) ==''" Name="PostBuild" AfterTargets="PostBuildEvent">
    <Exec Command="cd $(ProjectDir)" />
    <Exec Command="dotnet sshdeploy push" />
  </Target>
```
* This target is what calls dotnet-sshdeploy after a successful build, we use it to automatically deploy LedEmotion using the defined properties explained above if you do not want to deploy every time you build LedEmotion you can remove this target and execute `dotnet sshdeploy push` in your project directory.  


*[back to the tutorial](#3-deploy-and-test-continuously)*