pipeline {
    agent { label "dev1"}
    parameters {
        string(name: 'VERSION', trim: true)
    }
    stages {
        stage('Build & Push') {
            steps{
                script{
                    cleanWs()
                        docker=docker.build("cmtttbrother/66k-rtn-intelligence", " --build-arg --no-cache --pull --force-rm -f Dockerfile .")
                        docker.push("${VERSION}")
                    cleanWs()
                }
            }
        }
    }
}