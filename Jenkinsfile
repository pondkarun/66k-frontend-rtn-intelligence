pipeline {
    agent { label "dev1"}
    parameters {
        string(name: 'VERSION', trim: true)
    }
    stages {
        stage('Build & Push') {
            steps{
                script{
                    withDockerRegistry(credentialsId: "dockerhub") {
                        docker=docker.build("cmtttbrother/66k-rtn-intelligence", "--platform linux/amd64 --build-arg --no-cache --pull --force-rm -f Dockerfile .")
                        docker.push(params.VERSION)
                        cleanWs()
                    }
                }
            }
        }
        stage('Deploy') {
            steps{
                script{
                    PORT="3100"
                    sh "docker run -d -e PORT=${PORT} -p 7123:${PORT} cmtttbrother/66k-rtn-intelligence:" + params.VERSION
                    cleanWs()
                }
            }
        }
    }
}