# Totally simple testing, ya'll. The app has to be running on 
# tagbetter.local:80 and CouchDB is listening on localhost:5984. Further, you 
# need a configuration file in test/config like so:
#
#     username=''
#     password=''
#     host=''
#
# And you have to run it from the project root (./test/test.sh).
#
# Yep. It's janky.

source 'test/config'

curl -i -c tmp/cookies.txt \
        -d username=$username \
        -d password=$password \
        http://$host/login

sleep 1 # For delicious

curl -b tmp/cookies.txt \
     -H 'Accept: application/json' \
     http://$host/$username/bundles

sleep 1 # For delicious

curl -b tmp/cookies.txt \
     -H 'Accept: application/json' \
     http://$host/$username/tags

sleep 1 # For delicious

curl -b tmp/cookies.txt \
     -H 'Accept: application/json' \
     http://$host/$username/tags/search?q=css
