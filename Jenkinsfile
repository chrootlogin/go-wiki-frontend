pipeline {
  agent { label 'x86' }
  options {
    checkoutToSubdirectory('src/github.com/chrootlogin/go-wiki-frontend')
  }

  environment {
    DOCKER_TAG = GetDockerTag()
    GITEA_URL = "https://code.dini-mueter.net/simu/go-wiki-frontend.git"
    GITHUB_URL = "https://github.com/chrootLogin/go-wiki-frontend.git"
  }

  stages {
    stage('Build: WebApp & Plugin') {
      steps {
        ansiColor('xterm') {
          script {
            env.GOPATH = "${WORKSPACE}"
            env.PATH="${GOPATH}/bin:$PATH"
          }

          sh 'go version'

          sh 'go get -u github.com/go-bindata/go-bindata/...'

          dir('src/github.com/chrootlogin/go-wiki-frontend') {
            sh 'make clean web_app go_plugin'
          }
        }
      }
    }

    stage('Upload plugin') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'bin-admin', passwordVariable: 'BIN_PASSWORD', usernameVariable: 'BIN_USERNAME')]) {
          dir('src/github.com/chrootlogin/go-wiki-frontend') {
            sh 'curl -v -u "${BIN_USERNAME}:${BIN_PASSWORD}" --upload-file frontend_plugin https://bin.dini-mueter.net/repository/binary.hosted/go-wiki/plugins/frontend-plugin/${BRANCH_NAME}/frontend_plugin'
          }
        }
      }
    }

    stage('Docker: Registry login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'bin-admin', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          sh 'echo "${DOCKER_PASSWORD}" | sudo docker login -u ${DOCKER_USERNAME} --password-stdin https://docker.bin.dini-mueter.net'
        }
      }
    }

    stage('Docker: Build and push branch tag') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'bin-admin', passwordVariable: 'BIN_PASSWORD', usernameVariable: 'BIN_USERNAME')]) {
          ansiColor('xterm') {
            sh 'sudo docker build --build-arg VCS_REF=`git rev-parse --short HEAD` --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` --build-arg "BIN_USER=${BIN_USERNAME}" --build-arg "BIN_PASS=${BIN_PASSWORD}" -t docker.bin.dini-mueter.net/simu/go-wiki-frontend:${DOCKER_TAG} src/github.com/chrootlogin/go-wiki-frontend'
            sh 'sudo docker push docker.bin.dini-mueter.net/simu/go-wiki-frontend:${DOCKER_TAG}'
          }
        }
      }
    }

    stage('Cleanup') {
      steps {
        sh 'rm -rf *'
      }
    }

    /*stage('Set Git Config') {
      steps {
        sh 'git config --global user.email "system@dini-mueter.net"'
        sh 'git config --global user.name "Jenkins"'
        sh 'git config --global credential.helper cache'
        sh "git config --global credential.helper 'cache --timeout=3600'"
      }
    }

    stage('Set Git Credentials'){
      steps {
        git credentialsId: 'gitea', url: env.GITEA_URL
        git credentialsId: 'github', url: env.GITHUB_URL
      }
    }

    // http://blog.plataformatec.com.br/2013/05/how-to-properly-mirror-a-git-repository/
    stage('Sync repository to Github') {
      steps {
        sh 'git clone --mirror ${GITEA_URL} gitea'
        dir('gitea') {
          sh 'git push --mirror ${GITHUB_URL}'
        }
      }
    }*/
  }
}

def GetDockerTag() {
  return env.BRANCH_NAME == "master" ? "latest" : env.BRANCH_NAME.replaceAll('/','-')
}