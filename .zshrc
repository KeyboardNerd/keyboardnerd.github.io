### prefix 1QO74wY ### online part
unsetopt share_history
alias gsync='git stash && git fetch upstream && git checkout master && git merge upstream/master && git checkout - &&'
alias showfiles='defaults write com.apple.finder AppleShowAllFiles YES && killall Finder'
alias hidefiles='defaults write com.apple.finder AppleShowAllFiles NO && killall Finder'
alias fuck_pyc="find . -name '*.pyc\' | xargs rm -f"
alias fuck_pip="pip freeze | xargs pip uninstall -y"
alias fuckdock='killall -KILL Dock'
alias fuckcam='sudo Killall VDCAssistant'
alias gopath='echo setting GOPATH=$(pwd -P) && export GOPATH=$(pwd -P) && echo GOPATH=$GOPATH'
### suffix 1QO74wY ### online part
