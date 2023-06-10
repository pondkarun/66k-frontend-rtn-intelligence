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
                        step([
                                $class: 'DockerBuilderPublisher',
                                cleanImages: false,
                                cleanupWithJenkinsJobDelete: false,
                                cloud: '',
                                dockerFileDirectory: 'Dockerfile',
                                fromRegistry: [],
                                pushCredentialsId: 'docker',
                                pushOnSuccess: true,
                                tagsString: "cmtttbrother/66k-rtn-intelligence:$VERSION"
                            ])
                    cleanWs()
                }
            }
        }
    }
}