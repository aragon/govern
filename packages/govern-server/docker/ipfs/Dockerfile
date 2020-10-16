FROM ipfs/go-ipfs:v0.4.23
COPY ./swarm.key /data/ipfs/swarm.key
COPY ./init.sh /usr/local/bin/start_ipfs
RUN chown ipfs:users /usr/local/bin/start_ipfs && chmod +x /usr/local/bin/start_ipfs
