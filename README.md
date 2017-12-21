[![Build Status](https://travis-ci.org/unosquare/ledemotion.svg?branch=LedEmotion-UI)](https://travis-ci.org/unosquare/ledemotion)

# LedEmotion

A very cool, Web-based RGB LED strip controller for the Raspberry Pi

This program drives an RGB LED Strip (APA102C) available from Adafruit [Adafruit DotStar Digital LED Strip - Black 60 LED - Per Meter - BLACK](https://www.adafruit.com/products/2239). It does so by using one of the SPI channels available on the RPi.

You will need a fairly powerful power supply to drive a 4m strip of 60 LEDs per meter ([5V 10A switching power supply](https://www.adafruit.com/product/658)).

*A Raspberry Pi 3 is recommended just because it's faster.*

## Components
 - [EmbedIO](https://github.com/unosquare/embedio), to drive the web-based UI.
 - [RaspberryIO](https://github.com/unosquare/raspberryio), to interface with our hardware.
 - [SWAN](https://github.com/unosquare/swan), to avoid rewriting some basic building blocks like logging and bitmap management in out app.
 - [SshDeploy](https://github.com/unosquare/sshdeploy), to perform continuous deployments to the RPi

## Running

### 1. Update and upgrade the distro. Install mono on the Raspberry Pi

```bash
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

### 2. Enable SPI

```bash
$ sudo raspi-config
```

You'll get a GUI like this:


![Raspberry Pi Software Configuration Tool (raspi-config)](https://i.imgur.com/V4uQMYH.png)

Select  ```5 Interfacing Options``` from the menu and then select ```P4 SPI``` to enable SPI

![SPI](https://i.imgur.com/pU2ghgw.png)

### 3. Deploy and test continuously

*Before to continue with this tutorial, check [this](#miscellaneous)*

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

### 4. In the command line edit ```/etc/rc.local```

```bash
sudo nano /etc/rc.local
```

### 5. Then add the following line before ```exit 0```:
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

#### A. Setting up SSHDeploy

* SSHDeploy comes preconfigured with some default properties inside the csproj file like:
``` xml
<PropertyGroup>
    <RunPostBuildEvent>OnBuildSuccess</RunPostBuildEvent>
    <SshDeployHost>172.16.17.54</SshDeployHost>
    <SshDeployTargetPath>/home/pi/ledemotion</SshDeployTargetPath>
    <SshDeployUsername>pi</SshDeployUsername>
    <SshDeployPassword>raspberry</SshDeployPassword>
</PropertyGroup>
```
* These are just arguments for deploying ledemotion via ssh using SSHDeploy and they can be modified to suit your needs. Click [here](https://github.com/unosquare/sshdeploy) for more information about SSHDeploy
``` xml
<Target Condition="$(BuildingInsideSshDeploy) ==''" Name="PostBuild" AfterTargets="PostBuildEvent">
    <Exec Command="cd $(ProjectDir)" />
    <Exec Command="dotnet sshdeploy push" />
  </Target>
```
* This target is what calls sshdeploy after a successful build, we use it to automatically deploy ledemotion using the defined properties explained above if you do not want to deploy every time you build ledemotion you can remove this target and execute `dotnet sshdeploy push` in your project directory.  


*[back to the tutorial](#3-deploy-and-test-continuously)*
