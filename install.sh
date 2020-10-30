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

echo "(installs everything)"
