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

echo "\n===== Login ====="
curl -i -c tmp/cookies.txt \
        -d username=$username \
        -d password=$password \
        http://$host/login

sleep 1 # For delicious

echo "\n===== Bundles ====="
curl -i -b tmp/cookies.txt \
     -H 'Accept: application/json' \
     http://$host/bundles

sleep 1 # For delicious

echo "\n===== Tags ====="
curl -i -b tmp/cookies.txt \
     -H 'Accept: application/json' \
     http://$host/tags

sleep 1 # For delicious

echo "\n===== Search ====="
curl -i -b tmp/cookies.txt \
     -H 'Accept: application/json' \
     http://$host/tags/search?q=css

sleep 1 # For delicious

echo "\n===== Update ====="
curl -i -b tmp/cookies.txt \
     -d '{"name": "plugtwo", "tags": ["ruby", "css"]}' \
     http://$host/bundles
