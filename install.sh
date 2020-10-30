<<<<<<< HEAD
os_is_ubuntu=false

if command -v lsb_release &> /dev/null; then
	if [ "$(lsb_release -i | cut -f2)" == "Ubuntu" ]; then
		if [ "$(lsb_release -r | cut -f2)" == "18.04" ]; then
			os_is_ubuntu=1804
			echo "Detected Ubuntu 18.04"
		elif [ "$(lsb_release -r | cut -f2)" == "20.04" ]; then
			os_is_ubuntu=2004
			echo "Detected Ubuntu 20.04"
		else
			echo "It apprears you are running Ubuntu, but you are not using a version Fluvicast has been tested on. Some Ubuntu-specific commands may not work as expected. Alternatively, you can choose to install components from source, which is compatible with other Unix-like OSes, but requires to recompile the components."
			read -p "Type [U] if you want to install the Ubuntu way, type [O] to install from source, type [A] to abort: " choice
			case "$choice" in
				u|U )
					echo "Setting to use Ubuntu-specific commands"
					os_is_ubuntu=1804
					;;
				o|O )
					echo "Setting to install components from source."
					;;
				a|A )
					echo "Aborting install. No changes have been made."
					exit 0
					;;
				* )
					echo "Invalid reply, defaulting to abort. No changes have been made."
					exit 0
					;;
			esac
		fi
	else
		echo "This OS doesn't seem to be Ubuntu, setting to install components from source"
	fi
else
	echo "This OS doesn't seem to be Ubuntu, setting to install components from source"
fi

echo
echo ============================
echo "Let's review the settings!"
echo "Installing for Ubuntu : $os_is_ubuntu"

read -p "Is this correct? (y/n) " choice
	case "$choice" in
=======
# echo "This is a work-in-progress, please use the steps given in README.md and run them manually"
# exit 0

os_is_ubuntu=$false

if command -v lsb_release &> /dev/null; then
	if [ "$(lsb_release -i | cut -f2)" == "Ubuntu" ]; then
		if [ "$(lsb_release -r | cut -f2)" == "18.04" ]; then
			os_is_ubuntu="18.04"
			echo "Detected Ubuntu 18.04"
		elif [ "$(lsb_release -r | cut -f2)" == "20.04" ]; then
			os_is_ubuntu="20.04"
			echo "Detected Ubuntu 20.04"
		else
			echo "It apprears you are running Ubuntu, but you are not using a version Fluvicast has been tested on. Some Ubuntu-specific commands may not work as expected. Alternatively, you can choose to install components from source, which is compatible with other Unix-like OSes, but requires to recompile the components."
			read -p "Type [U] if you want to install the Ubuntu way, type [O] to install from source, type [A] to abort: " choice
			case "$choice" in
				u|U )
					echo "Setting to use Ubuntu-specific commands"
					os_is_ubuntu="18.04"
					;;
				o|O )
					echo "Setting to install components from source."
					os_is_ubuntu=$false
					;;
				a|A )
					echo "Aborting install. No changes have been made."
					exit 0
					;;
				* )
					echo "Invalid reply, defaulting to abort. No changes have been made."
					exit 0
					;;
			esac
		fi
	else
		echo "This OS doesn't seem to be Ubuntu, setting to install components from source"
		os_is_ubuntu=$false
	fi
else
	echo "This OS doesn't seem to be Ubuntu, setting to install components from source"
	os_is_ubuntu=$false
fi

echo
echo ============================
echo "Let's review the settings!"
echo "Installing for Ubuntu : $os_is_ubuntu"

read -p "Is this correct? (y/n) " choice
case "$choice" in
>>>>>>> b2fc6e268dc9f53131fe8e84fa10af369e5e6e47
	y|Y )
		echo "Let's go!"
		;;
	n|N )
		echo "Aborting install. No changes have been made."
		exit 0
		;;
	* )
		echo "Invalid reply, defaulting to abort. No changes have been made."
		exit 0
		;;
esac

<<<<<<< HEAD
echo "(installs everything)"
=======
# make the folders if necessary
sudo mkdir -p /var/fluvicast/
sudo mkdir -p /var/u-fluvicast/
sudo mkdir -p /etc/fluvicast/ssl/

sudo openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -keyout /etc/fluvicast/ssl/fluvicast.key -out /etc/fluvicast/ssl/fluvicast.crt -subj "/CN=fluvicast.com" -addext "subjectAltName=DNS:fluvicast.com,DNS:fluvicast.me"

if [ $os_is_ubuntu ]; then
	# install everthing at once
	sudo apt-get -y install nodejs npm mongodb nginx libnginx-mod-rtmp lua5.2 lua5.2-dev
	# Unnecessary for production-only environment : npm
	# Unnecessary for enviroments without fluvicast.me equivalents : lua5.2 lua5.2-dev
else
	# Install everything from source
	echo "Compiling from source not supported yet, sorry!"
	exit 1
fi

echo 
echo "MELN stack successfully installed!"

PS3='Would you like to install the needed NodeJS packages? '
options=("Install packages" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Install packages")
            break
            ;;
        "Quit")
            exit 0
            ;;
        *) echo "invalid option $REPLY - type a number (1, 2) or the label corresponding to your option";;
    esac
done

# TODO:
#	find out what are the damn dependencies of this project
#	Install the necessary NodeJS packages
>>>>>>> b2fc6e268dc9f53131fe8e84fa10af369e5e6e47
