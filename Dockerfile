FROM ubuntu:14.04

RUN apt-get update && apt-get -y install git ncbi-blast+ emboss libxml2 libxml2-dev libxml2-utils build-essential zlib1g-dev
RUN apt-get update && apt-get -y install vim man-db

# SSH keys for accessing DNAssemble source
RUN mkdir /root/.ssh
COPY .ssh/ /root/.ssh/

RUN mkdir /work
WORKDIR /work
RUN cpan LWP::UserAgent

# Install the prerequisites for dnaassemble
RUN git clone git@bitbucket.org:notadoctor/dnassemble.git /work/dnassemble
RUN cd dnassemble && perl Build.PL && ./Build installdeps

# Install bioperl-run
RUN git clone https://github.com/bioperl/bioperl-run.git /work/bioperl-run
RUN cd /work/bioperl-run && perl Build.PL && ./Build installdeps && ./Build install

# Install Gene Design
RUN git clone https://bitbucket.org/notadoctor/genedesign-dev /work/genedesign-dev 
RUN cd /work/genedesign-dev && perl Build.PL && ./Build installdeps && ./Build test && ./Build install

# Install DNassemble for real this time
RUN cpan  XML::LibXML
RUN cd /work/dnassemble && perl Build.PL && ./Build && ./Build test && ./Build install


# Instructions
# 
# In the directory with the Dockerfile
#  
#   docker stop $(docker ps -aq) &&  docker build -t dnass . &&  docker run -t --rm --privileged dnass
#
# To get to the command line
# 
#  docker exec -it `docker ps -ql` bash
