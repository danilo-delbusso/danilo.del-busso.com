---
title: 'Dragonboard 410c Ethernet to Wi-Fi Access Point with VPN'
description: 'How to set up a WiFi VPN Access Point using a Qualcomm Dragonboard 410c development board'
date: '2019-04-24'
tags: 'Dragonboard 410c_tutorial_VPN_openvpn_tutorial'
---
This set of commands and instructions are what I needed to do in order to set up a Wi-Fi access point on a Qualcomm Dragonboard 410c with a NordVPN connection.

Please read the disclaimers and list of items needed at the bottom of the page.

I will use [nano](https://www.nano-editor.org/) throughout this tutorial but you can obviously follow along with your favourite editor.

# Create Access Point

## 0. Before starting

You will need to connect the ethernet connection to the board using the adapter. 
Once you have successfully connected run the command:
```
ip a
```
and look for the names of the ethernet to usb, and the wifi adapter.

Look in the ***"Adapter Names"*** section of the appendix for more information.

From now on, I will be referring to the ethernet adapter as ***eth0*** and to the wifi one as ***wlan0***.

## 1. First steps
After flashing the firmware, you will need to install a few relevant packages.
Run the commands:
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install hostapd dnsmasq dhcpcd5 iptables iw rfkill bridge-utils
sudo apt-get install openvpn -y
```
now, stop the `hostapd` and `dnsmasq` processes by running:

```
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq
```

## 2.DHCPCD configuration

We now need to modify our `dhcpcd` configuration. 

```
sudo nano /etc/dhcpcd.conf
```
and add this to the bottom:
```
interface wlan0
    static ip_address=192.168.220.1/24
    nohook wpa_supplicant
```

save the file and restart the `dhcpcd` service:
```
sudo systemctl restart dhcpcd
```

### Disclaimer
I have noticed that this step, though crucial to the successfull configuration, will not allow you to use SSH to connect to the dragonboard. It will also block you from accessing the internet from the board. This step can also be done at the end so you can skip it for now.

## 3. Hostapd setup
We will need to create a hostapad configuration.

Create a new file at this location:
```
sudo nano /etc/hostapd/hostapd.conf
```
and add this text.
**FOR YOUR OWN SECURITY CHANGE THE ssid= AND wpa_passphrase= FIELDS**

```
interface=wlan0
driver=nl80211

hw_mode=g
channel=6
ieee80211n=1
wmm_enabled=0
macaddr_acl=0
ignore_broadcast_ssid=0

auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP

# This is the name of the network
ssid=Essos
# The network passphrase
wpa_passphrase=ValarMorghulis
```

then, edit the file at:
```
sudo nano /etc/default/hostapd
```
by subtituting the line
```
#DAEMON_CONF="" 
```
with
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```
notice we have deleted the `#`.

Save the file and do the same but for another file.
This time, edit the file
```
sudo nano /etc/init.d/hostapd
```
and replace
```
DAEMON_CONF= 
```
with
```
DAEMON_CONF=/etc/hostapd/hostapd.conf
```

## 4. dnsmasq setup
We rename the current configuration file by running the command
```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
```
then we open:
```
sudo nano /etc/dnsmasq.conf
```
and add the following lines:
```
interface=wlan0       # Use interface wlan0  
server=1.1.1.1       # Use Cloudflare DNS  
dhcp-range=192.168.220.50,192.168.220.150,12h # IP range and lease time 
```
save the file.

## 5. Forwarding traffic

First, we enable it throught the ***systctl.conf*** file.

```
sudo nano /etc/sysctl.conf
```

then remove the line
```
#net.ipv4.ip_forward=1
```
and replace it with
```
net.ipv4.ip_forward=1
```
In order to avoid rebooting to activate the changes we run:
```
sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
```

### Iptables

I had to follow [this comment on an iptables issue](https://github.com/netblue30/firejail/issues/2232#issuecomment-436423748)in order to run iptables on my dragonboard.

It suggested to run
```
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
```
in order to downgrade the iptables install to a version which supports the commands we will use

Run the following command to add new rules to the iptable:
```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

then save the rules

```
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```

and to make sure the settins are run when we boot edit the file:
```
sudo nano /etc/rc.local
```
find
```
exit 0
```
and add in an empty line above "exit 0"
```
iptables-restore < /etc/iptables.ipv4.nat
```

save, start hostapd and dnsmasq, and reboot

```
sudo service hostapd start
sudo service dnsmasq start
sudo reboot
```

# Create VPN Access Point

## 1. OpenVPN setup

I will be showing the setup for a NordVPN account, for VyprVPN, go to the original RaspberryPi tutorial [here](https://pimylifeup.com/raspberry-pi-vpn-access-point/)

### Authentication file

go to

```
cd /etc/openvpn
```
and create a new file

```
sudo nano /etc/openvpn/auth.txt
```

Insert NordVPN's email and password on two separate and adjacent lines, like this:

```
email
password
```
### Get the OpenVPN files 

go at the location
```
cd /etc/openvpn
```

Go to the [ovpn section on the NordVPN website](https://nordvpn.com/ovpn/).
Find the server you need, right click on the ***"Download UDP"*** button and copy the link by pressing ***"Copy Link Address"***.

paste the link address in this command
```
sudo wget <INSERT_LINK_HERE>
```

I have chosen the ***it91*** server. Change the next commands by substituing ***it91*** with your chosen server.

In order to make the rest of the tutorial slightly easier, rename the file you just downloaded. Also, we need to change the extension from .ovpn to .conf.

The file I downloaded is named ***it91.nordvpn.com.udp1194.ovpn***

I change its name by executing:

```
sudo mv it91.nordvpn.com.udp1194.ovpn it91.conf
```

## Setting up the VPN

Change the content of the newly renamed

```
sudo nano it91.conf
```
by deleting the line

```
auth-user-pass
```
and replacing it with
```
auth-user-pass auth.txt
```
save the file.

Now to automatically connect to this server on startup we modify the file
```
sudo nano /etc/default/openvpn
```
by replacing the line
```
#autostart="all"
```
with 
```
autostart="it91"
```

## Iptables setup
We need to flush our current iptables
```
sudo iptables -F
sudo iptables -t nat -F
sudo iptables -X
```
then install our new iptables

```
sudo iptables -t nat -A POSTROUTING -o tun0 -j MASQUERADE
```

and then overwrite the old rules from the tutorial without VPN
```
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```

## Create Bridge
The last step requires us to create a bridge between the ethernet and wifi ports.
We can do this by editing the file

```
sudo nano /etc/network/interfaces
```
and adding the following lines:

```
auto br0

iface br0 inet dhcp

bridge-ports eth0 wlan0
```

then we run the following two commands
```
sudo service network-manager stop

sudo rfkill unblock wlan
```
and we bring up the bridge ***br0*** 
```
sudo ifup br0
```
and run our hostapd configuration by running

```
sudo /etc/init.d/hostapd restart
```

finally, reboot the device

```
sudo reboot
```

# Appendix

## The host machine I used:
* Operating System: Manjaro Linux 
* KDE Plasma Version: 5.15.1
* KDE Frameworks Version: 5.55.0
* Qt Version: 5.12.1
* Kernel Version: 4.19.24-1-MANJARO
* OS Type: 64-bit
* Processors: 8 × Intel® Core™ i7-7700HQ CPU @ 2.80GHz
* Memory: 15.6 GiB of RAM

## Adapter Names
In my case, after running the 
`ip a` command (you could also run `sudo ifconfig`, though it is deprecated at the time of writing this tutorial) I obtained something on the lines of this result:
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enx008e8a8d9465: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether 88:d7:f6:1f:28:c9 brd ff:ff:ff:ff:ff:ff
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether f0:03:8c:ab:dc:89 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.192/24 brd 192.168.1.255 scope global dynamic noprefixroute wlp3s0
       valid_lft 20331sec preferred_lft 20331sec
    inet6 fe80::aee5:8162:f8c9:f2ea/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever

```
We ignore the `lo` and we notice that the wifi adapter is named ***wlan0*** and the ethernet to usb one is named ***enx008e8a8d9465***. Names are usually similar and easily spotted, especially if you run a clean install of Debian as I sugges you do. In that case, you should only see three results and it will be easy to spot which ones are the ones you need.


### DISCLAIMERS

🚨**THESE STEPS ARE THE ONES THAT WORKED FOR ME, I TAKE NO REPONSIBILITY IF ANYTHING DOES NOT GO AS PLANNED OR YOUR DEVICE/S ARE DAMAGED IN ANY WAY**🚨

#### Hardware

In order to reproduce the steps I made you will need:
* A host machine (I used my laptop, specs in the Appendix section)
* A Qualcomm Dragonboard 410c
* USB to microUSB cable
* A NordVPN or VyprVPN account
* Ethernet to USB adapter
* USB Mouse and/or keyboard (not required to perform flash)
* HDMI Monitor with full size HDMI cable (not required to perform flash)
#### Dragonboard Firmware
I suggest using Debian as it is the easiest to install and has the most support.
* [Download Page](https://www.96boards.org/documentation/consumer/dragonboard/dragonboard410c/downloads/debian.md.html) 
* [Installation instructions using a Linux host machine](https://www.96boards.org/documentation/consumer/dragonboard/dragonboard410c/downloads/debian.md.html)



In order to write this post, I combined these tutorials:
* [Raspberry-Pi Access Point](https://pimylifeup.com/raspberry-pi-wireless-access-point/)
* [Raspberry-Pi VPN Access Point](https://pimylifeup.com/raspberry-pi-vpn-access-point/)
* [Make a bridge Ethernet to WIFI](https://trisquel.info/en/wiki/make-bridge-ethernet-wifi)
