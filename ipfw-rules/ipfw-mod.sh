SPATH=$(dirname $0)

# making sure old rules & related pipes are removed...
source $SPATH/ipfw-rm-include.sh
sudo ipfw pipe 1 delete
sudo ipfw pipe 2 delete

# adding pipes...
sudo ipfw add pipe 1 out via en1
sudo ipfw add pipe 2 in via en1

# adding pipe configs...
source $SPATH/ipfw-mod-include.sh

