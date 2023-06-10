pipeline {
    agent { label "dev1"}
    parameters {
        string(name: 'VERSION', trim: true)
    }
    stages {
        stage('Build & Push') {
            steps{
                script{
                    docker=docker.build("cmtttbrother/66k-rtn-intelligence", "--platform linux/amd64 --build-arg --no-cache --pull --force-rm -f Dockerfile .")
                    docker.push(params.VERSION)
                    cleanWs()
                }
            }
        }
        stage('Deploy') {
            steps{
                script{
                    sh "docker run -d -p 7123:3100 cmtttbrother/66k-rtn-intelligence:" + params.VERSION
                    cleanWs()
                }
            }
        }
    }
}